import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage your workspace and profile preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="max-w-2xl">
            <h2 className="text-lg font-medium text-neutral-200 mb-6">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">First Name</label>
                  <Input defaultValue="GTM" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Last Name</label>
                  <Input defaultValue="Engineer" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email Address</label>
                <Input defaultValue="gtm@orbital.com" type="email" disabled />
                <p className="text-xs text-neutral-500 mt-1.5">Contact support to change your primary email.</p>
              </div>

              <div className="pt-4 mt-6 border-t border-neutral-800 flex justify-end">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="workspace">
          <Card className="max-w-2xl">
            <h2 className="text-lg font-medium text-neutral-200 mb-6">Workspace Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Workspace Name</label>
                <Input defaultValue="Acme Corp GTM" />
              </div>
              
              <div className="pt-4 mt-6 border-t border-neutral-800 flex justify-end">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-neutral-200">API Keys</h2>
              <Button variant="secondary" size="sm">Generate New Key</Button>
            </div>
            
            <div className="rounded-lg border border-neutral-800 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-900/50 text-xs text-neutral-500">
                  <tr>
                    <th className="py-2 px-4 font-medium border-b border-neutral-800">Name</th>
                    <th className="py-2 px-4 font-medium border-b border-neutral-800">Created</th>
                    <th className="py-2 px-4 font-medium border-b border-neutral-800 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr>
                    <td className="py-3 px-4 text-neutral-300 font-medium">Production Scraper</td>
                    <td className="py-3 px-4 text-neutral-500">Oct 12, 2023</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="danger" size="sm" className="h-7 text-xs">Revoke</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-300 font-medium">Zapier Sync</td>
                    <td className="py-3 px-4 text-neutral-500">Nov 4, 2023</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="danger" size="sm" className="h-7 text-xs">Revoke</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card className="max-w-2xl">
            <h2 className="text-lg font-medium text-neutral-200 mb-2">Current Plan: Professional</h2>
            <p className="text-sm text-neutral-400 mb-6">You are on the Professional tier, billed $299/mo.</p>
            <Button variant="secondary">Manage Billing</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
