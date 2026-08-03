import { useState } from 'react';
import { campaignService } from '@/services/campaigns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Megaphone, X, Sparkles, Loader2 } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function NewCampaignModal({
  isOpen,
  onClose,
  onSuccess
}: Props) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Campaign name is required');
      return;
    }

    setLoading(true);
    setError('');

    const { error: submitError } = await campaignService.createCampaign(name.trim(), industry.trim());
    
    setLoading(false);

    if (submitError) {
      setError(submitError.message);
    } else {
      setName('');
      setIndustry('');
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-md z-50 p-4 animate-in fade-in-50 duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#0f111a]/95 border border-white/[0.1] p-6 shadow-2xl backdrop-blur-2xl specular-border relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Megaphone className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Create Campaign
            </h2>
            <p className="text-xs text-zinc-400">Configure outbound target and pipeline</p>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Campaign Name
            </label>
            <input
              placeholder="e.g. Q3 Fintech VP Engineering Outreach"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-150 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Target Industry <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <input
              placeholder="e.g. Fintech, Enterprise SaaS, Cybersecurity"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-150 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.06]">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>

            <Button
              variant="accent"
              onClick={handleSubmit}
              disabled={loading}
              className="text-xs gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Create Campaign</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}