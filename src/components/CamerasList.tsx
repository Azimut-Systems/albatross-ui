import GlassPanel from './GlassPanel';

export type CameraStatus = 'Connected' | 'Disconnected';
export type CameraActivity = 'Idle' | 'Active';

export type Camera = {
  id: string;
  name: string;
  status: CameraStatus;
  activity: CameraActivity;
  completion: number;
  thumbnailUrl?: string;
};

export type CamerasListFilter = 'Status' | 'Favorite' | 'Missions' | 'Zones';

type CamerasListProps = {
  cameras: Camera[];
  activeId?: string;
  filters?: readonly CamerasListFilter[];
  onSelect?: (id: string) => void;
  onSearch?: () => void;
  onFilterClick?: (filter: CamerasListFilter) => void;
  onCameraMore?: (id: string) => void;
};

const DEFAULT_FILTERS: readonly CamerasListFilter[] = ['Status', 'Favorite', 'Missions', 'Zones'];

const STATUS_STYLES: Record<CameraStatus, { border: string; bg: string; text: string }> = {
  Connected: { border: '#12a96f', bg: 'rgba(18,169,111,0.2)', text: '#2eb07e' },
  Disconnected: { border: '#ff3646', bg: 'rgba(255,54,70,0.2)', text: '#ff3646' },
};

const ACTIVITY_STYLES: Record<CameraActivity, { border: string; bg: string; text: string }> = {
  Idle: { border: '#ef835d', bg: 'rgba(239,131,93,0.2)', text: '#ef835d' },
  Active: { border: '#6931f5', bg: 'rgba(105,49,245,0.2)', text: '#a88cff' },
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

function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 10L21 7.5V16.5L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
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
      className="flex-1 flex items-center gap-1 p-2 rounded border border-[#4c3d7b] text-white cursor-pointer hover:border-[#6e48f2] transition-colors"
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

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-4 w-full">
      <span className="font-ibm-plex-sans font-medium text-sm text-white">{Math.round(clamped)}% To complete</span>
      <div className="h-[11.4px] w-full rounded-[32.33px] bg-[rgba(122,86,246,0.2)] overflow-hidden">
        <div
          className="h-full rounded-[20px]"
          style={{
            width: `${clamped}%`,
            backgroundImage:
              'linear-gradient(90deg, rgba(105,49,245,0.7) 0%, rgba(105,49,245,0.7) 100%), linear-gradient(171deg, rgba(56,78,231,0.3) 5.66%, rgba(30,191,245,0.3) 98.95%)',
          }}
        />
      </div>
    </div>
  );
}

function CameraThumbnail({ url }: { url?: string }) {
  return (
    <div className="relative w-full h-[220px] overflow-hidden rounded-[8.48px] border border-black">
      {url ? (
        <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(105,49,245,0.35), rgba(30,191,245,0.25) 60%, rgba(12,11,25,0.6))',
          }}
        />
      )}
      <div className="absolute inset-0 bg-[rgba(105,49,245,0.1)]" />
      <div className="absolute top-3 right-5">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true" className="text-white/80">
          <path d="M4 4H8M4 4V8M4 4L8 8M15 4H11M15 4V8M15 4L11 8M4 15H8M4 15V11M4 15L8 11M15 15H11M15 15V11M15 15L11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

type CameraCardProps = {
  camera: Camera;
  active: boolean;
  onSelect?: (id: string) => void;
  onMore?: (id: string) => void;
};

function CameraCard({ camera, active, onSelect, onMore }: CameraCardProps) {
  const status = STATUS_STYLES[camera.status];
  const activity = ACTIVITY_STYLES[camera.activity];
  return (
    <button
      type="button"
      onClick={() => onSelect?.(camera.id)}
      aria-pressed={active}
      className={`flex flex-col gap-5 p-4 rounded-xl w-full text-left cursor-pointer transition-colors ${
        active
          ? 'bg-[rgba(93,52,165,0.3)] border border-[rgba(110,72,242,0.5)]'
          : 'bg-[rgba(93,52,165,0.1)] border border-transparent hover:bg-[rgba(93,52,165,0.2)]'
      }`}
    >
      <div className="flex gap-3 items-center w-full">
        <div className="flex flex-1 gap-3 items-center min-w-0">
          <div className="flex items-center p-2 rounded-[30px] bg-[rgba(122,86,246,0.2)] text-white shrink-0">
            <CameraIcon />
          </div>
          <span className="font-ibm-plex-sans font-bold text-base text-white tracking-[0.1px] leading-5 truncate">
            {camera.name}
          </span>
        </div>
        <div className="flex gap-2 items-center shrink-0">
          <Badge label={camera.status} border={status.border} bg={status.bg} text={status.text} />
          <Badge label={camera.activity} border={activity.border} bg={activity.bg} text={activity.text} />
          {active && (
            <span
              role="button"
              tabIndex={0}
              aria-label={`More actions for ${camera.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onMore?.(camera.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onMore?.(camera.id);
                }
              }}
              className="flex items-center p-1 rounded text-white cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
            >
              <MoreIcon />
            </span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[rgba(110,72,242,0.3)]" />

      <ProgressBar value={camera.completion} />

      <CameraThumbnail url={camera.thumbnailUrl} />
    </button>
  );
}

export default function CamerasList({
  cameras,
  activeId,
  filters = DEFAULT_FILTERS,
  onSelect,
  onSearch,
  onFilterClick,
  onCameraMore,
}: CamerasListProps) {
  return (
    <GlassPanel
      className="absolute top-[110px] right-6 z-20"
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
              Cameras List
            </h2>
            <button
              type="button"
              onClick={onSearch}
              aria-label="Search cameras"
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
          aria-label="Cameras"
          className="flex flex-col gap-4 w-full flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden list-none m-0 p-0"
        >
          {cameras.map((c) => (
            <li key={c.id} role="option" aria-selected={c.id === activeId}>
              <CameraCard
                camera={c}
                active={c.id === activeId}
                onSelect={onSelect}
                onMore={onCameraMore}
              />
            </li>
          ))}
        </ul>
      </div>
    </GlassPanel>
  );
}
