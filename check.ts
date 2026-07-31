import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tuqjceqmgofwkvgxcwpl.supabase.co',
  'sb_publishable_B6iEeDcxl46mfcQ_ITfVRw_XLL0FcuE'
);

async function run() {
  const { data: icpData, error: icpError } = await supabase.from('icps').select('*');
  console.log("ICP Error:", icpError);
  console.log("ICP Data:", JSON.stringify(icpData, null, 2));
}

run();
