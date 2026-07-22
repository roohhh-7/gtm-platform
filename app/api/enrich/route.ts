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

    // Trigger real Clay webhook for each company
    let successCount = 0;
    
    // Process them in parallel for speed, but catch errors to ensure we count successes
    const promises = (companies || []).map(async (company) => {
      try {
        const clayResponse = await fetch('https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-aa994a31-14dd-46e9-80e0-5fbfe6d16566', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_id: company.id, domain: company.domain }),
        });

        if (clayResponse.ok) {
          successCount++;
        } else {
          console.error(`Failed to trigger Clay for ${company.name}: ${clayResponse.status}`);
        }
      } catch (err) {
        console.error(`Error triggering Clay for ${company.name}:`, err);
      }
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true, enrichedCount: successCount });
  } catch (error: any) {
    console.error('Enrichment API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
