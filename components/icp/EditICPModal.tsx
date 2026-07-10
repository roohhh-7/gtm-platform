import { useState, useEffect } from 'react';
import { icpService } from '@/services/icps';
import { ICP } from '@/types';

type Props = {
  isOpen: boolean;
  campaignId: string;
  initialData: ICP | null;
  onClose: () => void;
  onSuccess: (updatedICP: ICP) => void;
};

export default function EditICPModal({
  isOpen,
  campaignId,
  initialData,
  onClose,
  onSuccess
}: Props) {
  const [titles, setTitles] = useState('');
  const [industries, setIndustries] = useState('');
  const [companySizes, setCompanySizes] = useState<string[]>([]);
  const [locations, setLocations] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [marketSegments, setMarketSegments] = useState<string[]>([]);
  const [idealCustomerCharacteristics, setIdealCustomerCharacteristics] = useState('');
  const [targetDomains, setTargetDomains] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitles(initialData.titles.join(', '));
      setIndustries(initialData.industries.join(', '));
      setCompanySizes(initialData.company_sizes || []);
      setLocations(initialData.locations.join(', '));
      setProductDescription(initialData.product_description || '');
      setProblemStatement(initialData.problem_statement || '');
      setMarketSegments(initialData.market_segments || []);
      setIdealCustomerCharacteristics(initialData.ideal_customer_characteristics || '');
      setTargetDomains((initialData.target_domains || []).join(', '));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const icpData = {
      titles: titles.split(',').map(s => s.trim()).filter(Boolean),
      industries: industries.split(',').map(s => s.trim()).filter(Boolean),
      company_sizes: companySizes,
      locations: locations.split(',').map(s => s.trim()).filter(Boolean),
      product_description: productDescription,
      problem_statement: problemStatement,
      market_segments: marketSegments,
      ideal_customer_characteristics: idealCustomerCharacteristics,
      target_domains: targetDomains.split(',').map(s => s.trim()).filter(Boolean),
    };

    const { icp, error: submitError } = await icpService.upsertICP(campaignId, icpData);
    
    setLoading(false);

    if (submitError) {
      setError(submitError.message);
    } else if (icp) {
      onSuccess(icp);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 py-10">
      <div className="w-[500px] rounded-xl bg-neutral-900 border border-neutral-800 p-6 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-semibold text-white mb-1">
          Edit Target ICP
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          Comma separate values (e.g. CTO, VP Engineering)
        </p>
        
        {error && (
          <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">

          <div>
            <label className="block text-xs text-neutral-500 mb-1">What are you selling?</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              disabled={loading}
              placeholder="AI-powered Voice of Customer platform..."
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50 min-h-[60px]"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">What problem are you solving?</label>
            <textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              disabled={loading}
              placeholder="Product teams manually collect customer feedback..."
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50 min-h-[60px]"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Who buys it?</label>
            <input
              value={titles}
              onChange={(e) => setTitles(e.target.value)}
              disabled={loading}
              placeholder="CTO, VP Engineering"
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Target Industry</label>
            <input
              value={industries}
              onChange={(e) => setIndustries(e.target.value)}
              disabled={loading}
              placeholder="B2B SaaS, Enterprise Software"
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-2">Target Company Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '1-10', value: '1,10' },
                { label: '11-20', value: '11,20' },
                { label: '21-50', value: '21,50' },
                { label: '51-100', value: '51,100' },
                { label: '101-200', value: '101,200' },
                { label: '201-500', value: '201,500' },
                { label: '501-1000', value: '501,1000' },
                { label: '1001-2000', value: '1001,2000' },
                { label: '2001-5000', value: '2001,5000' },
                { label: '5001-10000', value: '5001,10000' },
                { label: '10001+', value: '10001' }
              ].map((size) => (
                <label key={size.value} className="flex items-center gap-2 text-sm text-neutral-300 bg-neutral-800/50 p-2 rounded cursor-pointer hover:bg-neutral-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={companySizes.includes(size.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCompanySizes([...companySizes, size.value]);
                      } else {
                        setCompanySizes(companySizes.filter(s => s !== size.value));
                      }
                    }}
                    disabled={loading}
                    className="rounded border-neutral-600 bg-neutral-700 text-neutral-200 focus:ring-neutral-500"
                  />
                  {size.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Target Country</label>
            <input
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              disabled={loading}
              placeholder="United States, Remote"
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-2">Market Segment</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                'B2B', 'B2C', 'B2B2C', 'SaaS', 'FinTech', 'E-commerce', 'Marketplace',
                'D2C', 'Retail', 'Healthcare', 'Consulting', 'Services', 'Non-Profit'
              ].map((segment) => (
                <label key={segment} className="flex items-center gap-2 text-sm text-neutral-300 bg-neutral-800/50 p-2 rounded cursor-pointer hover:bg-neutral-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={marketSegments.includes(segment)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMarketSegments([...marketSegments, segment]);
                      } else {
                        setMarketSegments(marketSegments.filter(s => s !== segment));
                      }
                    }}
                    disabled={loading}
                    className="rounded border-neutral-600 bg-neutral-700 text-neutral-200 focus:ring-neutral-500"
                  />
                  {segment}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Ideal Customer Characteristics</label>
            <textarea
              value={idealCustomerCharacteristics}
              onChange={(e) => setIdealCustomerCharacteristics(e.target.value)}
              disabled={loading}
              placeholder="Fast-growing SaaS companies with dedicated product teams..."
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50 min-h-[60px]"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Target Specific Domains (Optional)</label>
            <input
              value={targetDomains}
              onChange={(e) => setTargetDomains(e.target.value)}
              disabled={loading}
              placeholder="apple.com, microsoft.com"
              className="w-full rounded-lg bg-neutral-800 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-neutral-700 transition-shadow disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
