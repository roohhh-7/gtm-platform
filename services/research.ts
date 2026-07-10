import { createClient } from '@/lib/supabase/client';
import { CompanyResearch, ContactResearch } from '@/types';

export const researchService = {
  // --- Company Research ---
  
  async getCompanyResearch(companyId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('company_research')
      .select('*')
      .eq('company_id', companyId)
      .maybeSingle(); // Use maybeSingle to not error if it doesn't exist yet

    return { research: data as CompanyResearch | null, error };
  },

  async saveCompanyResearch(companyId: string, researchData: Partial<CompanyResearch>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Upsert the research using company_id as the unique key
    const { data, error } = await supabase
      .from('company_research')
      .upsert(
        {
          user_id: user.id,
          company_id: companyId,
          ...researchData,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'company_id' }
      )
      .select()
      .single();

    return { research: data as CompanyResearch | null, error };
  },

  // --- Contact Research ---

  async getContactResearch(contactId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contact_research')
      .select('*')
      .eq('contact_id', contactId)
      .maybeSingle();

    return { research: data as ContactResearch | null, error };
  },

  async saveContactResearch(contactId: string, researchData: Partial<ContactResearch>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('contact_research')
      .upsert(
        {
          user_id: user.id,
          contact_id: contactId,
          ...researchData,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'contact_id' }
      )
      .select()
      .single();

    return { research: data as ContactResearch | null, error };
  }
};
