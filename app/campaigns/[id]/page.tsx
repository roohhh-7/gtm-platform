import { CampaignDetailsHeader } from '@/components/campaigns/details/CampaignDetailsHeader';
import { CampaignOverviewTab } from '@/components/campaigns/details/CampaignOverviewTab';
import { CampaignIcpTab } from '@/components/campaigns/details/CampaignIcpTab';
import { CampaignProspectDiscoveryTab } from '@/components/campaigns/details/CampaignProspectDiscoveryTab';
import { CampaignCompaniesTab } from '@/components/campaigns/details/CampaignCompaniesTab';
import { CampaignContactsTab } from '@/components/campaigns/details/CampaignContactsTab';
import { CampaignOutreachTab } from '@/components/campaigns/details/CampaignOutreachTab';
import { CampaignResearchTab } from '@/components/campaigns/details/CampaignResearchTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default async function CampaignDetailsPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params;
  const { tab } = await searchParams;
  
  return (
    <div className="space-y-6">
      <CampaignDetailsHeader campaignId={id} />
      
      <Tabs defaultValue={tab || "overview"} className="mt-6">
        <TabsList className="mb-6 flex flex-wrap gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="icp">ICP</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="discovery">Prospect Discovery</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <CampaignOverviewTab campaignId={id} />
        </TabsContent>

        <TabsContent value="icp">
          <CampaignIcpTab campaignId={id} />
        </TabsContent>

        <TabsContent value="companies">
          <CampaignCompaniesTab campaignId={id} />
        </TabsContent>
        
        <TabsContent value="discovery">
          <CampaignProspectDiscoveryTab campaignId={id} />
        </TabsContent>
        
        <TabsContent value="contacts">
          <CampaignContactsTab campaignId={id} />
        </TabsContent>
        
        <TabsContent value="outreach">
          <CampaignOutreachTab campaignId={id} />
        </TabsContent>
        
        <TabsContent value="research">
          <CampaignResearchTab campaignId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
