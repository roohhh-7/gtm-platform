import { createClient } from '@/lib/supabase/client';
import { Campaign } from '@/types';

export const campaignService = {
  async getCampaigns({
    search = '',
    status = 'all',
    page = 1,
    limit = 10,
  }: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const supabase = createClient();
    
    let query = supabase
      .from('campaigns')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    } else {
      query = query.neq('status', 'archived'); // Hide archived by default
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    return { campaigns: data as Campaign[] | null, error, count };
  },

  async createCampaign(name: string, industry: string) {
    const supabase = createClient();
    
    // Get current user to link the campaign
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('campaigns')
      .insert([
        {
          name,
          industry,
          user_id: user.id,
          status: 'draft',
        }
      ])
      .select()
      .single();

    return { campaign: data as Campaign | null, error };
  },

  async updateStatus(id: string, status: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaigns')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    return { campaign: data as Campaign | null, error };
  },

  async deleteCampaign(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    return { error };
  }
};
