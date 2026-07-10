import { createClient } from '@/lib/supabase/client';
import { Company, CampaignCompany } from '@/types';

export const companyService = {
  // Global view: Get all campaign_companies across all campaigns
  async getAllCompanies() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaign_companies')
      .select(`
        status,
        added_at,
        campaign_id,
        company_id,
        ai_fit_score,
        why_recommended,
        company:companies(*),
        campaign:campaigns(*)
      `)
      .order('added_at', { ascending: false });

    return { campaignCompanies: data as any[] | null, error };
  },

  // Campaign-specific view: Get companies assigned to a specific campaign
  async getCampaignCompanies(campaignId: string) {
    const supabase = createClient();
    // Use inner join via PostgREST embedding: 
    // campaign_companies with companies
    const { data, error } = await supabase
      .from('campaign_companies')
      .select(`
        status,
        added_at,
        campaign_id,
        company_id,
        company:companies(*)
      `)
      .eq('campaign_id', campaignId)
      .order('added_at', { ascending: false });

    return { campaignCompanies: data as CampaignCompany[] | null, error };
  },

  // Add a company and link it to a campaign
  async addCompanyToCampaign(campaignId: string, companyData: Partial<Company>, status: CampaignCompany['status'] = 'prospect') {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Create the company
    const { data: newCompany, error: companyError } = await supabase
      .from('companies')
      .insert({
        user_id: user.id,
        ...companyData,
      })
      .select()
      .single();

    if (companyError || !newCompany) return { error: companyError };

    // 2. Link it to the campaign
    const { data: linkData, error: linkError } = await supabase
      .from('campaign_companies')
      .insert({
        campaign_id: campaignId,
        company_id: newCompany.id,
        status,
      })
      .select()
      .single();

    return { company: newCompany, link: linkData, error: linkError };
  },
  
  // Link an existing company to a campaign
  async linkExistingCompanyToCampaign(campaignId: string, companyId: string, status: CampaignCompany['status'] = 'prospect') {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaign_companies')
      .insert({
        campaign_id: campaignId,
        company_id: companyId,
        status,
      })
      .select()
      .single();

    return { link: data as CampaignCompany | null, error };
  },

  async updateCampaignCompanyStatus(campaignId: string, companyId: string, status: CampaignCompany['status']) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaign_companies')
      .update({ status })
      .eq('campaign_id', campaignId)
      .eq('company_id', companyId)
      .select()
      .single();

    return { link: data as CampaignCompany | null, error };
  },

  // Bulk save selected prospects with their AI scoring
  async saveSelectedProspects(campaignId: string, prospects: any[]) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const results = [];
    let errorCount = 0;
    
    for (const p of prospects) {
      let companyId;

      // 1. Check if company already exists by domain
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('domain', p.domain)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingCompany) {
        companyId = existingCompany.id;
        
        // Update raw_data if we have it (saves Apollo payload on existing domains)
        if (p.raw_data) {
          await supabase
            .from('companies')
            .update({ raw_data: p.raw_data })
            .eq('id', companyId);
        }
      } else {
        // 2. Create company if it doesn't exist
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            user_id: user.id,
            name: p.name,
            industry: p.industry,
            employees: p.employees,
            domain: p.domain,
            tags: p.tags || [],
            raw_data: p.raw_data || {}
          })
          .select()
          .single();
          
        if (companyError || !newCompany) {
          results.push({ error: companyError });
          errorCount++;
          continue; // Skip linking if company creation failed
        }
        companyId = newCompany.id;
      }
      
      // 3. Link with score and why_recommended (Upsert to prevent duplicates and update scores)
      const { data: linkData, error: linkError } = await supabase
        .from('campaign_companies')
        .upsert({
          campaign_id: campaignId,
          company_id: companyId,
          status: 'prospect',
          ai_fit_score: p.ai_fit_score,
          why_recommended: p.why_recommended,
          added_at: new Date().toISOString()
        }, { onConflict: 'campaign_id,company_id' })
        .select()
        .single();
        
      if (linkError) errorCount++;
      results.push({ companyId, link: linkData, error: linkError });
    }
    
    if (errorCount > 0 && errorCount === prospects.length) {
       throw new Error('Failed to save any of the selected prospects.');
    } else if (errorCount > 0) {
       // Return partial success but we can still notify frontend
       return { results, partialError: `Failed to save ${errorCount} prospects.` };
    }
    
    return { results };
  }
};
