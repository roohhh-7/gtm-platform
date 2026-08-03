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
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="w-full sm:w-80">
        <Input 
          placeholder="Search by campaign name..." 
          icon={true} 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <div className="w-36">
          <Select 
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Draft', value: 'draft' },
              { label: 'Paused', value: 'paused' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
