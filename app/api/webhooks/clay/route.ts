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

    // Clay will need to send back the company_id or the domain so we can match it.
    // Let's assume Clay passes back a "company_id" field in the root of the JSON payload.
    const companyId = payload.company_id;

    if (!companyId) {
      console.error('Webhook Error: Missing company_id in payload');
      return NextResponse.json({ error: 'Missing company_id' }, { status: 400 });
    }

    // Store the raw enriched data in the company's raw_data column
    const { error: updateError } = await supabaseAdmin
      .from('companies')
      .update({
        raw_data: payload,
      })
      .eq('id', companyId);

    if (updateError) {
      console.error('Webhook DB Update Error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Clay Webhook Parsing Error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
