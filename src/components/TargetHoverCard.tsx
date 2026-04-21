import type { CSSProperties } from 'react';
import GlassPanel from './GlassPanel';

export type TargetHoverCardStatus = 'Active' | 'Inactive';

export type TargetHoverCardData = {
  name: string;
  externalId: string;
  status: TargetHoverCardStatus;
  thumbnailUrl?: string;
};

type TargetHoverCardProps = {
  target: TargetHoverCardData;
  className?: string;
  style?: CSSProperties;
  onOpen?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onArchive?: () => void;
};

const STATUS_STYLES: Record<TargetHoverCardStatus, { border: string; bg: string; text: string }> = {
  Active: { border: '#12a96f', bg: 'rgba(18,169,111,0.2)', text: '#2eb07e' },
  Inactive: { border: '#ff3646', bg: 'rgba(255,54,70,0.2)', text: '#ff3646' },
};

const ICON_COLOR = 'var(--accent-muted)';
const ICON_STROKE_WIDTH = 1.33;

function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 18.6667C9.10457 18.6667 10 17.7712 10 16.6667C10 15.5621 9.10457 14.6667 8 14.6667C6.89543 14.6667 6 15.5621 6 16.6667C6 17.7712 6.89543 18.6667 8 18.6667Z"
        stroke={ICON_COLOR}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16.6667H15.6667C16.2855 16.6667 16.879 16.4208 17.3166 15.9832C17.7542 15.5457 18 14.9522 18 14.3333C18 13.7145 17.7542 13.121 17.3166 12.6834C16.879 12.2458 16.2855 12 15.6667 12H8.33333C7.71449 12 7.121 11.7542 6.68342 11.3166C6.24583 10.879 6 10.2855 6 9.66667C6 9.04783 6.24583 8.45434 6.68342 8.01675C7.121 7.57917 7.71449 7.33333 8.33333 7.33333H14"
        stroke={ICON_COLOR}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9.33333C17.1046 9.33333 18 8.4379 18 7.33333C18 6.22876 17.1046 5.33333 16 5.33333C14.8954 5.33333 14 6.22876 14 7.33333C14 8.4379 14.8954 9.33333 16 9.33333Z"
        stroke={ICON_COLOR}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15.3345 6.00061C15.6881 6.00061 16.0272 6.14108 16.2773 6.39113C16.5273 6.64118 16.6678 6.98032 16.6678 7.33394V17.3339C16.6678 17.4507 16.6371 17.5654 16.5788 17.6665C16.5205 17.7677 16.4367 17.8518 16.3357 17.9104C16.2347 17.9689 16.1201 18 16.0034 18.0004C15.8867 18.0008 15.7719 17.9705 15.6705 17.9126L12.6625 16.1939C12.4611 16.0789 12.2331 16.0184 12.0011 16.0184C11.7692 16.0184 11.5412 16.0789 11.3398 16.1939L8.33181 17.9126C8.23044 17.9705 8.11564 18.0008 7.9989 18.0004C7.88215 18 7.76756 17.9689 7.66658 17.9104C7.5656 17.8518 7.48177 17.7677 7.42349 17.6665C7.36521 17.5654 7.33452 17.4507 7.33448 17.3339V7.33394C7.33448 6.98032 7.47496 6.64118 7.72501 6.39113C7.97505 6.14108 8.31419 6.00061 8.66781 6.00061H15.3345Z"
        stroke={ICON_COLOR}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.9987 6H5.9987C5.63051 6 5.33203 6.29848 5.33203 6.66667V8.66667C5.33203 9.03486 5.63051 9.33333 5.9987 9.33333H17.9987C18.3669 9.33333 18.6654 9.03486 18.6654 8.66667V6.66667C18.6654 6.29848 18.3669 6 17.9987 6Z"
        stroke={ICON_COLOR}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66797 9.33203V16.6654C6.66797 17.019 6.80844 17.3581 7.05849 17.6082C7.30854 17.8582 7.64768 17.9987 8.0013 17.9987H16.0013C16.3549 17.9987 16.6941 17.8582 16.9441 17.6082C17.1942 17.3581 17.3346 17.019 17.3346 16.6654V9.33203"
        stroke={ICON_COLOR}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.668 12H13.3346"
        stroke={ICON_COLOR}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={label}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgb(var(--accent-rgb)/0.14)] cursor-pointer hover:bg-[rgb(var(--accent-rgb)/0.24)] active:scale-[0.96] [transition-property:background-color,scale] [transition-duration:140ms] [transition-timing-function:cubic-bezier(0.2,0,0,1)]"
    >
      {children}
    </button>
  );
}

export default function TargetHoverCard({
  target,
  className = '',
  style,
  onOpen,
  onShare,
  onBookmark,
  onArchive,
}: TargetHoverCardProps) {
  const statusStyle = STATUS_STYLES[target.status];

  return (
    <GlassPanel
      className={className}
      cornerRadius={10}
      padding="0px"
      style={{ background: 'rgb(var(--accent-rgb)/0.1)', ...style }}
    >
      <div
        className="flex rounded-[10px] overflow-hidden min-h-[125px] cursor-pointer"
        onClick={onOpen}
      >
        <div className="relative w-[150px] shrink-0 img-outline">
          {target.thumbnailUrl ? (
            <img
              src={target.thumbnailUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(30,191,245,0.35), rgb(var(--accent-rgb)/0.25) 60%, rgba(12,11,25,0.6))',
              }}
            />
          )}
          <div className="absolute inset-0 bg-[rgb(var(--accent-rgb)/0.19)]" />
        </div>

        <div className="flex flex-col flex-1 py-[14px] px-[12px] gap-[14px] justify-between">
          <div className="flex flex-col gap-[3px]">
            <p
              className="m-0 font-ibm-plex-sans font-medium text-[18px] leading-none text-white whitespace-nowrap"
              style={{ letterSpacing: '-0.36px' }}
            >
              {target.name}
            </p>
            <p className="m-0 font-ibm-plex-sans font-normal text-[14px] leading-[1.25] text-[#c4c4c4]">
              ID {target.externalId}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-[7px]">
              <IconButton label="Share target" onClick={onShare}>
                <ShareIcon />
              </IconButton>
              <IconButton label="Bookmark target" onClick={onBookmark}>
                <BookmarkIcon />
              </IconButton>
              <IconButton label="Archive target" onClick={onArchive}>
                <ArchiveIcon />
              </IconButton>
            </div>
            <div
              className="inline-flex items-center h-7 px-3 rounded-full border"
              style={{ borderColor: statusStyle.border, backgroundColor: statusStyle.bg }}
            >
              <span
                className="font-ibm-plex-sans font-medium text-sm leading-none"
                style={{ color: statusStyle.text }}
              >
                {target.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
