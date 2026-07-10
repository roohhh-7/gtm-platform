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

    // 1. Credit-First Architecture: Check for existing prospects
    if (!refresh) {
      const { data: existingProspects, error: existingError } = await supabase
        .from('campaign_companies')
        .select('*, company:companies(*)')
        .eq('campaign_id', campaignId)
        .eq('status', 'prospect');

      if (!existingError && existingProspects && existingProspects.length > 0) {
        
        // Check if ICP was updated AFTER the most recent prospect was added
        const maxAddedAt = Math.max(...existingProspects.map(p => new Date(p.added_at).getTime()));
        const icpUpdatedAt = icp.updated_at ? new Date(icp.updated_at).getTime() : 0;
        const isOutdated = icpUpdatedAt > maxAddedAt;

        // Return existing candidates mapped to expected format
        const candidates = existingProspects.map(cp => ({
          ...cp.company,
          country: cp.company.raw_data?.country || 'Unknown',
          ai_fit_score: cp.ai_fit_score,
          why_recommended: cp.why_recommended || []
        }));
        // Sort by score
        candidates.sort((a, b) => (b.ai_fit_score || 0) - (a.ai_fit_score || 0));
        return NextResponse.json({ candidates, isOutdated });
      }
    } else {
      // If we are forcing a refresh, delete the old prospects from this campaign first
      await supabase
        .from('campaign_companies')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('status', 'prospect');
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

    // 4. Return Top 10
    const top10 = rankedCompanies.slice(0, 10);

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
