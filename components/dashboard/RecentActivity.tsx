import { Card } from '@/components/ui/Card';
import { CheckCircle2, UserPlus, FileEdit, Mail, FolderPlus } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export function RecentActivity({ activities = [] }: { activities?: ActivityItem[] }) {
  return (
    <Card className="col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-neutral-200">Recent Activity</h2>
      </div>
      
      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-sm text-neutral-500 py-4">No recent activity.</div>
        ) : (
          activities.map((activity, index) => {
            let Icon = FolderPlus;
            let iconColor = 'text-emerald-400';
            
            if (activity.action.includes('found') || activity.action.includes('added')) {
              Icon = UserPlus;
              iconColor = 'text-blue-400';
            } else if (activity.action.includes('paused')) {
              Icon = CheckCircle2; 
              iconColor = 'text-amber-400';
            } else if (activity.action.includes('updated')) {
              Icon = FileEdit;
              iconColor = 'text-neutral-400';
            }

            return (
              <div key={activity.id} className="flex gap-4 relative">
                {/* Timeline connector */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-neutral-800/60" />
                )}
                
                <div className="relative mt-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 z-10">
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 pt-1">
                  <p className="text-sm text-neutral-300">
                    <span className="font-medium text-neutral-200">{activity.user}</span>{' '}
                    <span className="text-neutral-400">{activity.action}</span>{' '}
                    <span className="font-medium text-neutral-200">{activity.target}</span>
                  </p>
                  <span className="text-xs text-neutral-500 mt-1">{activity.time}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
