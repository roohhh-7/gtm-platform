'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResearchCard } from '@/components/research/ResearchCard';
import { Sparkles, Building2, User, ChevronRight } from 'lucide-react';
import { companyService } from '@/services/companies';
import { contactService } from '@/services/contacts';
import { researchService } from '@/services/research';
import { CampaignCompany, CampaignContact, CompanyResearch, ContactResearch } from '@/types';

type Props = {
  campaignId: string;
};

export function CampaignResearchTab({ campaignId }: Props) {
  const [campaignCompanies, setCampaignCompanies] = useState<CampaignCompany[]>([]);
  const [campaignContacts, setCampaignContacts] = useState<CampaignContact[]>([]);
  
  const [selectedEntity, setSelectedEntity] = useState<{ type: 'company' | 'contact', id: string, name: string } | null>(null);
  
  const [companyResearch, setCompanyResearch] = useState<CompanyResearch | null>(null);
  const [contactResearch, setContactResearch] = useState<ContactResearch | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [researching, setResearching] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [compRes, contRes] = await Promise.all([
        companyService.getCampaignCompanies(campaignId),
        contactService.getCampaignContacts(campaignId)
      ]);
      
      if (compRes.campaignCompanies) setCampaignCompanies(compRes.campaignCompanies);
      if (contRes.campaignContacts) setCampaignContacts(contRes.campaignContacts);
      
      // Auto-select first company
      if (compRes.campaignCompanies && compRes.campaignCompanies.length > 0) {
        const firstCo = compRes.campaignCompanies[0];
        setSelectedEntity({ type: 'company', id: firstCo.company_id, name: firstCo.company?.name || 'Unknown' });
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [campaignId]);

  useEffect(() => {
    if (!selectedEntity) return;

    const fetchResearch = async () => {
      if (selectedEntity.type === 'company') {
        setCompanyResearch(null);
        const { research } = await researchService.getCompanyResearch(selectedEntity.id);
        if (research) setCompanyResearch(research);
      } else {
        setContactResearch(null);
        const { research } = await researchService.getContactResearch(selectedEntity.id);
        if (research) setContactResearch(research);
      }
    };

    fetchResearch();
  }, [selectedEntity]);

  const handleGenerateResearch = async () => {
    if (!selectedEntity) return;
    setResearching(true);

    try {
      if (selectedEntity.type === 'company') {
        const response = await fetch('/api/research/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyId: selectedEntity.id,
            companyName: selectedEntity.name,
            customQuestion: customQuestion.trim() || undefined
          })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const { research } = await researchService.saveCompanyResearch(selectedEntity.id, data.research);
        if (research) setCompanyResearch(research);
      } else {
        const contact = campaignContacts.find(c => c.contact_id === selectedEntity.id);
        const companyName = contact?.contact?.company_id 
          ? campaignCompanies.find(cc => cc.company_id === contact?.contact?.company_id)?.company?.name
          : undefined;

        const response = await fetch('/api/research/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contactId: selectedEntity.id,
            contactName: selectedEntity.name,
            companyName
          })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const { research } = await researchService.saveContactResearch(selectedEntity.id, data.research);
        if (research) setContactResearch(research);
      }
    } catch (err: any) {
      console.error("Error generating research:", err);
      alert(err.message || "Failed to generate AI research. Please check your API key.");
    } finally {
      setResearching(false);
      setCustomQuestion("");
    }
  };

  if (loading) {
    return <div className="py-12 flex justify-center text-neutral-500">Loading research targets...</div>;
  }

  return (
    <div className="flex gap-6 mt-6">
      {/* Sidebar: Targets */}
      <Card className="w-80 shrink-0 p-0 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
        <div className="p-4 border-b border-neutral-800/60 bg-neutral-900/50">
          <h3 className="text-sm font-medium text-neutral-200">Research Targets</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {campaignCompanies.length === 0 ? (
            <div className="p-4 text-xs text-neutral-500 text-center">No targets added to campaign yet.</div>
          ) : (
            campaignCompanies.map(cc => {
              const companyContacts = campaignContacts.filter(c => c.contact?.company_id === cc.company_id);
              return (
                <div key={cc.company_id} className="mb-2">
                  <button
                    onClick={() => setSelectedEntity({ type: 'company', id: cc.company_id, name: cc.company?.name || 'Unknown' })}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${selectedEntity?.id === cc.company_id ? 'bg-indigo-500/10 text-indigo-400' : 'text-neutral-300 hover:bg-neutral-800'}`}
                  >
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">{cc.company?.name}</span>
                  </button>
                  
                  {companyContacts.length > 0 && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-neutral-800 pl-2">
                      {companyContacts.map(contact => (
                        <button
                          key={contact.contact_id}
                          onClick={() => setSelectedEntity({ type: 'contact', id: contact.contact_id, name: contact.contact?.name || 'Unknown' })}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors ${selectedEntity?.id === contact.contact_id ? 'bg-indigo-500/10 text-indigo-400' : 'text-neutral-400 hover:bg-neutral-800'}`}
                        >
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{contact.contact?.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Main Area: Research Canvas */}
      <div className="flex-1 min-w-0">
        {!selectedEntity ? (
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20 text-center p-12">
            <Sparkles className="h-8 w-8 text-neutral-600 mb-4" />
            <h3 className="text-base font-medium text-neutral-300">Select a target</h3>
            <p className="text-sm text-neutral-500 mt-1">Choose a company or contact from the sidebar to view their intelligence profile.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
                  {selectedEntity.type === 'company' ? <Building2 className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  <span className="uppercase tracking-wider">{selectedEntity.type} RESEARCH</span>
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">{selectedEntity.name}</h2>
              </div>
              <div className="flex items-center gap-3">
                {selectedEntity.type === 'company' && (
                  <input
                    type="text"
                    placeholder="Ask a specific question (optional)..."
                    className="w-64 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    disabled={researching}
                  />
                )}
                <Button onClick={handleGenerateResearch} disabled={researching}>
                  {researching ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-neutral-800 border-t-white animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate Research
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {selectedEntity.type === 'company' ? (
              <ResearchCard research={companyResearch} companyName={selectedEntity.name} />
            ) : (
              contactResearch ? (
                <div className="space-y-6 mt-6">
                  <Card className="bg-neutral-900 border-neutral-700">
                    <div className="flex items-center gap-2 mb-3 border-b border-neutral-800 pb-3">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <h2 className="text-sm font-medium text-neutral-200">AI Personalization Hook</h2>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {contactResearch.ai_personalization_notes}
                    </p>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <h2 className="text-sm font-medium text-neutral-200 mb-4">Role & Background</h2>
                      <div className="space-y-3 text-sm text-neutral-300">
                        <p><strong className="text-neutral-500">Role:</strong> {contactResearch.role}</p>
                        <p><strong className="text-neutral-500">Responsibilities:</strong> {contactResearch.responsibilities}</p>
                        <p><strong className="text-neutral-500">Summary:</strong> {contactResearch.linkedin_summary}</p>
                      </div>
                    </Card>
                    <Card>
                      <h2 className="text-sm font-medium text-neutral-200 mb-4">Talking Points</h2>
                      <ul className="space-y-2">
                        {contactResearch.personalized_talking_points?.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                            <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/50">
                  <User className="h-10 w-10 text-neutral-600 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-300">No research found for {selectedEntity.name}</h3>
                  <p className="text-sm text-neutral-500 mt-2 max-w-sm">
                    Click the "Generate Research" button above to run our AI intelligence gathering on this contact.
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
