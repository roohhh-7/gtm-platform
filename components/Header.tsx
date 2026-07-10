import { Plus } from "lucide-react";

type Props = {
  onNewCampaign: () => void;
};

export default function Header({ onNewCampaign }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-neutral-400">
          Welcome to Orbital.
        </p>
      </div>

      <button
        onClick={onNewCampaign}
        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-neutral-200 transition"
      >
        <Plus size={18} />
        New Campaign
      </button>
    </div>
  );
}