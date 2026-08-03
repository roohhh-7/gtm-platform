'use client';

import { useState, useEffect } from 'react';
import { ContactsHeader, ContactsFilters } from '@/components/contacts/ContactsHeader';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { contactService } from '@/services/contacts';
import { Contact } from '@/types';
import { Loader2 } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const { campaignContacts } = await contactService.getAllCampaignContacts();
      if (campaignContacts) setContacts(campaignContacts);
      setLoading(false);
    };
    fetchContacts();
  }, []);

  const tableData = contacts
    .filter(cc => cc.contact)
    .map(cc => ({
      id: cc.contact.id,
      name: cc.contact.name,
      role: cc.contact.role,
      companyName: cc.contact.company?.name || 'Unknown',
      campaignName: cc.campaign?.name || 'Unknown Campaign',
      email: cc.contact.email,
      linkedin_url: cc.contact.linkedin_url,
      status: cc.status
    }));

  return (
    <div className="space-y-6">
      <div>
        <ContactsHeader />
        <ContactsFilters />
      </div>
      
      {loading ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-16 flex flex-col items-center justify-center gap-3 backdrop-blur-md">
          <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
          <span className="text-xs text-zinc-400">Loading contacts directory...</span>
        </div>
      ) : (
        <ContactsTable data={tableData} />
      )}
    </div>
  );
}
