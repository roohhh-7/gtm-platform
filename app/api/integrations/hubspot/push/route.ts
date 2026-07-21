import { NextResponse } from 'next/server';
import { syncCompanyToHubSpot } from '@/lib/hubspot';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { companyId } = await request.json();

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
    if (!hubspotToken) {
      return NextResponse.json({ error: 'HubSpot Access Token is not configured.' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch the company data
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error || !company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Sync to HubSpot
    const hubspotCompanyId = await syncCompanyToHubSpot(company, hubspotToken);

    return NextResponse.json({ success: true, hubspotCompanyId });
  } catch (error: any) {
    console.error('HubSpot Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
