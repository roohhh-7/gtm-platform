'use client';

import { useState, useEffect } from 'react';
import { ContactsHeader, ContactsFilters } from '@/components/contacts/ContactsHeader';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { contactService } from '@/services/contacts';
import { Contact } from '@/types';

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
        <div className="py-12 flex justify-center text-neutral-500">Loading contacts...</div>
      ) : (
        <ContactsTable data={tableData} />
      )}
    </div>
  );
}
