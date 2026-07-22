import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Mock enrichment endpoint
export async function POST(req: NextRequest) {
  try {
    const { companyIds } = await req.json();

    if (!companyIds || !Array.isArray(companyIds)) {
      return NextResponse.json({ error: 'Invalid companyIds array' }, { status: 400 });
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

    // Fetch the companies to enrich
    const { data: companies, error: fetchError } = await supabase
      .from('companies')
      .select('*')
      .in('id', companyIds);

    if (fetchError) {
      throw new Error(`Failed to fetch companies: ${fetchError.message}`);
    }

    // Process each company and add mock enriched data
    for (const company of companies || []) {
      const existingRawData = company.raw_data || {};
      
      const enrichedData = {
        ...existingRawData,
        _clay_enriched: true,
        TYPE: 'Privately Held',
        DOMAIN: company.domain ? `http://www.${company.domain}` : `http://www.${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        COUNTRY: company.country || 'US',
        LOCALITY: 'Basking Ridge, New Jersey',
        LOGO_URL: 'https://d878vporrm2hj.cloudfront.net/placeholder-logo.png',
        TECH_STACK: 'Amazon, Amazon California Region, nginx, jQuery, Drip, YouTube IFrame API, D3 JS, reCAPTCHA',
        DESCRIPTION: `${company.name} is an innovative company providing global solutions across various industries.`,
        LINKEDIN_URL: `https://www.linkedin.com/company/${company.domain ? company.domain.split('.')[0] : company.name.toLowerCase().replace(/\s+/g, '')}`,
      };

      await supabase
        .from('companies')
        .update({
          raw_data: enrichedData
        })
        .eq('id', company.id);
    }

    return NextResponse.json({ success: true, enrichedCount: (companies || []).length });
  } catch (error: any) {
    console.error('Enrichment API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
