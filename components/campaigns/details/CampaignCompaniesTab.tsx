'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CompaniesTable } from '@/components/companies/CompaniesTable';
import { companyService } from '@/services/companies';
import { CampaignCompany } from '@/types';
import AddCompanyModal from '@/components/companies/AddCompanyModal';
import { FileSpreadsheet, Plus, Download } from 'lucide-react';

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
      domain: cc.company!.domain,
      country: cc.company!.country,
      industry: cc.company!.industry,
      employees: cc.company!.employees,
      status: cc.status,
      tags: cc.company!.tags || [],
      ai_fit_score: cc.ai_fit_score,
      why_recommended: cc.why_recommended
    }));

  return (
    <div className="space-y-6">
      {/* Toolbar - Matches Spreadsheet View */}
      <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-white font-medium">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            Company Data
          </div>
          <div className="h-4 w-px bg-neutral-700" />
          <span className="text-neutral-400">
            {tableData.length} {tableData.length === 1 ? 'row' : 'rows'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input placeholder="Search companies..." icon={true} className="h-8 text-xs bg-neutral-950 border-neutral-800" />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAddModalOpen(true)} variant="secondary" size="sm" className="h-8 gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300">
              <Plus className="w-3.5 h-3.5" />
              Add Company
            </Button>
            <Button variant="secondary" size="sm" className="h-8 gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Spreadsheet Container */}
      {loading ? (
        <Card className="p-0 border border-neutral-800 bg-neutral-900/50">
          <div className="py-12 flex justify-center text-neutral-500">Loading companies...</div>
        </Card>
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
    </div>
  );
}
