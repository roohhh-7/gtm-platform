import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Download } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Analytics</h1>
          <p className="text-sm text-neutral-400 mt-1">Measure the performance of your outbound engine.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-36">
            <Select 
              options={[
                { label: 'Last 30 Days', value: '30d' },
                { label: 'Last 90 Days', value: '90d' },
                { label: 'This Year', value: '1y' },
              ]}
            />
          </div>
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Pipeline" value="$2.4M" trend="+15%" trendUp={true} />
        <StatCard title="Avg Reply Rate" value="4.2%" trend="+0.8%" trendUp={true} />
        <StatCard title="Meetings Booked" value="142" trend="-2%" trendUp={false} />
        <StatCard title="Conversion to Mtg" value="1.8%" trend="+0.1%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder Chart 1 */}
        <Card className="flex flex-col h-[350px]">
          <h2 className="text-sm font-medium text-neutral-200 mb-6">Reply Rate over Time</h2>
          <div className="flex-1 border-b border-l border-neutral-800 relative flex items-end justify-between px-2 pb-0 pt-8 gap-2">
            {/* CSS Bar Chart Mock */}
            {[40, 25, 45, 60, 35, 50, 75, 45, 80, 55, 90, 65].map((height, i) => (
              <div key={i} className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 border-t border-emerald-500/50 rounded-t-sm transition-colors relative group" style={{ height: `${height}%` }}>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-xs text-neutral-200 py-1 px-2 rounded border border-neutral-800 pointer-events-none transition-opacity">
                  {height}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500 mt-2 px-2">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </Card>

        {/* Placeholder Chart 2 */}
        <Card className="flex flex-col h-[350px]">
          <h2 className="text-sm font-medium text-neutral-200 mb-6">Pipeline Generation by Channel</h2>
          <div className="flex-1 flex flex-col justify-center gap-6 px-4">
            {/* CSS Horizontal Bar Chart Mock */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Email Outreach</span>
                <span className="text-neutral-200">$1.2M</span>
              </div>
              <div className="w-full bg-neutral-800/50 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500/50 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>LinkedIn Automated</span>
                <span className="text-neutral-200">$850k</span>
              </div>
              <div className="w-full bg-neutral-800/50 h-3 rounded-full overflow-hidden">
                <div className="bg-[#0a66c2]/50 h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Manual Cold Call</span>
                <span className="text-neutral-200">$350k</span>
              </div>
              <div className="w-full bg-neutral-800/50 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-500/50 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
