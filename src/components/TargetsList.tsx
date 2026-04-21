import { memo } from 'react';
import CardPanel from './CardPanel';
import { SearchIcon, ShipIcon } from './icons';
import {
  Badge,
  FilterPill,
  ListItemButton,
  ListMoreHandle,
  Stat,
} from './primitives';
import { TARGET_STATUS_TONES, VESSEL_CLASS_TONE } from '../design/tokens';

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

type TargetRowProps = {
  target: Target;
  active: boolean;
  onSelect?: (id: string) => void;
  onMore?: (id: string) => void;
};

const TargetRow = memo(function TargetRow({
  target,
  active,
  onSelect,
  onMore,
}: TargetRowProps) {
  return (
    <ListItemButton active={active} onClick={() => onSelect?.(target.id)}>
      <div className="flex gap-3 items-center w-full">
        <div className="flex flex-1 gap-3 items-center min-w-0">
          <div className="flex items-center p-2 rounded-[30px] bg-[var(--surface-accent-medium)] text-white shrink-0">
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
          <Badge label={target.status} tone={TARGET_STATUS_TONES[target.status]} />
          <Badge label={target.vesselClass} tone={VESSEL_CLASS_TONE} />
          {active && onMore && (
            <ListMoreHandle
              label={`More actions for ${target.name}`}
              onActivate={() => onMore(target.id)}
            />
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--surface-accent-strong)]" />

      <div className="grid grid-cols-4 gap-2 w-full">
        <Stat label="Heading" value={target.heading} />
        <Stat label="Speed" value={target.speed} />
        <Stat label="Transmission" value={target.transmission} />
        <Stat label="Size" value={target.size} />
      </div>
    </ListItemButton>
  );
});

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
    <CardPanel className="absolute top-[110px] left-6 z-20">
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
          aria-label="Targets"
          className="flex flex-col gap-4 w-full flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden list-none m-0 p-0"
        >
          {targets.map((t) => (
            <li key={t.id} role="option" aria-selected={t.id === activeId}>
              <TargetRow
                target={t}
                active={t.id === activeId}
                onSelect={onSelect}
                onMore={onTargetMore}
              />
            </li>
          ))}
        </ul>
      </div>
    </CardPanel>
  );
}
