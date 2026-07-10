'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, RefreshCw, Check, Sparkles, User } from 'lucide-react';
import { contactService } from '@/services/contacts';
import { outreachService } from '@/services/outreach';
import { researchService } from '@/services/research';
import { CampaignContact, OutreachEmail } from '@/types';

type Props = {
  campaignId: string;
};

export function CampaignOutreachTab({ campaignId }: Props) {
  const [contacts, setContacts] = useState<CampaignContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<CampaignContact | null>(null);
  
  const [outreachEmail, setOutreachEmail] = useState<OutreachEmail | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const { campaignContacts } = await contactService.getCampaignContacts(campaignId);
      if (campaignContacts) {
        setContacts(campaignContacts);
        if (campaignContacts.length > 0) {
          setSelectedContact(campaignContacts[0]);
        }
      }
      setLoading(false);
    };
    fetchContacts();
  }, [campaignId]);

  useEffect(() => {
    if (!selectedContact) return;

    const fetchEmail = async () => {
      const { outreachEmail } = await outreachService.getOutreachEmail(campaignId, selectedContact.contact_id);
      setOutreachEmail(outreachEmail);
      if (outreachEmail) {
        setSubject(outreachEmail.subject);
        setBody(outreachEmail.body);
      } else {
        setSubject('');
        setBody('');
      }
    };
    
    fetchEmail();
  }, [selectedContact, campaignId]);

  const handleGenerate = async () => {
    if (!selectedContact) return;
    setGenerating(true);
    
    // In a real app, this would hit an API endpoint that calls OpenAI/Anthropic
    // using the contact's company_id to fetch CompanyResearch and contact_id for ContactResearch
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const companyName = selectedContact.contact?.company?.name || 'your company';
    const firstName = selectedContact.contact?.name?.split(' ')[0] || 'there';
    
    const generatedSubject = `Quick question about ${companyName}'s infrastructure scaling`;
    const generatedBody = `Hi ${firstName},
    
Saw your recent talk at GTMConf about how ${companyName} migrated to a serverless architecture—really impressive results on the latency reduction.

I'm reaching out because we help engineering teams like yours manage the deployment complexity that usually comes with serverless setups. Orbital automatically maps dependencies and visualizes bottlenecks before they hit production.

Would you be open to a quick 10-minute chat next week to see if this could save your team some time?

Best,
Rohit`;

    const contextUsed = [
      "Speaker at GTMConf 2023",
      `${companyName} uses Serverless`,
      "Pain point: Deployment complexity"
    ];

    const { outreachEmail: savedEmail } = await outreachService.saveOutreachEmail(
      campaignId,
      selectedContact.contact_id,
      {
        subject: generatedSubject,
        body: generatedBody,
        status: 'draft',
        context_used: contextUsed
      }
    );

    if (savedEmail) {
      setOutreachEmail(savedEmail);
      setSubject(savedEmail.subject);
      setBody(savedEmail.body);
    }
    
    setGenerating(false);
  };

  const handleApprove = async () => {
    if (!outreachEmail) return;
    setSaving(true);
    
    // First save any edits
    await outreachService.saveOutreachEmail(campaignId, selectedContact!.contact_id, {
      subject,
      body,
      status: 'approved'
    });
    
    // Update local state
    setOutreachEmail(prev => prev ? { ...prev, subject, body, status: 'approved' } : null);
    
    // Also update the campaign_contact status to 'sent' (or 'approved' depending on workflow)
    await contactService.updateCampaignContactStatus(campaignId, selectedContact!.contact_id, 'sent');
    
    // Update local contacts list
    setContacts(prev => prev.map(c => 
      c.contact_id === selectedContact!.contact_id 
        ? { ...c, status: 'sent' } 
        : c
    ));
    
    setSaving(false);
  };

  if (loading) {
    return <div className="py-12 flex justify-center text-neutral-500">Loading contacts...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 h-[700px]">
      {/* Sidebar: List of contacts */}
      <Card className="col-span-1 p-0 flex flex-col bg-neutral-900 border-neutral-800">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-200">Pending Outreach</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {contacts.length === 0 ? (
            <div className="text-center text-sm text-neutral-500 py-4">No contacts added yet.</div>
          ) : (
            contacts.map(c => (
              <div 
                key={c.contact_id}
                onClick={() => setSelectedContact(c)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedContact?.contact_id === c.contact_id 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'border-transparent hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-neutral-200 text-sm">{c.contact?.name}</div>
                  {c.status === 'sent' && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  )}
                </div>
                <div className="text-xs text-neutral-500 mt-1 truncate">
                  {c.contact?.role} @ {c.contact?.company?.name}
                </div>
              </div>
            ))
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
            <Button onClick={handleGenerate} disabled={generating} className="gap-2">
              {generating ? (
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
                  onClick={handleGenerate} 
                  disabled={generating || outreachEmail.status === 'approved'} 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-neutral-400"
                >
                  <RefreshCw className={`h-3 w-3 ${generating ? 'animate-spin' : ''}`} />
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
