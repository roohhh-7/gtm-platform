import { Card } from '@/components/ui/Card';
import { StatCardData } from '@/types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({ title, value, trend, trendUp }: Omit<StatCardData, 'icon'>) {
  return (
    <Card className="flex flex-col justify-between p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-400">{title}</span>
        {trendUp ? (
          <div className="flex items-center text-emerald-400 text-xs font-medium">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            {trend}
          </div>
        ) : (
          <div className="flex items-center text-red-400 text-xs font-medium">
            <ArrowDownRight className="h-3 w-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="text-3xl font-semibold tracking-tight text-neutral-50">{value}</span>
      </div>
    </Card>
  );
}
