'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CompaniesTable } from '@/components/companies/CompaniesTable';
import { companyService } from '@/services/companies';
import { CampaignCompany } from '@/types';
import AddCompanyModal from '@/components/companies/AddCompanyModal';

type Props = {
  campaignId: string;
};

export function CampaignCompaniesTab({ campaignId }: Props) {
  const [campaignCompanies, setCampaignCompanies] = useState<CampaignCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    const { campaignCompanies: data } = await companyService.getCampaignCompanies(campaignId);
    if (data) setCampaignCompanies(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, [campaignId]);

  const tableData = campaignCompanies
    .filter(cc => cc.company)
    .map(cc => ({
      id: cc.company!.id,
      campaignId: campaignId,
      name: cc.company!.name,
      industry: cc.company!.industry,
      employees: cc.company!.employees,
      status: cc.status,
      tags: cc.company!.tags || [],
      ai_fit_score: cc.ai_fit_score,
      why_recommended: cc.why_recommended
    }));

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b border-neutral-800/60 flex items-center justify-between">
        <div className="w-72">
          <Input placeholder="Search companies..." icon={true} />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} variant="secondary" size="sm">
          Add Company
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-neutral-500">Loading companies...</div>
      ) : (
        <CompaniesTable data={tableData} />
      )}

      <AddCompanyModal 
        isOpen={isAddModalOpen}
        campaignId={campaignId}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchCompanies();
        }}
      />
    </Card>
  );
}
