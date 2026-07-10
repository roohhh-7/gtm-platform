type CampaignCardProps = {
  name: string;
  industry: string;
  status: string;
};

export default function CampaignCard({
  name,
  industry,
  status,
}: CampaignCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {name}
        </h2>

        <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300">
          {status}
        </span>
      </div>

      <p className="mt-4 text-sm text-neutral-400">
        {industry}
      </p>
    </div>
  );
}