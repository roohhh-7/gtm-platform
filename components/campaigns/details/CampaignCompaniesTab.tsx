'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CompaniesTable } from '@/components/companies/CompaniesTable';
import { companyService } from '@/services/companies';
import { CampaignCompany } from '@/types';
import AddCompanyModal from '@/components/companies/AddCompanyModal';
import { FileSpreadsheet, Plus, Sparkles, Loader2, CheckCircle2, ChevronDown, UploadCloud } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  campaignId: string;
};

export function CampaignCompaniesTab({ campaignId }: Props) {
  const [campaignCompanies, setCampaignCompanies] = useState<CampaignCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Selection and Enrichment State
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');
  const [isEnrichDropdownOpen, setIsEnrichDropdownOpen] = useState(false);
  const [isPushingToHubspot, setIsPushingToHubspot] = useState(false);

  const handlePushToHubspot = async () => {
    if (selectedRows.size === 0) {
      setToast('Please select companies to push to HubSpot.');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    
    setIsPushingToHubspot(true);
    let successCount = 0;
    
    try {
      const promises = Array.from(selectedRows).map(async (companyId) => {
        const response = await fetch('/api/integrations/hubspot/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyId })
        });
        if (response.ok) successCount++;
      });
      
      await Promise.all(promises);
      
      if (successCount > 0) {
        setToast(`Successfully pushed ${successCount} companies to HubSpot!`);
      } else {
        setToast('Failed to push to HubSpot. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setToast('Failed to push to HubSpot. Please try again.');
    } finally {
      setIsPushingToHubspot(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    const { campaignCompanies: data } = await companyService.getCampaignCompanies(campaignId);
    if (data) setCampaignCompanies(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, [campaignId]);

  // Polling for async Clay enrichments
  useEffect(() => {
    if (enrichingIds.size === 0) return;

    const interval = setInterval(() => {
      fetchCompanies();
    }, 5000);

    return () => clearInterval(interval);
  }, [enrichingIds.size]);

  // Re-evaluate enrichingIds whenever campaignCompanies changes
  useEffect(() => {
    if (enrichingIds.size === 0) return;
    
    setEnrichingIds(prev => {
      const next = new Set(prev);
      let changed = false;
      
      campaignCompanies.forEach(cc => {
        if (cc.company?.raw_data?._clay_enriched && next.has(cc.company.id)) {
          next.delete(cc.company.id);
          changed = true;
        }
      });
      
      return changed ? next : prev;
    });
  }, [campaignCompanies]);

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
      clay_enriched: cc.company!.raw_data?._clay_enriched === true,
      enriched_data: cc.company!.raw_data?._clay_enriched ? cc.company!.raw_data : undefined
    }));

  const handleEnrich = async (type: 'selected' | 'all') => {
    let idsToEnrich: string[] = [];
    
    if (type === 'selected') {
      if (selectedRows.size === 0) return;
      idsToEnrich = Array.from(selectedRows);
    } else {
      idsToEnrich = tableData.map(r => r.id);
    }
    
    // Filter out already enriched companies ONLY if enriching all
    if (type === 'all') {
      idsToEnrich = idsToEnrich.filter(id => !tableData.find(r => r.id === id)?.clay_enriched);
    }
    
    if (idsToEnrich.length === 0) {
      setToast('No new companies to enrich.');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    setEnrichingIds(prev => new Set([...prev, ...idsToEnrich]));
    setIsEnrichDropdownOpen(false);
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ companyIds: idsToEnrich })
      });
      
      if (response.ok) {
        const data = await response.json();
        setToast(`Sent ${data.enrichedCount} companies to Clay for enrichment!`);
        setTimeout(() => setToast(''), 4000);
        // We do NOT clear enrichingIds here. The polling useEffect will clear them as they finish.
      } else {
        throw new Error('Failed to start enrichment');
      }
    } catch (err) {
      console.error('Enrichment failed', err);
      setToast('Enrichment failed. Please try again.');
      setTimeout(() => setToast(''), 3000);
      
      // Only on error do we revert the enrichingIds state
      setEnrichingIds(prev => {
        const next = new Set(prev);
        idsToEnrich.forEach(id => next.delete(id));
        return next;
      });
    }
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
          {selectedRows.size > 0 && (
            <>
              <div className="h-4 w-px bg-neutral-700" />
              <span className="text-indigo-400 font-medium">
                {selectedRows.size} selected
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input placeholder="Search companies..." icon={true} className="h-8 text-xs bg-neutral-950 border-neutral-800" />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handlePushToHubspot} 
              disabled={isPushingToHubspot || selectedRows.size === 0} 
              variant="secondary" 
              size="sm" 
              className="h-8 gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            >
              {isPushingToHubspot ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              Push to Hubspot
            </Button>
            
            <div className="relative">
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20"
                onClick={() => setIsEnrichDropdownOpen(!isEnrichDropdownOpen)}
                disabled={enrichingIds.size > 0}
              >
                {enrichingIds.size > 0 ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Enrich
                <ChevronDown className="w-3 h-3 opacity-70" />
              </Button>
              
              {isEnrichDropdownOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-neutral-900 border border-neutral-800 rounded-md shadow-lg z-10 overflow-hidden">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
                    onClick={() => handleEnrich('all')}
                  >
                    Enrich Every Row
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleEnrich('selected')}
                    disabled={selectedRows.size === 0}
                  >
                    Enrich Selected
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Container */}
      {loading ? (
        <Card className="p-0 border border-neutral-800 bg-neutral-900/50">
          <div className="py-12 flex justify-center text-neutral-500">Loading companies...</div>
        </Card>
      ) : (
        <CompaniesTable 
          data={tableData} 
          selectedIds={selectedRows}
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
