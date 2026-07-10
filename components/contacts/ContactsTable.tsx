import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { MoreHorizontal, Mail, Globe, Users } from 'lucide-react';
import { Contact, CampaignContact } from '@/types';

type TableRowData = {
  id: string;
  name: string;
  role?: string;
  companyName: string;
  campaignName: string;
  email?: string;
  linkedin_url?: string;
  status: string;
};

type Props = {
  data: TableRowData[];
};

export function ContactsTable({ data }: Props) {
  // Group contacts by Campaign then Company
  const groupedData = data.reduce((acc, contact) => {
    const campKey = contact.campaignName || 'Unassigned';
    const compKey = contact.companyName || 'Unknown Company';
    if (!acc[campKey]) acc[campKey] = {};
    if (!acc[campKey][compKey]) acc[campKey][compKey] = [];
    acc[campKey][compKey].push(contact);
    return acc;
  }, {} as Record<string, Record<string, TableRowData[]>>);

  return (
    <Card className="p-0 mt-6 overflow-hidden flex flex-col">
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Social</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                No contacts found.
              </TableCell>
            </TableRow>
          ) : Object.entries(groupedData).map(([campaignName, companies]) => (
            <React.Fragment key={campaignName}>
              {/* Campaign Header Row */}
              <TableRow className="bg-neutral-900/80 hover:bg-neutral-900/80 border-b-neutral-800">
                <TableCell colSpan={5} className="py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Campaign:</span>
                    <span className="text-sm font-medium text-white">{campaignName}</span>
                  </div>
                </TableCell>
              </TableRow>

              {/* Companies within the Campaign */}
              {Object.entries(companies).map(([companyName, contacts]) => (
                <React.Fragment key={`${campaignName}-${companyName}`}>
                  {/* Company Header Row */}
                  <TableRow className="bg-neutral-900/40 hover:bg-neutral-900/40 border-b-neutral-800">
                    <TableCell colSpan={5} className="py-1.5 pl-6">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Users className="h-3 w-3" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Company:</span>
                        <span className="text-sm font-medium text-neutral-200">{companyName}</span>
                        <Badge variant="neutral" className="ml-2 text-[10px] py-0">{contacts.length}</Badge>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Contact Rows */}
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="pl-8">
                        <div className="font-medium text-neutral-200">{contact.name}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{contact.role}</div>
                      </TableCell>
                      <TableCell className="text-neutral-400 font-mono text-xs">{contact.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contact.email && (
                            <a href={`mailto:${contact.email}`} className="text-neutral-500 hover:text-neutral-300">
                              <Mail className="h-4 w-4" />
                            </a>
                          )}
                          {contact.linkedin_url && (
                            <a href={contact.linkedin_url.startsWith('http') ? contact.linkedin_url : `https://linkedin.com/in/${contact.linkedin_url}`} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-[#0a66c2]">
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={contact.status === 'replied' ? 'success' : contact.status === 'bounced' ? 'warning' : 'default'}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
