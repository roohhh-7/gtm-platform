'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, RefreshCw, Check, Sparkles, User, ChevronDown, ChevronRight, Building2 } from 'lucide-react';
import { contactService } from '@/services/contacts';
import { outreachService } from '@/services/outreach';
import { CampaignContact, OutreachEmail } from '@/types';

type Props = {
  campaignId: string;
};

export function CampaignOutreachTab({ campaignId }: Props) {
  const [contacts, setContacts] = useState<CampaignContact[]>([]);
  const [emails, setEmails] = useState<OutreachEmail[]>([]);
  const [selectedContact, setSelectedContact] = useState<CampaignContact | null>(null);
  
  const [outreachEmail, setOutreachEmail] = useState<OutreachEmail | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [generatingCompanies, setGeneratingCompanies] = useState<Record<string, boolean>>({});
  const [generatingIndividual, setGeneratingIndividual] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [contactsRes, emailsRes] = await Promise.all([
        contactService.getCampaignContacts(campaignId),
        outreachService.getCampaignOutreachEmails(campaignId)
      ]);
      
      if (contactsRes.campaignContacts) {
        setContacts(contactsRes.campaignContacts);
        
        // Expand first company by default
        if (contactsRes.campaignContacts.length > 0) {
          const firstCompanyId = contactsRes.campaignContacts[0].contact?.company_id;
          if (firstCompanyId) {
            setExpandedCompanies({ [firstCompanyId]: true });
          }
          setSelectedContact(contactsRes.campaignContacts[0]);
        }
      }
      
      if (emailsRes.outreachEmails) {
        setEmails(emailsRes.outreachEmails);
      }
      setLoading(false);
    };
    fetchData();
  }, [campaignId]);

  // Sync selected contact's email from emails array
  useEffect(() => {
    if (!selectedContact) {
      setOutreachEmail(null);
      return;
    }
    
    const email = emails.find(e => e.contact_id === selectedContact.contact_id);
    setOutreachEmail(email || null);
    setSubject(email?.subject || '');
    setBody(email?.body || '');
  }, [selectedContact, emails]);

  const groupedContacts = useMemo(() => {
    const groups: Record<string, { companyName: string, companyId: string, contacts: CampaignContact[] }> = {};
    contacts.forEach(c => {
      const companyId = c.contact?.company_id || 'unknown';
      const companyName = c.contact?.company?.name || 'Unknown Company';
      
      if (!groups[companyId]) {
        groups[companyId] = { companyId, companyName, contacts: [] };
      }
      groups[companyId].contacts.push(c);
    });
    return groups;
  }, [contacts]);

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  const generateForContact = async (c: CampaignContact) => {
    if (!c.contact?.company_id) return null;
    
    try {
      const res = await fetch('/api/outreach/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          contactId: c.contact_id,
          companyId: c.contact.company_id,
          contactName: c.contact.name,
          contactRole: c.contact.role,
          companyName: c.contact.company?.name
        })
      });
      
      const data = await res.json();
      if (data.subject && data.body) {
        const { outreachEmail: savedEmail } = await outreachService.saveOutreachEmail(
          campaignId,
          c.contact_id,
          {
            subject: data.subject,
            body: data.body,
            status: 'draft',
            context_used: data.context_used || []
          }
        );
        return savedEmail;
      }
    } catch (err) {
      console.error("Failed generating for", c.contact?.name, err);
    }
    return null;
  };

  const handleGenerateCompany = async (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation(); // prevent accordion toggle
    
    const group = groupedContacts[companyId];
    if (!group) return;
    
    setGeneratingCompanies(prev => ({ ...prev, [companyId]: true }));
    setExpandedCompanies(prev => ({ ...prev, [companyId]: true })); // ensure open
    
    // Generate sequentially to avoid rate limits
    for (const c of group.contacts) {
      // Skip if approved
      const existing = emails.find(em => em.contact_id === c.contact_id);
      if (existing?.status === 'approved') continue;
      
      const savedEmail = await generateForContact(c);
      if (savedEmail) {
        setEmails(prev => {
          const idx = prev.findIndex(em => em.id === savedEmail.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = savedEmail;
            return copy;
          }
          return [...prev, savedEmail];
        });
      }
    }
    
    setGeneratingCompanies(prev => ({ ...prev, [companyId]: false }));
  };

  const handleGenerateIndividual = async () => {
    if (!selectedContact) return;
    setGeneratingIndividual(true);
    
    const savedEmail = await generateForContact(selectedContact);
    if (savedEmail) {
      setEmails(prev => {
        const idx = prev.findIndex(em => em.id === savedEmail.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = savedEmail;
          return copy;
        }
        return [...prev, savedEmail];
      });
    }
    
    setGeneratingIndividual(false);
  };

  const handleApprove = async () => {
    if (!outreachEmail || !selectedContact) return;
    setSaving(true);
    
    await outreachService.saveOutreachEmail(campaignId, selectedContact.contact_id, {
      subject,
      body,
      status: 'approved'
    });
    
    setEmails(prev => prev.map(em => 
      em.id === outreachEmail.id ? { ...em, subject, body, status: 'approved' } : em
    ));
    
    await contactService.updateCampaignContactStatus(campaignId, selectedContact.contact_id, 'sent');
    setContacts(prev => prev.map(c => 
      c.contact_id === selectedContact.contact_id ? { ...c, status: 'sent' } : c
    ));
    
    setSaving(false);
  };

  if (loading) {
    return <div className="py-12 flex justify-center text-neutral-500">Loading contacts...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 h-[700px]">
      {/* Sidebar: Grouped list of contacts */}
      <Card className="col-span-1 p-0 flex flex-col bg-neutral-900 border-neutral-800">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-sm font-medium text-neutral-200">Companies & Contacts</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {Object.keys(groupedContacts).length === 0 ? (
            <div className="text-center text-sm text-neutral-500 py-4">No contacts added yet.</div>
          ) : (
            Object.values(groupedContacts).map(group => {
              const isExpanded = expandedCompanies[group.companyId];
              const isGenerating = generatingCompanies[group.companyId];
              
              // Calculate how many contacts have emails
              const contactsWithEmails = group.contacts.filter(c => emails.some(e => e.contact_id === c.contact_id)).length;
              const totalContacts = group.contacts.length;
              const allDone = contactsWithEmails === totalContacts && totalContacts > 0;

              return (
                <div key={group.companyId} className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950">
                  {/* Company Header */}
                  <div 
                    className="flex items-center justify-between p-3 bg-neutral-900/50 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => toggleCompany(group.companyId)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-neutral-500 shrink-0" /> : <ChevronRight className="h-4 w-4 text-neutral-500 shrink-0" />}
                      <Building2 className="h-4 w-4 text-neutral-400 shrink-0" />
                      <span className="font-medium text-neutral-200 text-sm truncate">{group.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">{contactsWithEmails}/{totalContacts}</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`h-7 px-2 text-xs ${allDone ? 'text-emerald-400' : 'text-indigo-400 hover:text-indigo-300'}`}
                        onClick={(e) => handleGenerateCompany(e, group.companyId)}
                        disabled={isGenerating || allDone}
                      >
                        {isGenerating ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : allDone ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Contacts List */}
                  {isExpanded && (
                    <div className="divide-y divide-neutral-800/50 border-t border-neutral-800/50">
                      {group.contacts.map(c => {
                        const hasEmail = emails.some(e => e.contact_id === c.contact_id);
                        return (
                          <div 
                            key={c.contact_id}
                            onClick={() => setSelectedContact(c)}
                            className={`p-3 pl-10 cursor-pointer transition-colors flex items-center justify-between ${
                              selectedContact?.contact_id === c.contact_id 
                                ? 'bg-neutral-800/60' 
                                : 'hover:bg-neutral-800/30'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="font-medium text-neutral-300 text-sm truncate">{c.contact?.name}</div>
                              <div className="text-xs text-neutral-500 mt-0.5 truncate">{c.contact?.role}</div>
                            </div>
                            <div>
                              {c.status === 'sent' ? (
                                <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
                              ) : hasEmail ? (
                                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>
      
      {/* Main Area: Editor */}
      <div className="col-span-1 lg:col-span-2">
        {!selectedContact ? (
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20 text-center p-12">
            <User className="h-8 w-8 text-neutral-600 mb-4" />
            <h3 className="text-base font-medium text-neutral-300">Select a contact</h3>
            <p className="text-sm text-neutral-500 mt-1">Choose a contact to view or generate their personalized outreach.</p>
          </div>
        ) : !outreachEmail ? (
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20 text-center p-12">
            <Sparkles className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-lg font-medium text-neutral-200 mb-2">No outreach generated yet</h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-md">
              We will use the intelligence gathered in the Research tab to craft a hyper-personalized email for {selectedContact.contact?.name}.
            </p>
            <Button onClick={handleGenerateIndividual} disabled={generatingIndividual || generatingCompanies[selectedContact.contact?.company_id || '']} className="gap-2">
              {generatingIndividual || generatingCompanies[selectedContact.contact?.company_id || ''] ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-neutral-800 border-t-white animate-spin" />
                  Writing Email...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Outreach
                </>
              )}
            </Button>
          </div>
        ) : (
          <Card className="flex flex-col h-full p-0">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-neutral-400" />
                <h2 className="text-sm font-medium text-neutral-200">Email: Step 1 (Initial Outreach)</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleGenerateIndividual} 
                  disabled={generatingIndividual || generatingCompanies[selectedContact.contact?.company_id || ''] || outreachEmail.status === 'approved'} 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-neutral-400"
                >
                  <RefreshCw className={`h-3 w-3 ${generatingIndividual ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
                
                {outreachEmail.status === 'approved' ? (
                  <Button variant="secondary" size="sm" className="gap-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 pointer-events-none">
                    <Check className="h-3 w-3" />
                    Approved & Sent
                  </Button>
                ) : (
                  <Button 
                    onClick={handleApprove}
                    disabled={saving}
                    variant="primary" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Check className="h-3 w-3" />
                    {saving ? 'Approving...' : 'Approve & Send'}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col">
              <div className="mb-4">
                <label className="text-xs text-neutral-500 font-medium">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  disabled={outreachEmail.status === 'approved'}
                  className="mt-1 w-full text-sm text-neutral-200 bg-neutral-950 p-2.5 rounded border border-neutral-800 focus:outline-none focus:border-neutral-700 transition-colors disabled:opacity-70"
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-neutral-500 font-medium mb-1">Body</label>
                <textarea 
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  disabled={outreachEmail.status === 'approved'}
                  className="flex-1 w-full text-sm text-neutral-300 bg-neutral-950 p-4 rounded border border-neutral-800 focus:outline-none focus:border-neutral-700 transition-colors resize-none leading-relaxed disabled:opacity-70"
                />
              </div>
            </div>
            
            {/* Research Context used for generation */}
            {outreachEmail.context_used && outreachEmail.context_used.length > 0 && (
              <div className="p-4 border-t border-neutral-800/60 bg-neutral-900/30 rounded-b-xl">
                <div className="text-xs text-neutral-500 mb-2">Context used by AI:</div>
                <div className="flex flex-wrap gap-2">
                  {outreachEmail.context_used.map((ctx, i) => (
                    <span key={i} className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400">
                      {ctx}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
