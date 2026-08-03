import { Button } from '@/components/ui/Button';
import { Plus, Megaphone, Sparkles } from 'lucide-react';

type Props = {
  onCreateClick: () => void;
};

export function CampaignsHeader({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            Campaigns
          </h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Outreach Hub
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">Manage and track your outbound sequences with automated enrichment.</p>
      </div>
      
      <Button variant="accent" className="w-full sm:w-auto gap-1.5 shadow-lg" onClick={onCreateClick}>
        <Plus className="h-4 w-4" />
        <span>Create Campaign</span>
      </Button>
    </div>
  );
}
