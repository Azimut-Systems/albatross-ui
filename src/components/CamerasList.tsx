import { memo } from 'react';
import CardPanel from './CardPanel';
import { CameraIcon, SearchIcon } from './icons';
import {
  Badge,
  FilterPill,
  ListItemButton,
  ListMoreHandle,
} from './primitives';
import { CAMERA_STATUS_TONES, CAMERA_ACTIVITY_TONES } from '../design/tokens';

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

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-4 w-full">
      <span className="font-ibm-plex-sans font-medium text-sm text-white">
        {Math.round(clamped)}% To complete
      </span>
      <div
        className="h-[11.4px] w-full rounded-[32.33px] overflow-hidden"
        style={{ background: 'rgb(var(--accent-rgb) / 0.2)' }}
      >
        <div
          className="h-full rounded-[20px]"
          style={{
            width: `${clamped}%`,
            backgroundImage:
              'linear-gradient(90deg, rgb(var(--accent-rgb) / 0.7) 0%, rgb(var(--accent-rgb) / 0.7) 100%), linear-gradient(171deg, rgba(56,78,231,0.3) 5.66%, rgba(30,191,245,0.3) 98.95%)',
          }}
        />
      </div>
    </div>
  );
}

function CameraThumbnail({ url }: { url?: string }) {
  return (
    <div className="relative w-full h-[220px] overflow-hidden rounded-[8.48px]">
      {url ? (
        <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgb(var(--accent-rgb) / 0.35), rgba(30,191,245,0.25) 60%, rgba(12,11,25,0.6))',
          }}
        />
      )}
      <div className="absolute inset-0" style={{ background: 'rgb(var(--accent-rgb) / 0.1)' }} />
      <div className="absolute top-3 right-5">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true" className="text-white/80">
          <path d="M4 4H8M4 4V8M4 4L8 8M15 4H11M15 4V8M15 4L11 8M4 15H8M4 15V11M4 15L8 11M15 15H11M15 15V11M15 15L11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

type CameraRowProps = {
  camera: Camera;
  active: boolean;
  onSelect?: (id: string) => void;
  onMore?: (id: string) => void;
};

const CameraRow = memo(function CameraRow({
  camera,
  active,
  onSelect,
  onMore,
}: CameraRowProps) {
  return (
    <ListItemButton active={active} onClick={() => onSelect?.(camera.id)}>
      <div className="flex gap-3 items-center w-full">
        <div className="flex flex-1 gap-3 items-center min-w-0">
          <div className="flex items-center p-2 rounded-[30px] bg-[var(--surface-accent-medium)] text-white shrink-0">
            <CameraIcon />
          </div>
          <span className="font-ibm-plex-sans font-bold text-base text-white tracking-[0.1px] leading-5 truncate">
            {camera.name}
          </span>
        </div>
        <div className="flex gap-2 items-center shrink-0">
          <Badge label={camera.status} tone={CAMERA_STATUS_TONES[camera.status]} />
          <Badge label={camera.activity} tone={CAMERA_ACTIVITY_TONES[camera.activity]} />
          {active && onMore && (
            <ListMoreHandle
              label={`More actions for ${camera.name}`}
              onActivate={() => onMore(camera.id)}
            />
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--surface-accent-strong)]" />

      <ProgressBar value={camera.completion} />

      <CameraThumbnail url={camera.thumbnailUrl} />
    </ListItemButton>
  );
});

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
    <CardPanel className="absolute top-[110px] right-6 z-20">
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
              className="flex items-center px-1 py-1.5 rounded text-white cursor-pointer hover:bg-[var(--hover-overlay)]"
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
              <CameraRow
                camera={c}
                active={c.id === activeId}
                onSelect={onSelect}
                onMore={onCameraMore}
              />
            </li>
          ))}
        </ul>
      </div>
    </CardPanel>
  );
}
