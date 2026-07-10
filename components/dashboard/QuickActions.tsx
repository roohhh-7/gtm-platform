import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Users, Sparkles, LineChart } from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-1 bg-neutral-900 border-dashed border-neutral-700/50">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-neutral-200">Quick Actions</h2>
        <p className="text-xs text-neutral-500 mt-1">Common tasks to get started</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-1">
        <Button variant="secondary" className="w-full justify-start gap-3">
          <Plus className="h-4 w-4 text-neutral-400" />
          <span>New Campaign</span>
        </Button>
        <Button variant="secondary" className="w-full justify-start gap-3">
          <Users className="h-4 w-4 text-neutral-400" />
          <span>Import Contacts</span>
        </Button>
        <Button variant="secondary" className="w-full justify-start gap-3">
          <Sparkles className="h-4 w-4 text-neutral-400" />
          <span>Generate Copy</span>
        </Button>
        <Button variant="secondary" className="w-full justify-start gap-3">
          <LineChart className="h-4 w-4 text-neutral-400" />
          <span>View Reports</span>
        </Button>
      </div>
    </Card>
  );
}
