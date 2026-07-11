'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Play, Download, Loader2, FileSpreadsheet, Plus, CheckCircle2, Users, Building2, Sparkles } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { MockResearchFlow } from './MockResearchFlow';
import { createClient } from '@/lib/supabase/client';
import { contactService } from '@/services/contacts';

type Props = {
  company: any;
  campaignId: string;
};

export function CompanySpreadsheetView({ company, campaignId }: Props) {
  const [activeTab, setActiveTab] = useState<'company' | 'people' | 'research'>('company');
  
  // Local Company state for real-time updates
  const [localCompany, setLocalCompany] = useState(company);
  
  // Update local company if props change
  useEffect(() => {
    setLocalCompany(company);
  }, [company]);

  // Derived state to check if the company was actually enriched by Clay (not just Apollo data)
  const isClayEnriched = localCompany.raw_data?._clay_enriched === true;

  // Research State (now specifically for the AI tab)
  const [researchStatus, setResearchStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle');
  
  // Clay Enrichment State
  const [clayStatus, setClayStatus] = useState<'idle' | 'enriching' | 'complete' | 'error'>(
    isClayEnriched ? 'complete' : 'idle'
  );
  
  const [showReport, setShowReport] = useState(false);
  const [researchData, setResearchData] = useState<string[] | null>(null);

  // Poll for Clay Enrichment updates continuously if not enriched yet
  // This ensures it updates even if the user triggers the webhook manually from Clay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isClayEnriched) {
      interval = setInterval(async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', localCompany.id)
            .single();
            
          if (data && data.raw_data && data.raw_data._clay_enriched) {
            setLocalCompany(data);
            setClayStatus('complete');
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    }
  }, [isClayEnriched, localCompany.id]);

  // People State
  const [peopleData, setPeopleData] = useState<any[]>([]);
  const [peopleStatus, setPeopleStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle');

  // Enrichment (Clay) State for People
  const [enrichingPersonIds, setEnrichingPersonIds] = useState<Set<number>>(new Set());

  // Fetch people when tab is clicked for the first time
  useEffect(() => {
    if (activeTab === 'people' && peopleStatus === 'idle') {
      fetchPeople();
    }
  }, [activeTab]);

  const fetchPeople = async () => {
    setPeopleStatus('loading');
    try {
      const supabase = createClient();
      
      // 1. Check if we already have contacts for this company in this campaign
      const { data: existingLinks, error: linkError } = await supabase
        .from('campaign_contacts')
        .select(`contact_id, contact:contacts(*)`)
        .eq('campaign_id', campaignId);
        
      if (!linkError && existingLinks && existingLinks.length > 0) {
        // Filter contacts that belong to this company
        const existingContacts = existingLinks
          .map(link => link.contact)
          .filter((contact: any) => contact && contact.company_id === company.id);
          
        if (existingContacts.length > 0) {
          // Format for UI
          const formatted = existingContacts.map((c: any) => ({
            id: c.id,
            name: c.name,
            title: c.role,
            email: c.email,
            linkedin: c.linkedin_url || '#'
          }));
          setPeopleData(formatted);
          setPeopleStatus('complete');
          return;
        }
      }

      // 2. If no existing contacts, fetch from Apollo API (or Mock)
      const response = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: company.domain })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch people');
      }
      
      const newContacts = result.contacts || [];
      
      // 3. Save these new contacts to Supabase so they show up globally
      for (const contact of newContacts) {
        await contactService.addContactToCampaign(campaignId, company.id, {
          name: contact.name,
          role: contact.title,
          email: contact.email,
          linkedin_url: contact.linkedin !== '#' ? contact.linkedin : undefined
        });
      }

      setPeopleData(newContacts);
      setPeopleStatus('complete');
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setPeopleStatus('error');
    }
  };

  const handleResearch = () => {
    if (researchStatus !== 'idle') return;
    // Set to complete immediately so the Action Cell button updates
    setResearchStatus('complete');
    // Show the MockResearchFlow component which has its own built-in mock loading animation
    setShowReport(true);
  };

  const handleClayCompanyEnrichment = async () => {
    if (clayStatus !== 'idle') return;
    setClayStatus('enriching');
    
    try {
      // Send a POST request to our internal API route to avoid CORS issues
      const response = await fetch('/api/clay/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          company_id: localCompany.id, 
          domain: localCompany.domain 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send data to Clay');
      }
      
      // We don't alert here anymore, we just let the polling take over
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setClayStatus('error');
      setTimeout(() => setClayStatus('idle'), 3000);
    }
  };

  const handleEnrichPerson = async (personId: number) => {
    // In a real app, this would hit the Clay webhook with the person's info
    setEnrichingPersonIds(prev => new Set(prev).add(personId));
    
    try {
      // Simulate API call to Clay webhook
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Sent to Clay successfully! (This is a simulation since Clay webhooks are usually asynchronous)');
    } catch (e) {
      console.error(e);
    } finally {
      setEnrichingPersonIds(prev => {
        const next = new Set(prev);
        next.delete(personId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-800 pb-px">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'company' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company Details
        </button>
        <button
          onClick={() => setActiveTab('people')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'people' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
          }`}
        >
          <Users className="w-4 h-4" />
          People
        </button>
        <button
          onClick={() => setActiveTab('research')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'research' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Research
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-neutral-900 border-x border-t border-neutral-800 rounded-t-xl px-4 py-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-white font-medium">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            {activeTab === 'company' ? 'Company Data' : 'People Data'}
          </div>
          <div className="h-4 w-px bg-neutral-700" />
          <span className="text-neutral-400">
            {activeTab === 'company' ? '1 row' : `${peopleData.length} rows`}
          </span>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Spreadsheet Container */}
      <div className="border border-neutral-800 bg-neutral-900/50 rounded-b-xl overflow-x-auto -mt-6">
        <Table className="min-w-max border-collapse">
          {activeTab === 'company' ? (
            // COMPANY TAB
            <>
              <TableHeader>
                <TableRow className="border-neutral-800 bg-neutral-900/80 hover:bg-neutral-900/80">
                  <TableHead className="w-12 border-r border-neutral-800 text-center">#</TableHead>
                  <TableHead className="w-48 border-r border-neutral-800">Company</TableHead>
                  <TableHead className="w-40 border-r border-neutral-800">Domain</TableHead>
                  <TableHead className="w-48 border-r border-neutral-800">Industry</TableHead>
                  <TableHead className="w-32 border-r border-neutral-800">Employees</TableHead>
                  <TableHead className="w-32 border-r border-neutral-800">Country</TableHead>
                  
                  {/* Action Column */}
                  <TableHead className="w-40 bg-indigo-500/5 text-indigo-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Enrichment
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-neutral-800 hover:bg-neutral-800/30">
                  <TableCell className="border-r border-neutral-800 text-center text-neutral-500 text-xs">1</TableCell>
                  <TableCell className="border-r border-neutral-800 font-medium text-white">{localCompany.name}</TableCell>
                  <TableCell className="border-r border-neutral-800 text-blue-400">
                    <a href={`https://${localCompany.domain}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {localCompany.domain || 'website.com'}
                    </a>
                  </TableCell>
                  <TableCell className="border-r border-neutral-800 text-neutral-300">{localCompany.industry || '-'}</TableCell>
                  <TableCell className="border-r border-neutral-800 text-neutral-300">{localCompany.employees || '-'}</TableCell>
                  <TableCell className="border-r border-neutral-800 text-neutral-300">{localCompany.country || '-'}</TableCell>
                  
                  {/* Enrich Action Cell */}
                  <TableCell className="p-0 relative bg-indigo-500/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!isClayEnriched ? (
                        clayStatus === 'enriching' ? (
                          <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Enriching...
                          </div>
                        ) : (
                          <button 
                            onClick={handleClayCompanyEnrichment}
                            className="flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors text-xs font-medium border border-indigo-500/20"
                          >
                            <Sparkles className="w-3 h-3" />
                            Enrich with Clay
                          </button>
                        )
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium px-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Enriched
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </>
          ) : (
            // PEOPLE TAB
            <>
              <TableHeader>
                <TableRow className="border-neutral-800 bg-neutral-900/80 hover:bg-neutral-900/80">
                  <TableHead className="w-12 border-r border-neutral-800 text-center">#</TableHead>
                  <TableHead className="w-48 border-r border-neutral-800">Contact Name</TableHead>
                  <TableHead className="w-56 border-r border-neutral-800">Job Title</TableHead>
                  <TableHead className="w-64 border-r border-neutral-800">Email Address</TableHead>
                  <TableHead className="w-48 border-r border-neutral-800">LinkedIn Profile</TableHead>
                  
                  {/* Enrich Action Column */}
                  <TableHead className="w-40 bg-indigo-500/5 text-indigo-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Enrich (Clay)
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {peopleStatus === 'loading' && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-neutral-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                        Fetching people from Apollo...
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {peopleStatus === 'error' && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-red-400">
                      Failed to load people.
                    </TableCell>
                  </TableRow>
                )}
                {peopleStatus === 'complete' && peopleData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-neutral-400">
                      No people found for {company.domain}.
                    </TableCell>
                  </TableRow>
                )}
                {peopleStatus === 'complete' && peopleData.map((person, index) => (
                  <TableRow key={person.id} className="border-neutral-800 hover:bg-neutral-800/30">
                    <TableCell className="border-r border-neutral-800 text-center text-neutral-500 text-xs">{index + 1}</TableCell>
                    <TableCell className="border-r border-neutral-800 font-medium text-white">{person.name}</TableCell>
                    <TableCell className="border-r border-neutral-800 text-neutral-300">{person.title}</TableCell>
                    <TableCell className="border-r border-neutral-800 text-emerald-400">{person.email}</TableCell>
                    <TableCell className="border-r border-neutral-800 text-blue-400">
                      {person.linkedin !== '#' ? (
                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-xs">View Profile</a>
                      ) : '-'}
                    </TableCell>
                    
                    {/* Enrich Action Cell */}
                    <TableCell className="p-0 relative bg-indigo-500/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          onClick={() => handleEnrichPerson(person.id)}
                          disabled={enrichingPersonIds.has(person.id)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 disabled:opacity-50 transition-colors text-xs font-medium border border-indigo-500/20"
                        >
                          {enrichingPersonIds.has(person.id) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3 fill-current" />
                          )}
                          Send to Clay
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </div>

      {/* Render Clay Enriched Data when available */}
      {activeTab === 'company' && isClayEnriched && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-medium text-white">Clay Enrichment Data</h2>
            <Badge variant="success" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Successfully Enriched
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(localCompany.raw_data)
              .filter(([key, value]) => key !== '_clay_enriched' && value && typeof value === 'string' && value.trim().length > 0)
              .map(([key, value]) => (
                <div key={key} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-center">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">{key}</p>
                  {String(value).startsWith('http') ? (
                    <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline truncate" title={String(value)}>
                      {String(value)}
                    </a>
                  ) : (
                    <p className="text-sm text-neutral-200 line-clamp-3" title={String(value)}>
                      {String(value)}
                    </p>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Render AI Research Flow in the dedicated tab */}
      {activeTab === 'research' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-medium text-white">AI Company Intelligence</h2>
            {showReport && (
              <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>
          
          {!showReport ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 border border-neutral-800 bg-neutral-900/30 rounded-xl border-dashed">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Deep AI Research</h3>
              <p className="text-neutral-400 text-center max-w-md mb-8">
                Generate a comprehensive intelligence report for {localCompany.name} using AI. This will analyze growth signals, tech stack, and generate personalized outreach angles.
              </p>
              <Button 
                onClick={handleResearch} 
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                disabled={!isClayEnriched}
                title={!isClayEnriched ? "Enrich with Clay first" : "Run Research"}
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                {isClayEnriched ? "Run Deep Research" : "Enrich Company First"}
              </Button>
            </div>
          ) : (
            <MockResearchFlow 
              companyName={localCompany.name} 
              skipLoading={researchStatus === 'complete'} 
              researchData={researchData} 
              rawData={localCompany.raw_data} 
            />
          )}
        </div>
      )}
    </div>
  );
}
