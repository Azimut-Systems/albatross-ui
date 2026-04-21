type StatProps = {
  label: string;
  value: string;
};

/** Stacked label + value, no background. Used in list-item cards. */
export default function Stat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col items-start min-w-0">
      <span className="font-ibm-plex-sans font-normal text-xs text-[var(--accent-muted)]">
        {label}
      </span>
      <span className="font-ibm-plex-sans font-medium text-sm text-white truncate">
        {value}
      </span>
    </div>
  );
}
