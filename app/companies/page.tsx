'use client';

import { useState, useEffect } from 'react';
import { CompaniesHeader, CompaniesFilters } from '@/components/companies/CompaniesHeader';
import { CompaniesTable } from '@/components/companies/CompaniesTable';
import { companyService } from '@/services/companies';
import { Company } from '@/types';

export default function CompaniesPage() {
  const [campaignCompanies, setCampaignCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { campaignCompanies: data } = await companyService.getAllCompanies();
      if (data) setCampaignCompanies(data);
      setLoading(false);
    };
    fetchCompanies();
  }, []);

  const tableData = campaignCompanies
    .filter(cc => cc.company)
    .map(cc => ({
      id: cc.company_id,
      campaignId: cc.campaign_id,
      campaignName: cc.campaign?.name,
      name: cc.company.name,
      industry: cc.company.industry,
      employees: cc.company.employees,
      status: cc.status,
      tags: cc.company.tags || [],
      ai_fit_score: cc.ai_fit_score,
      why_recommended: cc.why_recommended
    }));

  return (
    <div className="space-y-6">
      <div>
        <CompaniesHeader />
        <CompaniesFilters />
      </div>
      
      {loading ? (
        <div className="py-12 flex justify-center text-neutral-500">Loading companies...</div>
      ) : (
        <CompaniesTable data={tableData} />
      )}
    </div>
  );
}
