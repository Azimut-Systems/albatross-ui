/**
 * Central icon library. All icons inherit color via `currentColor` and size
 * via the `size` prop (default 24). Use `<Icon />` form so the parent's color
 * propagates through text color utilities (text-white, text-[var(--accent)]).
 */

export type IconProps = {
  size?: number;
  className?: string;
};

function Svg({
  size = 24,
  viewBox = '0 0 24 24',
  className,
  children,
}: IconProps & { viewBox?: string; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function CloseSmallIcon(props: IconProps) {
  return (
    <Svg size={16} viewBox="0 0 16 16" {...props}>
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg size={20} viewBox="0 0 20 20" {...props}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="17.5" y2="17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg size={16} viewBox="0 0 16 16" {...props}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </Svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 4H18V20L12 16L6 20V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 17L5 11H19L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 17C3 17 5 20 12 20C19 20 21 17 21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11V7H17V11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="4" x2="12" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 10L21 7.5V16.5L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

export function TargetDotIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4H8M20 4H16M4 20H8M20 20H16M4 4V8M4 20V16M20 4V8M20 20V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </Svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TargetRadarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" />
      <line x1="1" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="19" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </Svg>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <path d="M4 6H20M6 6V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V6M9 10V16M15 10V16M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg size={20} {...props}>
      <path d="M12 4V16M12 16L8 12M12 16L16 12M4 20H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <Svg size={20} {...props}>
      <path d="M4 10V4H10M20 10V4H14M4 14V20H10M20 14V20H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ThumbUpIcon(props: IconProps) {
  return (
    <Svg size={20} {...props}>
      <path d="M7 10V20H4V10H7ZM7 10L11 3C12.1046 3 13 3.89543 13 5V8H19.1C19.7196 8 20.2251 8.4905 20.2486 9.10956C20.2823 9.99998 20.25 11 20.25 11L18.5 19C18.3196 19.8196 17.5914 20 17 20H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ThumbDownIcon(props: IconProps) {
  return (
    <Svg size={20} {...props}>
      <g transform="rotate(180 12 12)">
        <path d="M7 10V20H4V10H7ZM7 10L11 3C12.1046 3 13 3.89543 13 5V8H19.1C19.7196 8 20.2251 8.4905 20.2486 9.10956C20.2823 9.99998 20.25 11 20.25 11L18.5 19C18.3196 19.8196 17.5914 20 17 20H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Svg>
  );
}

export function OpenViewIcon(props: IconProps) {
  return (
    <Svg size={16} {...props}>
      <path d="M14 4H20V10M20 4L13 11M10 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <Svg size={16} viewBox="0 0 16 16" {...props}>
      <rect x="4" y="3.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
      <rect x="9.5" y="3.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
    </Svg>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <Svg size={16} viewBox="0 0 16 16" {...props}>
      <path d="M3 5H13L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 11H3L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <Svg size={19} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 15L12 7L15 15L12 13L9 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Svg size={20} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </Svg>
  );
}

export { default as PinIcon } from './PinIcon';
export { default as RulerIcon } from './RulerIcon';
