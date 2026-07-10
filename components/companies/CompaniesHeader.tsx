import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, Plus } from 'lucide-react';

export function CompaniesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Companies</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage and research target accounts.</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>
    </div>
  );
}

export function CompaniesFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <div className="w-full sm:w-72">
        <Input placeholder="Search companies..." icon={true} />
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-40">
          <Select 
            options={[
              { label: 'All Industries', value: 'all' },
              { label: 'SaaS', value: 'saas' },
              { label: 'Fintech', value: 'fintech' },
              { label: 'Healthcare', value: 'healthcare' },
            ]}
          />
        </div>
        
        <Button variant="secondary" className="px-3 gap-2 ml-auto sm:ml-0">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>
    </div>
  );
}
