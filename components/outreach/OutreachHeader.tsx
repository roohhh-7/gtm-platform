import { Button } from '@/components/ui/Button';

export function OutreachHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Outreach Studio</h1>
        <p className="text-sm text-neutral-400 mt-1">Review and approve AI-generated multi-channel sequences.</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="gap-2">
          New Sequence
        </Button>
      </div>
    </div>
  );
}
