const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://tuqjceqmgofwkvgxcwpl.supabase.co', 'sb_publishable_B6iEeDcxl46mfcQ_ITfVRw_XLL0FcuE');
async function test() {
  const { data, error } = await supabase.from('campaign_companies').select('campaign_id, company_id, company:companies(domain)').limit(5);
  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}
test();
