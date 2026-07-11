import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We use the service role key here to bypass RLS since webhooks come from an external service without a user session.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log('Received Clay Webhook:', payload);

    // Clay will need to send back the domain so we can match it.
    // In a Clay Export, the keys match the column names exactly.
    let rawDomain = payload.domain || payload.Domain || payload.website || payload.Website;
    
    // Sometimes Clay nests the row data inside a 'rows' array or 'data' object depending on export type
    if (!rawDomain && payload.rows && payload.rows.length > 0) {
      const row = payload.rows[0];
      rawDomain = row.domain || row.Domain || row.website || row.Website;
    }

    if (!rawDomain) {
      console.error('Webhook Error: Missing domain/website in payload', payload);
      return NextResponse.json({ error: 'Missing domain' }, { status: 400 });
    }

    // Clean the domain: remove http://, https://, www., and trailing slashes
    let domain = typeof rawDomain === 'string' 
      ? rawDomain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0].toLowerCase().trim() 
      : '';

    // Mark the payload as coming from Clay so the UI can distinguish it from Apollo data
    const enrichedPayload = {
      ...payload,
      _clay_enriched: true
    };

    // Store the raw enriched data in the company's raw_data column
    const { data, error: updateError } = await supabaseAdmin
      .from('companies')
      .update({
        raw_data: enrichedPayload,
      })
      .eq('domain', domain)
      .select();

    if (updateError) {
      console.error('Webhook DB Update Error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error('Webhook DB Update Error: 0 rows updated. Check RLS or Domain Match.');
      return NextResponse.json({ error: '0 rows updated. Missing Service Role Key or Domain mismatch.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, updated: data.length });
  } catch (err: any) {
    console.error('Clay Webhook Parsing Error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
