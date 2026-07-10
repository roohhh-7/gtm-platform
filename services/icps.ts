import { createClient } from '@/lib/supabase/client';
import { ICP } from '@/types';

export const icpService = {
  async getICP(campaignId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('icps')
      .select('*')
      .eq('campaign_id', campaignId)
      .maybeSingle();

    return { icp: data as ICP | null, error };
  },

  async upsertICP(campaignId: string, icpData: Partial<ICP>) {
    const supabase = createClient();
    
    // Get current user to link the ICP
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('icps')
      .upsert({
        campaign_id: campaignId,
        user_id: user.id,
        updated_at: new Date().toISOString(),
        ...icpData,
      }, { onConflict: 'campaign_id' })
      .select()
      .single();

    return { icp: data as ICP | null, error };
  }
};
