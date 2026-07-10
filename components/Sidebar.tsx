import { LayoutDashboard, Target, Building2, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-neutral-900 border-r border-neutral-800 p-6">
      <h1 className="text-2xl font-bold text-white mb-10">
        Orbital
      </h1>

      <nav className="space-y-2">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-neutral-800 text-white">
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition">
          <Target size={18} />
          Campaigns
        </button>

        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition">
          <Building2 size={18} />
          Companies
        </button>

        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition">
          <Settings size={18} />
          Settings
        </button>
      </nav>
    </aside>
  );
}