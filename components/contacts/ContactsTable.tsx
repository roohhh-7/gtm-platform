'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Mail, Globe, Users, ChevronDown, ChevronRight, Folder } from 'lucide-react';
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
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

  const toggleCampaign = (campaignName: string) => {
    setExpandedCampaigns(prev => {
      const next = new Set(prev);
      if (next.has(campaignName)) next.delete(campaignName);
      else next.add(campaignName);
      return next;
    });
  };

  const toggleCompany = (companyKey: string) => {
    setExpandedCompanies(prev => {
      const next = new Set(prev);
      if (next.has(companyKey)) next.delete(companyKey);
      else next.add(companyKey);
      return next;
    });
  };

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
          ) : Object.entries(groupedData).map(([campaignName, companies]) => {
            const isCampaignExpanded = expandedCampaigns.has(campaignName);
            const totalCampaignContacts = Object.values(companies).reduce((sum, contacts) => sum + contacts.length, 0);
            
            return (
              <React.Fragment key={campaignName}>
                {/* Campaign Header Row */}
                <TableRow 
                  className="bg-neutral-900/80 hover:bg-neutral-800/80 border-b-neutral-800 cursor-pointer"
                  onClick={() => toggleCampaign(campaignName)}
                >
                  <TableCell colSpan={5} className="py-2">
                    <div className="flex items-center gap-2">
                      {isCampaignExpanded ? (
                        <ChevronDown className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      )}
                      <Folder className="h-4 w-4 text-indigo-400 ml-1" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Campaign:</span>
                      <span className="text-sm font-medium text-white">{campaignName}</span>
                      <Badge variant="neutral" className="ml-2 text-[10px] py-0">{totalCampaignContacts}</Badge>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Companies within the Campaign */}
                {isCampaignExpanded && Object.entries(companies).map(([companyName, contacts]) => {
                  const companyKey = `${campaignName}-${companyName}`;
                  const isCompanyExpanded = expandedCompanies.has(companyKey);
                  
                  return (
                    <React.Fragment key={companyKey}>
                      {/* Company Header Row */}
                      <TableRow 
                        className="bg-neutral-950/60 hover:bg-neutral-900/60 border-b-neutral-800 cursor-pointer"
                        onClick={() => toggleCompany(companyKey)}
                      >
                        <TableCell colSpan={5} className="py-1.5 pl-8">
                          <div className="flex items-center gap-2 text-neutral-400">
                            {isCompanyExpanded ? (
                              <ChevronDown className="h-3 w-3 text-neutral-500" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-neutral-500" />
                            )}
                            <Users className="h-3 w-3 text-emerald-400 ml-1" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Company:</span>
                            <span className="text-sm font-medium text-neutral-200">{companyName}</span>
                            <Badge variant="neutral" className="ml-2 text-[10px] py-0">{contacts.length}</Badge>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Contact Rows */}
                      {isCompanyExpanded && contacts.map((contact) => (
                        <TableRow key={contact.id} className="bg-black/20">
                          <TableCell className="pl-14 py-3">
                            <div className="font-medium text-neutral-200">{contact.name}</div>
                            <div className="text-xs text-neutral-500 mt-0.5">{contact.role}</div>
                          </TableCell>
                          <TableCell className="text-neutral-400 font-mono text-xs">{contact.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {contact.email && (
                                <a href={`mailto:${contact.email}`} className="text-neutral-500 hover:text-neutral-300" onClick={(e) => e.stopPropagation()}>
                                  <Mail className="h-4 w-4" />
                                </a>
                              )}
                              {contact.linkedin_url && (
                                <a href={contact.linkedin_url.startsWith('http') ? contact.linkedin_url : `https://linkedin.com/in/${contact.linkedin_url}`} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-[#0a66c2]" onClick={(e) => e.stopPropagation()}>
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
                            {/* Empty space for dummy button that was removed */}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
