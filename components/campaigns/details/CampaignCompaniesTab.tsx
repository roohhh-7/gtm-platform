'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CompaniesSpreadsheet } from '@/components/companies/CompaniesSpreadsheet';
import { companyService } from '@/services/companies';
import { CampaignCompany } from '@/types';
import AddCompanyModal from '@/components/companies/AddCompanyModal';
import { FileSpreadsheet, Plus, Download, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

type Props = {
  campaignId: string;
};

export function CampaignCompaniesTab({ campaignId }: Props) {
  const [campaignCompanies, setCampaignCompanies] = useState<CampaignCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Selection and Enrichment State
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');

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
      why_recommended: cc.why_recommended,
      clay_enriched: cc.company!.raw_data?._clay_enriched === true
    }));

  const handleEnrichSelected = async () => {
    if (selectedRows.length === 0) return;
    
    // Add all selected ids to enriching set
    const idsToEnrich = selectedRows.map(r => r.id);
    setEnrichingIds(prev => new Set([...prev, ...idsToEnrich]));
    
    // In a real application, you would either send all IDs to a bulk endpoint
    // or iterate through them. Here we iterate and call the trigger endpoint.
    let successCount = 0;
    
    for (const row of selectedRows) {
      if (row.clay_enriched) continue; // Skip already enriched
      
      try {
        const response = await fetch('/api/clay/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            company_id: row.id, 
            domain: row.domain 
          })
        });
        
        if (response.ok) {
          successCount++;
        }
      } catch (err) {
        console.error(`Failed to enrich ${row.name}`, err);
      }
    }
    
    // Typically, Clay enrichment is asynchronous (webhook returns later).
    // For UI demonstration, we'll keep them in enriching state for a few seconds.
    setToast(`Sent ${successCount} companies to Clay for enrichment!`);
    setTimeout(() => setToast(''), 4000);
    
    setTimeout(() => {
      setEnrichingIds(prev => {
        const next = new Set(prev);
        idsToEnrich.forEach(id => next.delete(id));
        return next;
      });
      // Optionally re-fetch to get updated data if webhooks returned fast enough
      fetchCompanies();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-emerald-900 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5" />
          {toast}
        </div>
      )}

      {/* Toolbar */}
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
          {selectedRows.length > 0 && (
            <>
              <div className="h-4 w-px bg-neutral-700" />
              <span className="text-indigo-400 font-medium">
                {selectedRows.length} selected
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input placeholder="Search companies..." icon={true} className="h-8 text-xs bg-neutral-950 border-neutral-800" />
          </div>
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
              <Button 
                onClick={handleEnrichSelected}
                variant="secondary" 
                size="sm" 
                className="h-8 gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 mr-2"
                disabled={enrichingIds.size > 0}
              >
                {enrichingIds.size > 0 ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Enrich Selected
              </Button>
            )}
            <Button onClick={() => setIsAddModalOpen(true)} variant="secondary" size="sm" className="h-8 gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300">
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </Button>
            <Button variant="secondary" size="sm" className="h-8 gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300">
              <Plus className="w-3.5 h-3.5" />
              Add Column
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
        <CompaniesSpreadsheet 
          data={tableData} 
          onSelectionChange={setSelectedRows}
          enrichingIds={enrichingIds}
        />
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
