'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { contactService } from '@/services/contacts';
import { CampaignContact } from '@/types';
import AddContactModal from '@/components/contacts/AddContactModal';

type Props = {
  campaignId: string;
};

export function CampaignContactsTab({ campaignId }: Props) {
  const [campaignContacts, setCampaignContacts] = useState<CampaignContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    const { campaignContacts: data } = await contactService.getCampaignContacts(campaignId);
    if (data) setCampaignContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, [campaignId]);

  const tableData = campaignContacts
    .filter(cc => cc.contact)
    .map(cc => ({
      id: cc.contact!.id,
      name: cc.contact!.name,
      role: cc.contact!.role,
      companyName: cc.contact!.company?.name || 'Unknown',
      campaignName: cc.campaign?.name || 'Unknown Campaign',
      email: cc.contact!.email,
      linkedin_url: cc.contact!.linkedin_url,
      status: cc.status,
      email_subject: cc.email_draft?.subject || '',
      email_body: cc.email_draft?.body || '',
    }));

  const handleExportCsv = () => {
    if (tableData.length === 0) return;
    
    // Define headers
    const headers = ['Name', 'Role', 'Company Name', 'Email', 'LinkedIn', 'Status', 'Generated Subject', 'Generated Body'];
    
    // Map rows
    const rows = tableData.map(row => [
      `"${row.name.replace(/"/g, '""')}"`,
      `"${(row.role || '').replace(/"/g, '""')}"`,
      `"${(row.companyName || '').replace(/"/g, '""')}"`,
      `"${(row.email || '').replace(/"/g, '""')}"`,
      `"${(row.linkedin_url || '').replace(/"/g, '""')}"`,
      `"${row.status}"`,
      `"${(row.email_subject || '').replace(/"/g, '""')}"`,
      `"${(row.email_body || '').replace(/"/g, '""')}"`
    ].join(','));
    
    // Create CSV string
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campaign_contacts_${campaignId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b border-neutral-800/60 flex items-center justify-between">
        <div className="w-72">
          <Input placeholder="Search contacts..." icon={true} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCsv} variant="secondary" size="sm">Export CSV</Button>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">Add Contact</Button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-neutral-500">Loading contacts...</div>
      ) : (
        <ContactsTable data={tableData} />
      )}

      <AddContactModal 
        isOpen={isAddModalOpen}
        campaignId={campaignId}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchContacts();
        }}
      />
    </Card>
  );
}
