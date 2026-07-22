import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Activity, AlertTriangle, Newspaper, Code2, Sparkles, Building2, Flame, Target, Users, Lightbulb, Clock, HelpCircle } from 'lucide-react';
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
      
      {/* Custom Question Answer (If Exists) */}
      {research.custom_question_answer && (
        <Card className="bg-indigo-900/20 border-indigo-500/30">
          <div className="flex items-center gap-2 mb-3 border-b border-indigo-500/20 pb-3">
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-medium text-indigo-200">Custom Research Answer</h2>
          </div>
          <p className="text-sm text-indigo-100/80 leading-relaxed whitespace-pre-wrap">
            {research.custom_question_answer}
          </p>
        </Card>
      )}

      {/* Why Now & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-neutral-900 border-neutral-700">
          <div className="flex items-center gap-2 mb-3 border-b border-neutral-800 pb-3">
            <Flame className="h-4 w-4 text-orange-400" />
            <h2 className="text-sm font-medium text-neutral-200">Why Now</h2>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {research.why_now || "No data available."}
          </p>
        </Card>
        
        <Card className="bg-neutral-900 border-neutral-700">
          <div className="flex items-center gap-2 mb-3 border-b border-neutral-800 pb-3">
            <Building2 className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-medium text-neutral-200">Company Overview</h2>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {research.company_overview || research.ai_summary || "No overview available."}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Growth Signals */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-medium text-neutral-200">Growth Signals</h2>
          </div>
          <ul className="space-y-3">
            {research.growth_signals && research.growth_signals.length > 0 ? (
              research.growth_signals.map((signal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 mt-1.5 shrink-0" />
                  <span>{signal}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-neutral-500 italic">No growth signals detected.</li>
            )}
          </ul>
        </Card>

        {/* Opportunity Signals / Buying Signals */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-medium text-neutral-200">Opportunity Signals</h2>
          </div>
          <ul className="space-y-3">
            {research.buying_signals && research.buying_signals.length > 0 ? (
              research.buying_signals.map((signal, i) => (
                <li key={i} className="flex items-center justify-between text-sm gap-2">
                  <span className="text-neutral-300 line-clamp-2">{signal.signal}</span>
                  <Badge variant={signal.strength === 'High' ? 'success' : signal.strength === 'Medium' ? 'warning' : 'default'} className="shrink-0">
                    {signal.strength}
                  </Badge>
                </li>
              ))
            ) : (
              <li className="text-sm text-neutral-500 italic">No opportunity signals detected.</li>
            )}
          </ul>
        </Card>

        {/* Pain Points */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h2 className="text-sm font-medium text-neutral-200">Pain Points</h2>
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

        {/* Decision Makers */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-medium text-neutral-200">Decision Makers</h2>
          </div>
          <ul className="space-y-3">
            {research.decision_makers && research.decision_makers.length > 0 ? (
              research.decision_makers.map((person, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 mt-1.5 shrink-0" />
                  <span>{person}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-neutral-500 italic">No decision makers identified.</li>
            )}
          </ul>
        </Card>

        {/* Outreach Angles */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <h2 className="text-sm font-medium text-neutral-200">Outreach Angles</h2>
          </div>
          <ul className="space-y-3">
            {research.outreach_angles && research.outreach_angles.length > 0 ? (
              research.outreach_angles.map((angle, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50 mt-1.5 shrink-0" />
                  <span>{angle}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-neutral-500 italic">No outreach angles identified.</li>
            )}
          </ul>
        </Card>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-purple-400" />
            <h2 className="text-sm font-medium text-neutral-200">Timeline</h2>
          </div>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-neutral-800">
            {research.timeline && research.timeline.length > 0 ? (
              research.timeline.map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-neutral-900 text-neutral-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-neutral-900/50 p-3 rounded-md border border-neutral-800">
                    <div className="text-xs text-indigo-400 font-medium mb-1">{item.date}</div>
                    <div className="text-sm text-neutral-300">{item.event}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-neutral-500 italic pl-6">No timeline events found.</div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
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
              <Newspaper className="h-4 w-4 text-teal-400" />
              <h2 className="text-sm font-medium text-neutral-200">Recent News & Mentions</h2>
            </div>
            <div className="space-y-4">
              {research.recent_news && research.recent_news.length > 0 ? (
                research.recent_news.map((news, i) => (
                  <div key={i} className="group cursor-pointer border-l-2 border-neutral-800 pl-3 hover:border-teal-500/50 transition-colors">
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
    </div>
  );
}
