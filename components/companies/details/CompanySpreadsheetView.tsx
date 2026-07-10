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
  const [activeTab, setActiveTab] = useState<'company' | 'people'>('company');
  
  // Research State
  const [researchStatus, setResearchStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle');
  const [showReport, setShowReport] = useState(false);
  const [researchData, setResearchData] = useState<string[] | null>(null);

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

  const handleResearch = async () => {
    if (researchStatus !== 'idle') return;
    setResearchStatus('loading');
    
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: company.name, domain: company.domain })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to research');
      }
      
      setResearchData(result.report);
      setResearchStatus('complete');
      setShowReport(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setResearchStatus('error');
      setTimeout(() => setResearchStatus('idle'), 3000);
    }
  };

  const handleClayCompanyEnrichment = async () => {
    if (researchStatus !== 'idle') return;
    setResearchStatus('loading');
    
    try {
      // Send a POST request to our internal API route to avoid CORS issues
      const response = await fetch('/api/clay/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          company_id: company.id, 
          domain: company.domain 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send data to Clay');
      }
      
      alert('Sent to Clay successfully! The data will be enriched in the background. Please refresh the page in a few moments.');
      setResearchStatus('complete');
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setResearchStatus('error');
      setTimeout(() => setResearchStatus('idle'), 3000);
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
                  
                  {/* Research Action Column */}
                  <TableHead className="w-40 bg-blue-500/5 text-blue-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Deep Research (AI)
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-neutral-800 hover:bg-neutral-800/30">
                  <TableCell className="border-r border-neutral-800 text-center text-neutral-500 text-xs">1</TableCell>
                  <TableCell className="border-r border-neutral-800 font-medium text-white">{company.name}</TableCell>
                  <TableCell className="border-r border-neutral-800 text-blue-400">
                    <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {company.domain || 'website.com'}
                    </a>
                  </TableCell>
                  <TableCell className="border-r border-neutral-800 text-neutral-300">{company.industry || '-'}</TableCell>
                  <TableCell className="border-r border-neutral-800 text-neutral-300">{company.employees || '-'}</TableCell>
                  <TableCell className="border-r border-neutral-800 text-neutral-300">{company.country || '-'}</TableCell>
                  
                  {/* Research Action Cell */}
                  <TableCell className="p-0 relative bg-blue-500/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {researchStatus === 'idle' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={handleResearch}
                            disabled={!company.raw_data}
                            title={!company.raw_data ? "Enrich with Clay first" : "Run AI Deep Research"}
                            className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium border border-blue-500/20"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Run Research
                          </button>
                          <button 
                            onClick={handleClayCompanyEnrichment}
                            className="flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors text-xs font-medium border border-indigo-500/20"
                          >
                            <Sparkles className="w-3 h-3" />
                            Enrich with Clay
                          </button>
                        </div>
                      ) : researchStatus === 'loading' ? (
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-medium">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Researching...
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Done
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

      {/* Render the MockResearchFlow when research is complete */}
      {activeTab === 'company' && showReport && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-medium text-white">AI Company Intelligence</h2>
            <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Generated successfully
            </Badge>
          </div>
          {showReport ? (
            <MockResearchFlow companyName={company.name} skipLoading={researchStatus === 'complete'} researchData={researchData} rawData={company.raw_data} />
          ) : null}
        </div>
      )}
    </div>
  );
}
