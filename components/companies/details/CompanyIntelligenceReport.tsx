'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Flame, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  Newspaper,
  Calendar,
  Code2,
  FileText,
  MessageSquare,
  Mail,
  Share2
} from 'lucide-react';

type Props = {
  companyName: string;
  researchData?: string[] | null;
  rawData?: Record<string, any> | null;
};

export function CompanyIntelligenceReport({ companyName, researchData, rawData }: Props) {
  // If researchData exists and has 9 items, map them to variables for readability
  const [
    overview,
    growthSignals,
    techStack,
    decisionMakers,
    aiSummary,
    opportunitySignals,
    painPoints,
    outreachAngles,
    recentNews
  ] = researchData && researchData.length === 9 
    ? researchData 
    : Array(9).fill(null);

  return (
    <div className="w-full max-w-4xl mt-8 space-y-6">
      
      {/* Company Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {rawData?.['logo url'] ? (
            <img src={rawData['logo url']} alt={companyName} className="w-16 h-16 rounded-xl border border-neutral-800 object-contain bg-white p-1" />
          ) : (
            <div className="w-16 h-16 rounded-xl border border-neutral-800 bg-neutral-900 flex items-center justify-center text-xl font-bold text-neutral-400">
              {companyName.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h2 className="text-2xl font-semibold text-white">{companyName}</h2>
              {rawData?.['linkedin url'] && (
                <a href={rawData['linkedin url']} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
              {rawData?.type && <span className="capitalize">{rawData.type}</span>}
              {rawData?.type && (rawData?.locality || rawData?.country || rawData?.founded) && <span className="w-1 h-1 rounded-full bg-neutral-700" />}
              
              {(rawData?.locality || rawData?.country) && (
                <span>{[rawData.locality, rawData.country].filter(Boolean).join(', ')}</span>
              )}
              
              {(rawData?.locality || rawData?.country) && rawData?.founded && <span className="w-1 h-1 rounded-full bg-neutral-700" />}
              
              {rawData?.founded && <span>Founded {rawData.founded}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Why Now */}
      <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/20">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Opportunity Signals</h3>
            <p className="text-neutral-200">
              {opportunitySignals || `${companyName} recently expanded its AI product team and has increased hiring for Product Managers over the last three months.`}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          
          <Card className="p-6 bg-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider">AI Summary</h3>
            </div>
            <p className="text-neutral-200 text-sm leading-relaxed">
              {rawData?.Description || aiSummary || `${companyName} appears to be a strong fit because the company has a mature product organization, growing engineering team, and increasing investment in AI-powered workflows.`}
            </p>
          </Card>

          {/* Opportunity Signals & Pain Points */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Opportunity Signals</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-neutral-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  Hiring Product Managers
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  Growing Engineering Team
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  Recently launched new product
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  Actively investing in AI
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Pain Points</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-neutral-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  Customer feedback likely spread across multiple platforms.
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  Manual analysis may slow product decisions.
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  Scaling product organization increases feedback volume.
                </li>
              </ul>
            </Card>
          </div>

          {/* Outreach Angles */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Outreach Angles</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
                <p className="text-sm text-neutral-200 font-medium">1. Mention recent hiring</p>
                <p className="text-xs text-neutral-400 mt-1">"Noticed you're aggressively expanding the product team right now..."</p>
              </div>
              <div className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
                <p className="text-sm text-neutral-200 font-medium">2. Reference AI initiatives</p>
                <p className="text-xs text-neutral-400 mt-1">"Saw the new AI features launched last month..."</p>
              </div>
              <div className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
                <p className="text-sm text-neutral-200 font-medium">3. Position Orbital</p>
                <p className="text-xs text-neutral-400 mt-1">"How is the team currently centralizing customer feedback across these new initiatives?"</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Growth Signals */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Growth Signals</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Employee Growth</p>
                <p className="text-xl font-semibold text-emerald-400">+28%</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Hiring</p>
                <p className="text-sm text-neutral-200">{rawData?.['Job Openings'] || '12 Product openings'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Funding</p>
                <p className="text-sm text-neutral-200">{rawData?.['Latest Funding'] || 'Recently launched Enterprise offering'}</p>
              </div>
            </div>
          </Card>

          {/* Decision Makers */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Decision Makers</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Sarah Johnson</p>
                  <p className="text-xs text-neutral-400">VP Product</p>
                </div>
                <a href="#" className="text-xs text-blue-400 hover:underline">LinkedIn</a>
              </div>
              <div className="h-px w-full bg-neutral-800" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Rahul Menon</p>
                  <p className="text-xs text-neutral-400">Senior Product Manager</p>
                </div>
                <a href="#" className="text-xs text-blue-400 hover:underline">LinkedIn</a>
              </div>
            </div>
          </Card>

          {/* Tech Stack */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {rawData?.['Website Tech Stack'] ? (
                (typeof rawData['Website Tech Stack'] === 'string' ? rawData['Website Tech Stack'].split(',') : rawData['Website Tech Stack']).map((tech: string) => (
                  <Badge key={tech.trim()} variant="neutral" className="bg-neutral-800 border-neutral-700">
                    {tech.trim()}
                  </Badge>
                ))
              ) : techStack ? (
                <div className="text-sm text-neutral-300">{techStack}</div>
              ) : (
                ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'OpenAI', 'Vercel', 'Segment'].map(tech => (
                  <Badge key={tech} variant="neutral" className="bg-neutral-800 border-neutral-700">
                    {tech}
                  </Badge>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Timeline & News */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Recent News</h3>
          </div>
          <ul className="space-y-4">
            {rawData?.['Positive News Article'] ? (
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-sm text-neutral-200">{rawData['Positive News Article']}</p>
              </li>
            ) : recentNews ? (
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-sm text-neutral-200">{recentNews}</p>
              </li>
            ) : (
              <>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-neutral-200">Raised Series B six months ago.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-neutral-200">Released Enterprise Dashboard.</p>
                </li>
              </>
            )}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Timeline</h3>
          </div>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-neutral-700 bg-neutral-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-white">Series B Funding</div>
                  <time className="text-xs text-neutral-500">6mo ago</time>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-neutral-700 bg-neutral-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-white">Enterprise Launch</div>
                  <time className="text-xs text-neutral-500">4mo ago</time>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-neutral-700 bg-neutral-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-white">Product Hiring Surge</div>
                  <time className="text-xs text-neutral-500">2mo ago</time>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/50 bg-emerald-500/20 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-emerald-400">Strong expansion signals</div>
                  <time className="text-xs text-emerald-500">Today</time>
                </div>
              </div>
            </div>

          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 pt-6 mt-6 border-t border-neutral-800/60 pb-10">
        <Button disabled variant="secondary" className="gap-2">
          <FileText className="w-4 h-4" />
          Export PDF
        </Button>
        <Button disabled variant="secondary" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share to Slack
        </Button>
        <Button disabled variant="secondary" className="gap-2">
          <Mail className="w-4 h-4" />
          Generate Personalized Email
        </Button>
        <Button disabled variant="secondary" className="gap-2">
          <MessageSquare className="w-4 h-4" />
          Push to HubSpot
        </Button>
      </div>
    </div>
  );
}
