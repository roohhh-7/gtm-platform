import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ResearchHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Research</h1>
        <p className="text-sm text-neutral-400 mt-1">Deep dive into accounts to uncover buying signals.</p>
      </div>
      
      <div className="w-full sm:w-80">
        <Input placeholder="Search companies to research..." icon={true} />
      </div>
    </div>
  );
}
