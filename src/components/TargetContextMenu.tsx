import { useState } from 'react';

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

type MenuBoxProps = {
  children: React.ReactNode;
  width: number;
};

function MenuBox({ children, width }: MenuBoxProps) {
  return (
    <div
      className="flex flex-col rounded-lg border border-[#392f57] p-2"
      style={{
        width,
        background: 'rgba(34,25,60,0.85)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {children}
    </div>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  trailing?: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
};

function MenuItem({
  icon,
  label,
  active,
  trailing,
  onClick,
  onMouseEnter,
}: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`flex items-center gap-[6px] w-full px-2 py-[10px] rounded text-white text-left cursor-pointer transition-colors ${
        active ? 'bg-[rgba(93,52,165,0.45)]' : 'hover:bg-[rgba(93,52,165,0.35)]'
      }`}
    >
      <div className="flex flex-1 items-center gap-2 min-w-0 text-white">
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

type Props = {
  onAction: (action: TargetContextMenuAction) => void;
};

export default function TargetContextMenu({ onAction }: Props) {
  const [submenu, setSubmenu] = useState<'target' | 'map' | null>('target');

  return (
    <div className="flex items-start gap-1 pointer-events-auto">
      <MenuBox width={136}>
        <MenuItem
          icon={<TargetIcon />}
          label="Target"
          active={submenu === 'target'}
          onMouseEnter={() => setSubmenu('target')}
          trailing={<ChevronRightIcon />}
        />
        <MenuItem
          icon={<MapIcon />}
          label="Map"
          active={submenu === 'map'}
          onMouseEnter={() => setSubmenu('map')}
          trailing={<ChevronRightIcon />}
        />
      </MenuBox>
      {submenu === 'target' && (
        <MenuBox width={141}>
          <MenuItem
            icon={<CrosshairIcon />}
            label="Track Target"
            onClick={() => onAction('track')}
          />
          <MenuItem
            icon={<InvestigateIcon />}
            label="Investigate"
            onClick={() => onAction('investigate')}
          />
          <MenuItem
            icon={<ClearAlertIcon />}
            label="Clear Alert"
            onClick={() => onAction('clear-alert')}
          />
          <MenuItem
            icon={<FocusIcon />}
            label="Point Camera"
            onClick={() => onAction('point-camera')}
          />
          <MenuItem
            icon={<RouteIcon />}
            label="History Path"
            onClick={() => onAction('history-path')}
          />
          <MenuItem
            icon={<RulerIcon />}
            label="Measure"
            onClick={() => onAction('measure')}
          />
          <MenuItem
            icon={<TargetIcon />}
            label="Highlight TGT"
            onClick={() => onAction('highlight')}
          />
        </MenuBox>
      )}
    </div>
  );
}
