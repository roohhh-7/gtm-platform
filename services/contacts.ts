import { createClient } from '@/lib/supabase/client';
import { Contact, CampaignContact } from '@/types';

export const contactService = {
  // Global view: Get all contacts across all campaigns, including company info
  async getAllContacts() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contacts')
      .select('*, company:companies(*)')
      .order('created_at', { ascending: false });

    return { contacts: data as Contact[] | null, error };
  },

  // Global view of all contacts assigned to ANY campaign, used for grouped view
  async getAllCampaignContacts() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaign_contacts')
      .select(`
        status,
        added_at,
        campaign_id,
        campaign:campaigns(name),
        contact_id,
        contact:contacts(
          *,
          company:companies(*)
        )
      `)
      .order('added_at', { ascending: false });

    return { campaignContacts: data as any[] | null, error };
  },

  // Campaign-specific view: Get contacts assigned to a specific campaign
  async getCampaignContacts(campaignId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaign_contacts')
      .select(`
        status,
        added_at,
        campaign_id,
        campaign:campaigns(name),
        contact_id,
        contact:contacts(
          *,
          company:companies(*)
        )
      `)
      .eq('campaign_id', campaignId)
      .order('added_at', { ascending: false });

    return { campaignContacts: data as CampaignContact[] | null, error };
  },

  // Add a contact and link it to a campaign
  async addContactToCampaign(campaignId: string, companyId: string, contactData: Partial<Contact>, status: CampaignContact['status'] = 'prospect') {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Create the contact
    const { data: newContact, error: contactError } = await supabase
      .from('contacts')
      .insert({
        user_id: user.id,
        company_id: companyId,
        ...contactData,
      })
      .select()
      .single();

    if (contactError || !newContact) return { error: contactError };

    // 2. Link it to the campaign
    const { data: linkData, error: linkError } = await supabase
      .from('campaign_contacts')
      .insert({
        campaign_id: campaignId,
        contact_id: newContact.id,
        status,
      })
      .select()
      .single();

    return { contact: newContact, link: linkData, error: linkError };
  },
  
  // Link an existing contact to a campaign
  async linkExistingContactToCampaign(campaignId: string, contactId: string, status: CampaignContact['status'] = 'prospect') {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaign_contacts')
      .insert({
        campaign_id: campaignId,
        contact_id: contactId,
        status,
      })
      .select()
      .single();

    return { link: data as CampaignContact | null, error };
  },

  // Update status in a campaign
  async updateCampaignContactStatus(campaignId: string, contactId: string, status: CampaignContact['status']) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaign_contacts')
      .update({ status })
      .eq('campaign_id', campaignId)
      .eq('contact_id', contactId)
      .select()
      .single();

    return { link: data as CampaignContact | null, error };
  }
};
