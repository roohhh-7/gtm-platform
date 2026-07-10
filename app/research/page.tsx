import { ResearchHeader } from '@/components/research/ResearchHeader';
import { ResearchCard } from '@/components/research/ResearchCard';

export default function ResearchPage() {
  return (
    <div className="space-y-6">
      <ResearchHeader />
      <ResearchCard research={null as any} companyName="Dummy Company" />
    </div>
  );
}
