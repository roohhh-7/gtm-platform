import { Plus, Users, Sparkles, Megaphone, ArrowUpRight, Upload } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      title: 'New Campaign',
      description: 'Start a new outbound sequence',
      href: '/campaigns',
      icon: Plus,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Company Directory',
      description: 'Review prospect accounts',
      href: '/companies',
      icon: Users,
      iconColor: 'text-sky-400',
      iconBg: 'bg-sky-500/10 border-sky-500/20',
    },
  ];

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-md specular-border shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white tracking-tight">Quick Actions</h2>
        <span className="text-[10px] font-mono uppercase text-zinc-400">Shortcuts</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2.5">
        {actions.map((action) => (
          <Link 
            key={action.title}
            href={action.href}
            className="group flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-150"
          >
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg ${action.iconBg} border flex items-center justify-center ${action.iconColor} shrink-0`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                  {action.title}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {action.description}
                </span>
              </div>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
