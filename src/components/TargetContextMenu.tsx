import { useCallback, useState } from 'react';
import GlassPanel from './GlassPanel';

type IconProps = { className?: string };

function TargetIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function MapIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M2 4.2v9l4-1.5 4 1.5 4-1.5v-9l-4 1.5-4-1.5-4 1.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6 2.7v9M10 4.2v9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function CrosshairIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 1v3M8 12v3M1 8h3M12 8h3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InvestigateIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <circle cx="5" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M6.5 12h3M2 9.5h3M11 9.5h3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M3 8.5c0-2 1-4 2-5h6c1 1 2 3 2 5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6 6.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClearAlertIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M3.5 4h9M6 4V2.5h4V4M5 4l.6 9h4.8L11 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FocusIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <path
        d="M2 4V2.5H4M12 2.5h1.5V4M14 12v1.5H12M4 13.5H2.5V12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RouteIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <circle cx="4" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M4 5c0 3 8 3 8 6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="1.5 1.5"
      />
    </svg>
  );
}

function RulerIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M1.5 10.5l9-9 4 4-9 9-4-4z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M4 8l1.5 1.5M6 6l1.5 1.5M8 4l1.5 1.5M10 2l1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MarkerIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M8 1.5c-2.5 0-4.5 2-4.5 4.5 0 3.2 4.5 8 4.5 8s4.5-4.8 4.5-8c0-2.5-2-4.5-4.5-4.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function PtcIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M8 1.5v2.5M8 12v2.5M1.5 8h2.5M12 8h2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M10 4l-4 4 4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MENU_ITEM_HEIGHT = 36;

type MenuBoxProps = {
  children: React.ReactNode;
  width: number;
};

function MenuBox({ children, width }: MenuBoxProps) {
  return (
    <GlassPanel cornerRadius={10} padding="8px">
      <div className="flex flex-col" style={{ width }}>
        {children}
      </div>
    </GlassPanel>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  trailing?: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  reverse?: boolean;
};

function MenuItem({
  icon,
  label,
  active,
  trailing,
  onClick,
  onMouseEnter,
  reverse,
}: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        color: active ? 'var(--accent-active-fg)' : 'var(--accent-muted)',
        transitionProperty: 'background-color, color, scale',
        transitionDuration: '120ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
      }}
      className={`flex items-center gap-[6px] w-full px-2 py-[10px] rounded cursor-pointer active:scale-[0.97] ${
        reverse ? 'flex-row-reverse text-right' : 'text-left'
      } ${
        active ? 'bg-[rgb(var(--accent-rgb)/0.45)]' : 'hover:bg-[rgb(var(--accent-rgb)/0.35)]'
      }`}
    >
      <div className={`flex flex-1 items-center gap-2 min-w-0 ${reverse ? 'flex-row-reverse' : ''}`}>
        {icon}
        <span
          className={`text-[14px] ${active ? 'font-bold' : 'font-medium'}`}
        >
          {label}
        </span>
      </div>
      {trailing}
    </button>
  );
}

export type TargetContextMenuAction =
  | 'track'
  | 'investigate'
  | 'clear-alert'
  | 'point-camera'
  | 'history-path'
  | 'measure'
  | 'highlight';

export type MapContextMenuAction = 'ptc' | 'measure' | 'marker';

type Props = {
  onAction: (action: TargetContextMenuAction) => void;
  onMapAction: (action: MapContextMenuAction) => void;
  openLeft?: boolean;
  openUp?: boolean;
};

export default function TargetContextMenu({ onAction, onMapAction, openLeft, openUp }: Props) {
  const [submenu, setSubmenu] = useState<'target' | 'map' | null>(null);

  const chevron = openLeft ? <ChevronLeftIcon /> : <ChevronRightIcon />;

  const onTargetHover = useCallback(() => setSubmenu('target'), []);
  const onMapHover = useCallback(() => setSubmenu('map'), []);
  const onTrack = useCallback(() => onAction('track'), [onAction]);
  const onInvestigate = useCallback(() => onAction('investigate'), [onAction]);
  const onClearAlert = useCallback(() => onAction('clear-alert'), [onAction]);
  const onPointCamera = useCallback(() => onAction('point-camera'), [onAction]);
  const onHistoryPath = useCallback(() => onAction('history-path'), [onAction]);
  const onMeasure = useCallback(() => onAction('measure'), [onAction]);
  const onHighlight = useCallback(() => onAction('highlight'), [onAction]);
  const onPtc = useCallback(() => onMapAction('ptc'), [onMapAction]);
  const onMapMeasure = useCallback(() => onMapAction('measure'), [onMapAction]);
  const onMarker = useCallback(() => onMapAction('marker'), [onMapAction]);

  const rootBox = (
    <MenuBox width={136}>
      <MenuItem
        icon={<TargetIcon />}
        label="Target"
        active={submenu === 'target'}
        onMouseEnter={onTargetHover}
        trailing={chevron}
        reverse={openLeft}
      />
      <MenuItem
        icon={<MapIcon />}
        label="Map"
        active={submenu === 'map'}
        onMouseEnter={onMapHover}
        trailing={chevron}
        reverse={openLeft}
      />
    </MenuBox>
  );

  const submenuBox =
    submenu === 'target' ? (
      <MenuBox width={141}>
        <MenuItem icon={<CrosshairIcon />} label="Track Target" onClick={onTrack} />
        <MenuItem icon={<InvestigateIcon />} label="Investigate" onClick={onInvestigate} />
        <MenuItem icon={<ClearAlertIcon />} label="Clear Alert" onClick={onClearAlert} />
        <MenuItem icon={<FocusIcon />} label="Point Camera" onClick={onPointCamera} />
        <MenuItem icon={<RouteIcon />} label="History Path" onClick={onHistoryPath} />
        <MenuItem icon={<RulerIcon />} label="Measure" onClick={onMeasure} />
        <MenuItem icon={<TargetIcon />} label="Highlight TGT" onClick={onHighlight} />
      </MenuBox>
    ) : submenu === 'map' ? (
      <div style={openUp ? undefined : { marginTop: MENU_ITEM_HEIGHT }}>
        <MenuBox width={120}>
          <MenuItem icon={<PtcIcon />} label="PTC" onClick={onPtc} />
          <MenuItem icon={<RulerIcon />} label="Measure" onClick={onMapMeasure} />
          <MenuItem icon={<MarkerIcon />} label="Marker" onClick={onMarker} />
        </MenuBox>
      </div>
    ) : null;

  return (
    <div
      className={`flex gap-1 pointer-events-auto ${openUp ? 'items-end' : 'items-start'} ${openLeft ? 'flex-row-reverse' : ''}`}
    >
      {rootBox}
      {submenuBox}
    </div>
  );
}

export function MapContextMenu({
  onAction,
}: {
  onAction: (action: MapContextMenuAction) => void;
}) {
  return (
    <div className="pointer-events-auto">
      <MenuBox width={120}>
        <MenuItem icon={<PtcIcon />} label="PTC" onClick={() => onAction('ptc')} />
        <MenuItem icon={<RulerIcon />} label="Measure" onClick={() => onAction('measure')} />
        <MenuItem icon={<MarkerIcon />} label="Marker" onClick={() => onAction('marker')} />
      </MenuBox>
    </div>
  );
}
