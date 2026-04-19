import type { CSSProperties } from 'react';

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
  onShare?: () => void;
  onBookmark?: () => void;
  onArchive?: () => void;
};

const STATUS_STYLES: Record<TargetHoverCardStatus, { border: string; bg: string; text: string }> = {
  Active: { border: '#12a96f', bg: 'rgba(18,169,111,0.2)', text: '#2eb07e' },
  Inactive: { border: '#ff3646', bg: 'rgba(255,54,70,0.2)', text: '#ff3646' },
};

const ICON_COLOR = '#BBB0DC';

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 12.6667C5.10457 12.6667 6 11.7712 6 10.6667C6 9.56209 5.10457 8.66667 4 8.66667C2.89543 8.66667 2 9.56209 2 10.6667C2 11.7712 2.89543 12.6667 4 12.6667Z"
        stroke={ICON_COLOR}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10.6667H11.6667C12.2855 10.6667 12.879 10.4208 13.3166 9.98325C13.7542 9.54566 14 8.95217 14 8.33333C14 7.71449 13.7542 7.121 13.3166 6.68342C12.879 6.24583 12.2855 6 11.6667 6H4.33333C3.71449 6 3.121 5.75417 2.68342 5.31658C2.24583 4.879 2 4.28551 2 3.66667C2 3.04783 2.24583 2.45434 2.68342 2.01675C3.121 1.57917 3.71449 1.33333 4.33333 1.33333H10"
        stroke={ICON_COLOR}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3.33333C13.1046 3.33333 14 2.4379 14 1.33333C14 0.228763 13.1046 -0.666667 12 -0.666667C10.8954 -0.666667 10 0.228763 10 1.33333C10 2.4379 10.8954 3.33333 12 3.33333Z"
        stroke={ICON_COLOR}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.3345 0.666667C11.6881 0.666667 12.0272 0.807143 12.2773 1.05719C12.5273 1.30724 12.6678 1.64638 12.6678 2V12C12.6678 12.1168 12.6371 12.2315 12.5788 12.3326C12.5205 12.4338 12.4367 12.5179 12.3357 12.5764C12.2347 12.635 12.1201 12.6661 12.0034 12.6665C11.8867 12.6669 11.7719 12.6366 11.6705 12.5787L8.66249 10.86C8.46109 10.745 8.23314 10.6844 8.00115 10.6844C7.76916 10.6844 7.54121 10.745 7.33982 10.86L4.33182 12.5787C4.23044 12.6366 4.11564 12.6669 3.9989 12.6665C3.88215 12.6661 3.76756 12.635 3.66658 12.5764C3.5656 12.5179 3.48177 12.4338 3.42349 12.3326C3.36521 12.2315 3.33452 12.1168 3.33448 12V2C3.33448 1.64638 3.47496 1.30724 3.72501 1.05719C3.97505 0.807143 4.31419 0.666667 4.66781 0.666667H11.3345Z"
        stroke={ICON_COLOR}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.9987 0.666667H1.9987C1.63051 0.666667 1.33203 0.965144 1.33203 1.33333V3.33333C1.33203 3.70152 1.63051 4 1.9987 4H13.9987C14.3669 4 14.6654 3.70152 14.6654 3.33333V1.33333C14.6654 0.965144 14.3669 0.666667 13.9987 0.666667Z"
        stroke={ICON_COLOR}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.66797 4V11.3333C2.66797 11.687 2.80844 12.0261 3.05849 12.2761C3.30854 12.5262 3.64768 12.6667 4.0013 12.6667H12.0013C12.3549 12.6667 12.6941 12.5262 12.9441 12.2761C13.1942 12.0261 13.3346 11.687 13.3346 11.3333V4"
        stroke={ICON_COLOR}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66797 6.66667H9.33464"
        stroke={ICON_COLOR}
        strokeWidth="1.33333"
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
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(187,176,220,0.14)] cursor-pointer hover:bg-[rgba(187,176,220,0.24)] transition-colors"
    >
      {children}
    </button>
  );
}

export default function TargetHoverCard({
  target,
  className = '',
  style,
  onShare,
  onBookmark,
  onArchive,
}: TargetHoverCardProps) {
  const statusStyle = STATUS_STYLES[target.status];

  return (
    <div
      className={`w-[342px] h-[125px] rounded-[10px] overflow-hidden ${className.includes('fixed') || className.includes('absolute') ? '' : 'relative'} ${className}`}
      style={{
        backgroundColor: 'rgba(54,12,198,0.1)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        ...style,
      }}
    >
      <div className="absolute top-0 left-0 w-[170px] h-full rounded-l-[10px] overflow-hidden">
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
                'linear-gradient(135deg, rgba(30,191,245,0.35), rgba(105,49,245,0.25) 60%, rgba(12,11,25,0.6))',
            }}
          />
        )}
        <div className="absolute inset-0 bg-[rgba(54,12,198,0.19)]" />
      </div>

      <p
        className="absolute top-[14px] left-[180px] m-0 font-satoshi font-medium text-[18px] text-white whitespace-nowrap"
        style={{ letterSpacing: '-0.36px' }}
      >
        {target.name}
      </p>

      <p className="absolute top-[41px] left-[180px] m-0 font-satoshi font-normal text-[14px] text-[#c4c4c4]">
        ID {target.externalId}
      </p>

      <div className="absolute top-[85px] left-[180px] flex items-center gap-[7px]">
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
        className="absolute top-[89px] left-[281px] flex items-center h-5 px-2 rounded-[34px] border"
        style={{ borderColor: statusStyle.border, backgroundColor: statusStyle.bg }}
      >
        <span
          className="font-satoshi font-medium text-xs leading-none"
          style={{ color: statusStyle.text }}
        >
          {target.status}
        </span>
      </div>
    </div>
  );
}
