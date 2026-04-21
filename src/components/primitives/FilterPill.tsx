import { ChevronDownIcon } from '../icons';

type FilterPillProps = {
  label: string;
  onClick?: () => void;
};

/** Filter dropdown trigger — used in TargetsList and CamerasList headers. */
export default function FilterPill({ label, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center gap-1 p-2 rounded border border-[var(--border-accent)] text-white cursor-pointer hover:border-[var(--accent)] transition-colors"
    >
      <span className="flex-1 text-left font-ibm-plex-sans font-medium text-sm">
        {label}
      </span>
      <ChevronDownIcon />
    </button>
  );
}
