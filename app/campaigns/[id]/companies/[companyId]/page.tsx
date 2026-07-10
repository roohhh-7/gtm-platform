'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ExternalLink, Users, Briefcase } from 'lucide-react';
import { MockResearchFlow } from '@/components/companies/details/MockResearchFlow';
import { CompanySpreadsheetView } from '@/components/companies/details/CompanySpreadsheetView';

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const companyId = params.companyId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('campaign_companies')
        .select(`
          status,
          ai_fit_score,
          why_recommended,
          company:companies(*)
        `)
        .eq('campaign_id', campaignId)
        .eq('company_id', companyId)
        .single();
      
      if (data) {
        setData(data);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [campaignId, companyId]);

  if (loading) {
    return <div className="py-12 flex justify-center text-neutral-500">Loading company details...</div>;
  }

  if (!data || !data.company) {
    return (
      <div className="py-12 text-center text-neutral-400">
        Company not found in this campaign.
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="secondary">Go Back</Button>
        </div>
      </div>
    );
  }

  const { company, campaign } = data;
  const campaignName = campaign?.name || 'Campaign';

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center text-sm font-medium text-neutral-400 gap-2 mb-4">
        <button 
          onClick={() => router.push('/campaigns')}
          className="hover:text-white transition-colors"
        >
          Campaigns
        </button>
        <span className="text-neutral-600">/</span>
        <button 
          onClick={() => router.push(`/campaigns/${campaignId}`)}
          className="hover:text-white transition-colors"
        >
          {campaignName}
        </button>
        <span className="text-neutral-600">/</span>
        <span className="text-neutral-100">{company.name}</span>
      </div>

      {/* Spreadsheet Data View */}
      <CompanySpreadsheetView company={company} campaignId={campaignId} />
    </div>
  );
}
