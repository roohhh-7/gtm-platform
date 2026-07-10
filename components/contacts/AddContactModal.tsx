import { useState, useEffect } from 'react';
import { contactService } from '@/services/contacts';
import { companyService } from '@/services/companies';
import { CampaignCompany } from '@/types';

type Props = {
  isOpen: boolean;
  campaignId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddContactModal({
  isOpen,
  campaignId,
  onClose,
  onSuccess
}: Props) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [companyId, setCompanyId] = useState('');
  
  const [companies, setCompanies] = useState<CampaignCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCompanies, setFetchingCompanies] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFetchingCompanies(true);
      companyService.getCampaignCompanies(campaignId).then(({ campaignCompanies }) => {
        if (campaignCompanies) {
          setCompanies(campaignCompanies);
          if (campaignCompanies.length > 0) {
            setCompanyId(campaignCompanies[0].company_id);
          }
        }
        setFetchingCompanies(false);
      });
    }
  }, [isOpen, campaignId]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name || !companyId) {
      setError('Name and Company are required');
      return;
    }

    setLoading(true);
    setError('');

    const { error: submitError } = await contactService.addContactToCampaign(
      campaignId,
      companyId,
      {
        name,
        role,
        email,
        linkedin_url: linkedinUrl
      }
    );
    
    setLoading(false);

    if (submitError) {
      setError(submitError.message);
    } else {
      setName('');
      setRole('');
      setEmail('');
      setLinkedinUrl('');
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="w-[500px] rounded-xl bg-neutral-900 border border-neutral-800 p-6">

        <h2 className="text-xl font-bold text-white mb-4">
          Add Contact
        </h2>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">
          
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Company *</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={loading || fetchingCompanies}
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 disabled:opacity-50"
            >
              <option value="" disabled>Select a company</option>
              {companies.map(cc => (
                <option key={cc.company_id} value={cc.company_id}>
                  {cc.company?.name}
                </option>
              ))}
            </select>
            {companies.length === 0 && !fetchingCompanies && (
              <p className="text-xs text-amber-500 mt-1">You need to add a company to this campaign first.</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Name *</label>
            <input
              placeholder="e.g. Alice Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Role/Title</label>
            <input
              placeholder="e.g. VP Engineering"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Email</label>
            <input
              placeholder="alice@techflow.io"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">LinkedIn URL</label>
            <input
              placeholder="linkedin.com/in/alicechen"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 disabled:opacity-50"
            />
          </div>

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
              disabled={loading || !companyId}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Contact'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
