import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Activity, AlertTriangle, Newspaper, Code2, Sparkles, Building2 } from 'lucide-react';
import { CompanyResearch } from '@/types';

type Props = {
  research: CompanyResearch | null;
  companyName: string;
};

export function ResearchCard({ research, companyName }: Props) {
  if (!research) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/50">
        <Building2 className="h-10 w-10 text-neutral-600 mb-4" />
        <h3 className="text-lg font-medium text-neutral-300">No research found for {companyName}</h3>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          Click the "Generate Research" button above to run our AI intelligence gathering on this target.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Top Level Summary */}
      <Card className="bg-neutral-900 border-neutral-700">
        <div className="flex items-center gap-2 mb-3 border-b border-neutral-800 pb-3">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-medium text-neutral-200">AI Summary: {companyName}</h2>
        </div>
        <p className="text-sm text-neutral-300 leading-relaxed">
          {research.ai_summary || "No summary generated yet."}
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pain Points */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h2 className="text-sm font-medium text-neutral-200">Identified Pain Points</h2>
          </div>
          <ul className="space-y-3">
            {research.pain_points && research.pain_points.length > 0 ? (
              research.pain_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/50 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-neutral-500 italic">No pain points identified.</li>
            )}
          </ul>
        </Card>

        {/* Buying Signals */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-medium text-neutral-200">Buying Signals</h2>
          </div>
          <ul className="space-y-3">
            {research.buying_signals && research.buying_signals.length > 0 ? (
              research.buying_signals.map((signal, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-300">{signal.signal}</span>
                  <Badge variant={signal.strength === 'High' ? 'success' : signal.strength === 'Medium' ? 'warning' : 'default'}>
                    {signal.strength}
                  </Badge>
                </li>
              ))
            ) : (
              <li className="text-sm text-neutral-500 italic">No buying signals detected.</li>
            )}
          </ul>
        </Card>

        {/* Tech Stack */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-medium text-neutral-200">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {research.tech_stack && research.tech_stack.length > 0 ? (
              research.tech_stack.map(tech => (
                <span key={tech} className="px-2.5 py-1 rounded bg-neutral-800 text-xs font-medium text-neutral-300">
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-sm text-neutral-500 italic">Tech stack unknown.</span>
            )}
          </div>
        </Card>

        {/* Recent News */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-medium text-neutral-200">Recent News & Mentions</h2>
          </div>
          <div className="space-y-4">
            {research.recent_news && research.recent_news.length > 0 ? (
              research.recent_news.map((news, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="text-xs text-neutral-500 mb-1">{news.date} • {news.source}</div>
                  <div className="text-sm text-neutral-300 group-hover:text-neutral-100 transition-colors">
                    {news.title}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-neutral-500 italic">No recent news found.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
