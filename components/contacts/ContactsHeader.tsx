import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, UserPlus } from 'lucide-react';

export function ContactsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Contacts</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage individuals and decision makers.</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>
    </div>
  );
}

export function ContactsFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <div className="w-full sm:w-72">
        <Input placeholder="Search contacts..." icon={true} />
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-40">
          <Select 
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Replied', value: 'replied' },
              { label: 'Sent', value: 'sent' },
              { label: 'Bounced', value: 'bounced' },
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
