import { NextResponse } from 'next/server';
import { syncCompanyToHubSpot } from '@/lib/hubspot';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. Rate Limit (Max 30 requests per minute per IP)
    const rateLimitError = checkRateLimit(request, 30, 60);
    if (rateLimitError) return rateLimitError;

    // 2. Authentication Check
    const { user, errorResponse } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    const { companyId } = await request.json();

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
    if (!hubspotToken) {
      return NextResponse.json({ error: 'HubSpot Access Token is not configured.' }, { status: 400 });
    }

    // Initialize Supabase client
    // Use standard client with Authorization header to enforce RLS
    const authHeader = request.headers.get('Authorization') || '';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabase = createClient(
      supabaseUrl, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );
    
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
