import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const integrations = [
  { name: 'Apollo', desc: 'Data enrichment and contact sourcing.', category: 'Data', connected: true },
  { name: 'Clay', desc: 'Waterfall enrichment and programmable data.', category: 'Data', connected: true },
  { name: 'HubSpot', desc: 'Bi-directional CRM sync for accounts and contacts.', category: 'CRM', connected: false },
  { name: 'Salesforce', desc: 'Enterprise CRM synchronization.', category: 'CRM', connected: false },
  { name: 'n8n', desc: 'Advanced webhook automation workflows.', category: 'Automation', connected: true },
  { name: 'Google Workspace', desc: 'Send emails directly via Gmail API.', category: 'Delivery', connected: true },
  { name: 'Slack', desc: 'Get alerts for replies and meetings booked.', category: 'Alerts', connected: false },
  { name: 'OpenAI', desc: 'Bring your own API key for sequence generation.', category: 'AI', connected: true },
  { name: 'Gemini', desc: 'Advanced LLM routing for complex research.', category: 'AI', connected: false },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Integrations</h1>
          <p className="text-sm text-neutral-400 mt-1">Connect your GTM stack to automate your workflow.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(integration => (
          <Card key={integration.name} className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-neutral-300">
                    {integration.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-200">{integration.name}</h3>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">{integration.category}</span>
                  </div>
                </div>
                {integration.connected && (
                  <Badge variant="success">Connected</Badge>
                )}
              </div>
              <p className="text-sm text-neutral-400 mt-4 h-10">
                {integration.desc}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-800/60">
              <Button 
                variant={integration.connected ? 'ghost' : 'secondary'} 
                className="w-full"
              >
                {integration.connected ? 'Configure' : 'Connect'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
