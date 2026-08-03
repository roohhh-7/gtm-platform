import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal } from 'lucide-react';

type Props = {
  search: string;
  status: string;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
};

export function CampaignFilters({ search, status, onSearchChange, onStatusChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="w-full sm:w-72">
        <Input 
          placeholder="Search campaigns..." 
          icon={true} 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-32">
          <Select 
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Draft', value: 'draft' },
              { label: 'Paused', value: 'paused' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
        </div>
        
        <Button variant="secondary" className="px-3 gap-2 ml-auto sm:ml-0">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">More Filters</span>
        </Button>
      </div>
    </div>
  );
}
