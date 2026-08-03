import { useState } from 'react';
import { campaignService } from '@/services/campaigns';

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
    if (!name) {
      setError('Campaign name is required');
      return;
    }

    setLoading(true);
    setError('');

    const { error: submitError } = await campaignService.createCampaign(name, industry);
    
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="w-[500px] rounded-xl bg-neutral-900 border border-neutral-800 p-6">

        <h2 className="text-2xl font-bold text-white">
          Create Campaign
        </h2>
        
        {error && (
          <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-500">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">

          <input
            placeholder="Campaign Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-800 p-3 text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
          />

          <input
            placeholder="Industry (Optional)"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-800 p-3 text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
          />

          <div className="flex justify-end gap-3 pt-4">

            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-white px-4 py-2 font-medium text-black disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}