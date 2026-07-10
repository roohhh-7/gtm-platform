import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Mail, MessageSquare, Phone, RefreshCw, Check, Send } from 'lucide-react';

export function OutreachEditor() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6 h-[700px]">
      {/* Sequence Steps Sidebar */}
      <Card className="col-span-1 p-0 flex flex-col bg-neutral-900 border-neutral-800">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-200">Sequence Steps</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700 cursor-pointer flex items-center gap-3">
            <Mail className="h-4 w-4 text-neutral-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-neutral-200">Day 1: Initial Email</div>
              <div className="text-xs text-neutral-500 mt-0.5">Automated</div>
            </div>
            <Badge variant="success">Ready</Badge>
          </div>

          <div className="p-3 rounded-lg hover:bg-neutral-800/50 border border-transparent cursor-pointer flex items-center gap-3 transition-colors">
            <MessageSquare className="h-4 w-4 text-[#0a66c2]" />
            <div className="flex-1">
              <div className="text-sm font-medium text-neutral-300">Day 2: Connection</div>
              <div className="text-xs text-neutral-500 mt-0.5">Manual Task</div>
            </div>
          </div>

          <div className="p-3 rounded-lg hover:bg-neutral-800/50 border border-transparent cursor-pointer flex items-center gap-3 transition-colors">
            <Phone className="h-4 w-4 text-emerald-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-neutral-300">Day 4: Call</div>
              <div className="text-xs text-neutral-500 mt-0.5">Manual Task</div>
            </div>
          </div>

          <div className="p-3 rounded-lg hover:bg-neutral-800/50 border border-transparent cursor-pointer flex items-center gap-3 transition-colors">
            <Mail className="h-4 w-4 text-neutral-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-neutral-300">Day 7: Follow-up</div>
              <div className="text-xs text-neutral-500 mt-0.5">Automated</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Editor Area */}
      <Card className="col-span-1 lg:col-span-3 flex flex-col p-0">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium border border-neutral-700">
              AC
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-200">Alice Chen</div>
              <div className="text-xs text-neutral-500">VP Engineering @ TechFlow</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2 text-neutral-400">
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </Button>
            <Button variant="primary" size="sm" className="gap-2">
              <Check className="h-3 w-3" />
              Approve Step
            </Button>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col">
          <Tabs defaultValue="preview" className="flex-1 flex flex-col">
            <TabsList className="mb-6 w-full justify-start rounded-none border-b border-neutral-800 bg-transparent p-0">
              <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-100 data-[state=active]:bg-transparent">
                Email Preview
              </TabsTrigger>
              <TabsTrigger value="variables" className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-100 data-[state=active]:bg-transparent">
                Variables
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="flex-1 flex flex-col space-y-4">
              <div>
                <label className="text-xs text-neutral-500 font-medium">Subject</label>
                <input 
                  type="text" 
                  defaultValue="Quick question about TechFlow's infrastructure scaling"
                  className="mt-1 w-full text-sm text-neutral-200 bg-neutral-950 p-2.5 rounded border border-neutral-800 focus:outline-none focus:border-neutral-700 transition-colors"
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-neutral-500 font-medium mb-1">Body</label>
                <textarea 
                  className="flex-1 w-full text-sm text-neutral-300 bg-neutral-950 p-4 rounded border border-neutral-800 focus:outline-none focus:border-neutral-700 transition-colors resize-none leading-relaxed"
                  defaultValue={`Hi Alice,
                  
Saw your recent talk at GTMConf about how TechFlow migrated to a serverless architecture—really impressive results on the latency reduction.

I'm reaching out because we help engineering teams like yours manage the deployment complexity that usually comes with serverless setups. Orbital automatically maps dependencies and visualizes bottlenecks before they hit production.

Would you be open to a quick 10-minute chat next week to see if this could save your team some time?

Best,
Rohit`}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="variables">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-neutral-800 rounded bg-neutral-900/50">
                    <div className="text-xs font-mono text-emerald-400 mb-1">{'{{first_name}}'}</div>
                    <div className="text-sm text-neutral-300">Alice</div>
                  </div>
                  <div className="p-3 border border-neutral-800 rounded bg-neutral-900/50">
                    <div className="text-xs font-mono text-emerald-400 mb-1">{'{{company_name}}'}</div>
                    <div className="text-sm text-neutral-300">TechFlow</div>
                  </div>
                  <div className="col-span-2 p-3 border border-neutral-800 rounded bg-neutral-900/50">
                    <div className="text-xs font-mono text-emerald-400 mb-1">{'{{ai_personalization_sentence}}'}</div>
                    <div className="text-sm text-neutral-300">Saw your recent talk at GTMConf about how TechFlow migrated to a serverless architecture—really impressive results on the latency reduction.</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
