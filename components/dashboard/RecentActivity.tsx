import { CheckCircle2, UserPlus, FileEdit, FolderPlus, Sparkles, Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export function RecentActivity({ activities = [] }: { activities?: ActivityItem[] }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-md specular-border shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">Recent Activity</h2>
          </div>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">Live Feed</span>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-xs text-zinc-400 py-6 text-center">No recent activity logged.</div>
        ) : (
          activities.map((activity, index) => {
            let Icon = FolderPlus;
            let iconColor = 'text-indigo-400';
            let bgGlow = 'bg-indigo-500/10 border-indigo-500/20';
            
            if (activity.action.includes('found') || activity.action.includes('added')) {
              Icon = UserPlus;
              iconColor = 'text-sky-400';
              bgGlow = 'bg-sky-500/10 border-sky-500/20';
            } else if (activity.action.includes('paused')) {
              Icon = CheckCircle2; 
              iconColor = 'text-amber-400';
              bgGlow = 'bg-amber-500/10 border-amber-500/20';
            } else if (activity.action.includes('updated')) {
              Icon = FileEdit;
              iconColor = 'text-emerald-400';
              bgGlow = 'bg-emerald-500/10 border-emerald-500/20';
            }

            return (
              <div key={activity.id} className="flex gap-3 relative group">
                {/* Timeline connector line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-3.5 top-7 bottom-[-16px] w-px bg-white/[0.06]" />
                )}
                
                <div className="relative">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${bgGlow} border z-10 shrink-0`}>
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 pt-0.5">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    <span className="font-medium text-white">{activity.user}</span>{' '}
                    <span className="text-zinc-400">{activity.action}</span>{' '}
                    <span className="font-medium text-indigo-300">{activity.target}</span>
                  </p>
                  <span className="text-[10px] text-zinc-400 mt-0.5 font-mono">{activity.time}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
