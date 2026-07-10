import { createClient } from '@/lib/supabase/client';
import { OutreachEmail } from '@/types';

export const outreachService = {
  // Get all outreach emails for a specific campaign
  async getCampaignOutreachEmails(campaignId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('outreach_emails')
      .select('*')
      .eq('campaign_id', campaignId);

    return { outreachEmails: data as OutreachEmail[] | null, error };
  },

  // Get outreach email for a specific contact
  async getOutreachEmail(campaignId: string, contactId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('outreach_emails')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('contact_id', contactId)
      .maybeSingle();

    return { outreachEmail: data as OutreachEmail | null, error };
  },

  // Save or update an outreach email
  async saveOutreachEmail(campaignId: string, contactId: string, emailData: Partial<OutreachEmail>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('outreach_emails')
      .upsert(
        {
          user_id: user.id,
          campaign_id: campaignId,
          contact_id: contactId,
          ...emailData,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'campaign_id,contact_id' }
      )
      .select()
      .single();

    return { outreachEmail: data as OutreachEmail | null, error };
  },
  
  // Update the status of an outreach email
  async updateStatus(id: string, status: OutreachEmail['status']) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('outreach_emails')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { outreachEmail: data as OutreachEmail | null, error };
  }
};
