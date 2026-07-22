'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Search, Loader2, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { companyService } from '@/services/companies';
import { createClient } from '@/lib/supabase/client';

type Props = {
  campaignId: string;
};

export function CampaignProspectDiscoveryTab({ campaignId }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prospects, setProspects] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleFindCompanies = async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    setProspects([]);
    setSelectedIds(new Set());
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/prospect-discovery', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ campaignId, refresh: forceRefresh || hasSearched })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prospects');
      }
      
      setProspects(data.candidates || []);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      const selectedProspects = prospects.filter((p, idx) => {
        const uid = p.domain || p.name || `prospect-${idx}`;
        return selectedIds.has(uid);
      });
      await companyService.saveSelectedProspects(campaignId, selectedProspects);
      
      setToast('Successfully saved selected prospects!');
      
      // Simulate toast duration, then switch tab
      setTimeout(() => {
        const companiesTabTrigger = document.querySelector<HTMLButtonElement>('button[value="companies"]');
        if (companiesTabTrigger) {
          companiesTabTrigger.click();
        }
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
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

      {!loading && prospects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
          <div className="bg-neutral-800/50 p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-neutral-400" />
          </div>
          <h2 className="text-lg font-medium text-white mb-2">
            {hasSearched ? 'No Companies Found' : 'Find Your Target Companies'}
          </h2>
          <p className="text-sm text-neutral-400 max-w-md mb-6">
            {hasSearched 
              ? 'We couldn\'t find any companies matching your criteria. Try loosening your ICP parameters.'
              : 'We will use your defined ICP to search our database and rank the best potential matches for this campaign using Orbital Decision Engine.'}
          </p>
          <button
            onClick={() => handleFindCompanies()}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
          >
            <Search className="h-4 w-4" />
            {hasSearched ? 'Search Again' : 'Find Companies'}
          </button>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </Card>
      ) : loading ? (
        <Card className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mb-4" />
          <p className="text-neutral-400 text-sm">Searching Apollo and ranking candidates...</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-800 sticky top-4 z-10 shadow-xl">
            <div>
              <h2 className="text-lg font-medium text-white">Top Recommended Companies</h2>
              <p className="text-sm text-neutral-400">Select 1-3 companies to add to your campaign.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={selectedIds.size === 0 || saving}
              className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
              {saving ? 'Saving...' : `Add to Table (${selectedIds.size})`}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {prospects.map((prospect, idx) => {
              // some prospects might not have a domain, use name or idx as fallback
              const uid = prospect.domain || prospect.name || `prospect-${idx}`;
              const isSelected = selectedIds.has(uid);
              
              return (
                <Card 
                  key={uid} 
                  className={`transition-colors cursor-pointer ${isSelected ? 'border-neutral-500 bg-neutral-800/30' : 'hover:border-neutral-700'}`}
                  onClick={() => toggleSelection(uid)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-white border-white' : 'border-neutral-600'}`}>
                      {isSelected && <Check className="h-3 w-3 text-black" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-base font-medium text-white">{prospect.name}</h3>
                          <a href={`https://${prospect.domain}`} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                            {prospect.domain}
                          </a>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-neutral-800 text-xs font-medium border border-neutral-700">
                            <span className="text-emerald-400 mr-1">{prospect.ai_fit_score}</span>
                            <span className="text-neutral-400">Fit Score</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-neutral-500 block text-xs mb-0.5">Industry</span>
                          <span className="text-neutral-300">{prospect.industry}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-xs mb-0.5">Employees</span>
                          <span className="text-neutral-300">{prospect.employees}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-xs mb-0.5">Location</span>
                          <span className="text-neutral-300">{prospect.country}</span>
                        </div>
                      </div>

                      <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-800/50">
                        <span className="text-xs font-medium text-neutral-400 block mb-2">Why Recommended</span>
                        <ul className="space-y-1.5">
                          {prospect.why_recommended?.map((reason: string, i: number) => (
                            <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
