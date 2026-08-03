import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

type Props = {
  onCreateClick: () => void;
};

export function CampaignsHeader({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Campaigns</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage and track your outbound sequences.</p>
      </div>
      
      <Button variant="primary" className="w-full sm:w-auto gap-2" onClick={onCreateClick}>
        <Plus className="h-4 w-4" />
        Create Campaign
      </Button>
    </div>
  );
}
