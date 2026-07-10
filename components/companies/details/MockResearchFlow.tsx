'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { CompanyIntelligenceReport } from './CompanyIntelligenceReport';

type Props = {
  companyName: string;
  skipLoading?: boolean;
  researchData?: string[] | null;
};

const RESEARCH_STEPS = [
  'Company Overview',
  'Growth Signals',
  'Tech Stack',
  'Decision Makers',
  'AI Summary',
  'Opportunity Signals',
  'Pain Points',
  'Outreach Angles',
  'Recent News'
];

export function MockResearchFlow({ companyName, skipLoading = false, researchData }: Props) {
  const [status, setStatus] = useState<'idle' | 'researching' | 'complete'>(skipLoading ? 'complete' : 'idle');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (status === 'researching') {
      let stepIndex = 0;
      
      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex <= RESEARCH_STEPS.length) {
          setCurrentStep(stepIndex);
        } else {
          clearInterval(interval);
          // Wait a tiny bit after the last step before showing the report
          setTimeout(() => {
            setStatus('complete');
          }, 600);
        }
      }, 400); // 400ms per step * 9 steps = ~3.6s total loading time

      return () => clearInterval(interval);
    }
  }, [status]);

  if (status === 'complete') {
    return <CompanyIntelligenceReport companyName={companyName} researchData={researchData} />;
  }

  return (
    <div className="w-full max-w-4xl mt-8">
      {status === 'idle' ? (
        <Card className="flex flex-col items-center justify-center py-16 px-6 bg-neutral-900/50 border-dashed border-neutral-800">
          <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Company Intelligence</h3>
          <p className="text-neutral-400 text-center max-w-md mb-8">
            Run a deep-dive research process to uncover growth signals, tech stack, decision makers, and personalized outreach angles.
          </p>
          <Button 
            onClick={() => setStatus('researching')}
            className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Research Company
          </Button>
        </Card>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 px-6 bg-neutral-900/50 border-neutral-800">
          <div className="flex flex-col items-center max-w-sm w-full">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-6" />
            
            <h3 className="text-lg font-medium text-white mb-6">
              {currentStep > RESEARCH_STEPS.length ? 'Generating report...' : 'Researching company...'}
            </h3>

            <div className="w-full space-y-3">
              {RESEARCH_STEPS.map((step, index) => {
                const isComplete = index < currentStep;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;

                return (
                  <div 
                    key={step} 
                    className={`flex items-center gap-3 transition-opacity duration-300 ${isPending ? 'opacity-0' : 'opacity-100'}`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-neutral-700" />
                    )}
                    <span className={`text-sm ${isComplete ? 'text-neutral-300' : isCurrent ? 'text-white font-medium' : 'text-neutral-600'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
