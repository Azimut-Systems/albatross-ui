import GlassPanel from './GlassPanel';

export type TargetStatus = 'Critical' | 'Warning' | 'Normal';

export type Target = {
  id: string;
  name: string;
  coordinates: string;
  status: TargetStatus;
  vesselClass: string;
  heading: string;
  speed: string;
  transmission: string;
  size: string;
  aidId?: string;
  vesselName?: string;
  owner?: string;
  imoNumber?: string;
  threatLevel?: string;
};

export type TargetsListFilter = 'Status' | 'Class' | 'Type' | 'AIS';

type TargetsListProps = {
  targets: Target[];
  activeId?: string;
  filters?: readonly TargetsListFilter[];
  onSelect?: (id: string) => void;
  onSearch?: () => void;
  onFilterClick?: (filter: TargetsListFilter) => void;
  onTargetMore?: (id: string) => void;
};

const DEFAULT_FILTERS: readonly TargetsListFilter[] = ['Status', 'Class', 'Type', 'AIS'];

const STATUS_STYLES: Record<TargetStatus, { border: string; bg: string; text: string }> = {
  Critical: { border: '#ff3646', bg: 'rgba(255,54,70,0.2)', text: '#ff3646' },
  Warning: { border: '#f5a623', bg: 'rgba(245,166,35,0.2)', text: '#f5a623' },
  Normal: { border: '#4ade80', bg: 'rgba(74,222,128,0.2)', text: '#4ade80' },
};

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="17.5" y2="17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShipIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17L5 11H19L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 17C3 17 5 20 12 20C19 20 21 17 21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11V7H17V11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="4" x2="12" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function FilterPill({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center gap-1 p-2 rounded border border-[rgb(var(--accent-rgb)/0.5)] text-white cursor-pointer hover:border-[var(--accent)] transition-colors"
    >
      <span className="flex-1 text-left font-ibm-plex-sans font-medium text-sm">{label}</span>
      <ChevronDownIcon />
    </button>
  );
}

function Badge({ label, border, bg, text }: { label: string; border: string; bg: string; text: string }) {
  return (
    <div
      className="flex h-5 items-center px-2 rounded-[34px] border"
      style={{ borderColor: border, backgroundColor: bg }}
    >
      <span className="font-ibm-plex-sans font-medium text-xs leading-none" style={{ color: text }}>
        {label}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: TargetStatus }) {
  const s = STATUS_STYLES[status];
  return <Badge label={status} border={s.border} bg={s.bg} text={s.text} />;
}

function ClassBadge({ label }: { label: string }) {
  return <Badge label={label} border="#ef835d" bg="rgba(239,131,93,0.2)" text="#ef835d" />;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start min-w-0">
      <span className="font-ibm-plex-sans font-normal text-xs text-[var(--accent-muted)]">{label}</span>
      <span className="font-ibm-plex-sans font-medium text-sm text-white truncate">{value}</span>
    </div>
  );
}

type TargetCardProps = {
  target: Target;
  active: boolean;
  onSelect?: (id: string) => void;
  onMore?: (id: string) => void;
};

function TargetCard({ target, active, onSelect, onMore }: TargetCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(target.id)}
      aria-pressed={active}
      className={`flex flex-col gap-5 p-4 rounded-xl w-full text-left cursor-pointer transition-colors ${
        active
          ? 'bg-[rgb(var(--accent-rgb)/0.3)] border border-[rgb(var(--accent-rgb)/0.5)]'
          : 'bg-[rgb(var(--accent-rgb)/0.1)] border border-transparent hover:bg-[rgb(var(--accent-rgb)/0.2)]'
      }`}
    >
      <div className="flex gap-3 items-center w-full">
        <div className="flex flex-1 gap-3 items-center min-w-0">
          <div className="flex items-center p-2 rounded-[30px] bg-[rgb(var(--accent-rgb)/0.2)] text-white shrink-0">
            <ShipIcon />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="font-ibm-plex-sans font-bold text-base text-white tracking-[0.1px] leading-5 truncate">
              {target.name}
            </span>
            <span className="font-ibm-plex-sans font-normal text-xs text-[var(--accent-muted)] truncate">
              {target.coordinates}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center shrink-0">
          <StatusBadge status={target.status} />
          <ClassBadge label={target.vesselClass} />
          {active && (
            <span
              role="button"
              tabIndex={0}
              aria-label={`More actions for ${target.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onMore?.(target.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onMore?.(target.id);
                }
              }}
              className="flex items-center p-1 rounded text-white cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
            >
              <MoreIcon />
            </span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[rgb(var(--accent-rgb)/0.3)]" />

      <div className="grid grid-cols-4 gap-2 w-full">
        <Stat label="Heading" value={target.heading} />
        <Stat label="Speed" value={target.speed} />
        <Stat label="Transmission" value={target.transmission} />
        <Stat label="Size" value={target.size} />
      </div>
    </button>
  );
}

export default function TargetsList({
  targets,
  activeId,
  filters = DEFAULT_FILTERS,
  onSelect,
  onSearch,
  onFilterClick,
  onTargetMore,
}: TargetsListProps) {
  return (
    <GlassPanel
      className="absolute top-[110px] left-6 z-20"
      cornerRadius={24}
      padding="24px"
    >
      <div
        className="flex flex-col gap-8 w-[416px]"
        style={{ height: 'calc((100vh - 110px) / var(--ui-scale) - 110px)' }}
      >
        <div className="flex flex-col gap-4 w-full shrink-0">
          <div className="flex items-center gap-1.5 w-full">
            <h2 className="flex-1 font-ibm-plex-sans font-bold text-[22px] text-white leading-[1.5]">
              Targets List
            </h2>
            <button
              type="button"
              onClick={onSearch}
              aria-label="Search targets"
              className="flex items-center px-1 py-1.5 rounded text-white cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
            >
              <SearchIcon />
            </button>
          </div>
          <div className="flex gap-2 items-center w-full">
            {filters.map((f) => (
              <FilterPill key={f} label={f} onClick={() => onFilterClick?.(f)} />
            ))}
          </div>
        </div>

        <ul
          role="listbox"
          aria-label="Targets"
          className="flex flex-col gap-4 w-full flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden list-none m-0 p-0"
        >
          {targets.map((t) => (
            <li key={t.id} role="option" aria-selected={t.id === activeId}>
              <TargetCard
                target={t}
                active={t.id === activeId}
                onSelect={onSelect}
                onMore={onTargetMore}
              />
            </li>
          ))}
        </ul>
      </div>
    </GlassPanel>
  );
}
