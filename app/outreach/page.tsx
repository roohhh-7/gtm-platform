import { OutreachHeader } from '@/components/outreach/OutreachHeader';
import { OutreachEditor } from '@/components/outreach/OutreachEditor';

export default function OutreachPage() {
  return (
    <div className="space-y-6">
      <OutreachHeader />
      <OutreachEditor />
    </div>
  );
}
