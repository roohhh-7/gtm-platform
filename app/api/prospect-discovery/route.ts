import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mapIcpToApolloPayload } from '@/services/prospect-discovery/mapper';
import { fetchApolloCandidates } from '@/services/prospect-discovery/apollo';
import { rankCompanies } from '@/services/prospect-discovery/decision-engine';

export async function POST(req: NextRequest) {
  try {
    const { campaignId, refresh } = await req.json();

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required' }, { status: 400 });
    }

    const authHeader = req.headers.get('Authorization') || '';
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: `Not authenticated in API route.` }, { status: 401 });
    }

    // 0. Fetch ICP First to check timestamps
    const { data: icpRows, error: icpError } = await supabase
      .from('icps')
      .select('*')
      .eq('campaign_id', campaignId);

    if (icpError) {
      return NextResponse.json({ error: `Failed to fetch ICP: ${icpError.message}` }, { status: 404 });
    }
    
    if (!icpRows || icpRows.length === 0) {
       return NextResponse.json({ error: `Failed to fetch ICP: 0 rows found for campaign ${campaignId}.` }, { status: 404 });
    }
    
    if (icpRows.length > 1) {
       return NextResponse.json({ error: `Failed to fetch ICP: ${icpRows.length} rows found for campaign ${campaignId}. Expected 1.` }, { status: 404 });
    }

    const icp = icpRows[0];

    // 1. Fetch existing domains for this campaign so we don't suggest companies already in the table
    const { data: existingLinks } = await supabase
      .from('campaign_companies')
      .select('company_id, company:companies(domain)')
      .eq('campaign_id', campaignId);
      
    const existingDomains = new Set<string>();
    if (existingLinks) {
      existingLinks.forEach(link => {
        if (link.company && link.company.domain) {
          existingDomains.add(link.company.domain.toLowerCase());
        }
      });
    }

    if (!icp.titles?.length && !icp.industries?.length && !icp.company_sizes?.length && !icp.locations?.length && !icp.product_description && !icp.problem_statement && !icp.market_segments?.length && !icp.ideal_customer_characteristics) {
      return NextResponse.json({ 
        error: 'Your ICP is completely empty. Please define at least one targeting criteria (e.g. Industry or Target Persona) before searching.' 
      }, { status: 400 });
    }

    // 2. Map payload & APOLLO FETCH
    const apolloKey = process.env.APOLLO_API_KEY;
    if (!apolloKey) {
      return NextResponse.json({ error: 'Integration Error: Apollo API Key is not configured' }, { status: 500 });
    }

    const payload = mapIcpToApolloPayload(icp);
    
    // Using n8n-ready modular architecture, we simply pass the mapped payload to our Apollo service
    const candidatePool = await fetchApolloCandidates(payload, apolloKey);

    if (candidatePool.length === 0) {
      return NextResponse.json({ candidates: [] });
    }

    // 3. DECISION ENGINE (v1) - Deterministic Weighted Scoring
    // n8n-ready: pass the candidate pool and the ICP to the decoupled engine
    const rankedCompanies = rankCompanies(candidatePool, icp);

    // 4. Filter out companies already in the table and return Top 10
    const newCandidates = rankedCompanies.filter(company => {
      const domain = company.domain?.toLowerCase();
      return domain && !existingDomains.has(domain);
    });

    const top10 = newCandidates.slice(0, 10);

    return NextResponse.json({ candidates: top10 });
  } catch (error: any) {
    console.error('Error in Prospect Discovery:', error);
    // Determine if it's an expected API error message from our throw or something else
    const status = error.message?.includes('Integration Error') || error.message?.includes('Apollo') ? 500 : 500;
    
    // For 429 retries
    if (error.message?.includes('currently busy')) {
       return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status });
  }
}
