import { useState } from 'react';
import { companyService } from '@/services/companies';

type Props = {
  isOpen: boolean;
  campaignId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddCompanyModal({
  isOpen,
  campaignId,
  onClose,
  onSuccess
}: Props) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [employees, setEmployees] = useState('');
  const [domain, setDomain] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name) {
      setError('Company name is required');
      return;
    }

    setLoading(true);
    setError('');

    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    const { error: submitError } = await companyService.addCompanyToCampaign(
      campaignId,
      {
        name,
        industry,
        employees,
        domain,
        tags: parsedTags
      }
    );
    
    setLoading(false);

    if (submitError) {
      setError(submitError.message);
    } else {
      setName('');
      setIndustry('');
      setEmployees('');
      setDomain('');
      setTags('');
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="w-[500px] rounded-xl bg-neutral-900 border border-neutral-800 p-6">

        <h2 className="text-xl font-bold text-white mb-4">
          Add Target Company
        </h2>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">

          <input
            placeholder="Company Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
          />

          <input
            placeholder="Domain (e.g. techflow.io)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
          />

          <input
            placeholder="Industry (Optional)"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
          />

          <input
            placeholder="Employees (e.g. 50-200)"
            value={employees}
            onChange={(e) => setEmployees(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
          />

          <input
            placeholder="Tags (comma separated, e.g. High Intent, Q3)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Company'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
