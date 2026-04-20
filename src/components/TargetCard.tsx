import { useState } from 'react';
import GlassPanel from './GlassPanel';
import type { Target, TargetStatus } from './TargetsList';

type TargetCardProps = {
  target: Target;
  onBack?: () => void;
  onClose?: () => void;
};

type Tab = 'EO' | 'AIS' | 'AID';

const STATUS_STYLES: Record<TargetStatus, { border: string; bg: string; text: string }> = {
  Critical: { border: '#ff3646', bg: 'rgba(255,54,70,0.2)', text: '#ff3646' },
  Warning: { border: '#f5a623', bg: 'rgba(245,166,35,0.2)', text: '#f5a623' },
  Normal: { border: '#12a96f', bg: 'rgba(18,169,111,0.2)', text: '#2eb07e' },
};

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShipIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17L5 11H19L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 17C3 17 5 20 12 20C19 20 21 17 21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11V7H17V11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="4" x2="12" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TargetDotIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4H8M20 4H16M4 20H8M20 20H16M4 4V8M4 20V16M20 4V8M20 20V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4H18V20L12 16L6 20V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
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

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6H20M6 6V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V6M9 10V16M15 10V16M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V5M5 12L12 5L19 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4V16M12 16L8 12M12 16L16 12M4 20H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10V4H10M20 10V4H14M4 14V20H10M20 14V20H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10V20H4V10H7ZM7 10L11 3C12.1046 3 13 3.89543 13 5V8H19.1C19.7196 8 20.2251 8.4905 20.2486 9.10956C20.2823 9.99998 20.25 11 20.25 11L18.5 19C18.3196 19.8196 17.5914 20 17 20H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g transform="rotate(180 12 12)">
        <path d="M7 10V20H4V10H7ZM7 10L11 3C12.1046 3 13 3.89543 13 5V8H19.1C19.7196 8 20.2251 8.4905 20.2486 9.10956C20.2823 9.99998 20.25 11 20.25 11L18.5 19C18.3196 19.8196 17.5914 20 17 20H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function OpenViewIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 4H20V10M20 4L13 11M10 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusBadge({ status }: { status: TargetStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <div
      className="inline-flex h-[18px] items-center gap-1.5 px-2 rounded-full"
      style={{ backgroundColor: s.bg }}
    >
      <span
        className="inline-block size-1.5 rounded-full"
        style={{ backgroundColor: s.text }}
      />
      <span
        className="font-ibm-plex-sans font-semibold text-[10px] leading-none tracking-wide uppercase"
        style={{ color: s.text }}
      >
        {status}
      </span>
    </div>
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
      className="flex items-center justify-center p-1 rounded text-white cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
    >
      {children}
    </button>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-7 px-0 mr-5 font-ibm-plex-sans font-semibold text-[13px] tracking-wide cursor-pointer transition-colors ${
        active ? 'text-white' : 'text-[#9a8fc0] hover:text-[rgba(255,255,255,0.85)]'
      }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-px left-0 right-0 h-px bg-[var(--accent)]" />
      )}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 flex flex-col gap-1 items-start bg-[rgb(var(--accent-rgb)/0.08)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2.5 min-w-0">
      <span className="font-ibm-plex-sans font-normal text-[11px] text-[#9a8fc0] tracking-wide uppercase">{label}</span>
      <span className="font-ibm-plex-sans font-medium text-sm text-white truncate w-full">{value}</span>
    </div>
  );
}

function AlertRow({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex items-center gap-3 bg-[rgb(var(--accent-rgb)/0.12)] border border-[rgba(255,255,255,0.04)] rounded-lg pl-3.5 pr-2 py-2.5 w-full">
      <div className="flex flex-1 flex-col min-w-0 font-ibm-plex-sans">
        <span className="font-medium text-sm text-white truncate">{title}</span>
        <span className="font-normal text-[11px] text-[#9a8fc0] truncate">{time}</span>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <div
          className="inline-flex h-[18px] items-center px-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(18,169,111,0.18)' }}
        >
          <span className="font-ibm-plex-sans font-medium text-[10px] leading-none text-[#2eb07e] tracking-wide uppercase">Auto</span>
        </div>
        <IconButton label="Alert actions">
          <MoreIcon />
        </IconButton>
      </div>
    </div>
  );
}

function VisualRecognition() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        <h3 className="flex-1 font-ibm-plex-sans font-bold text-base text-white tracking-[0.1px] leading-5">
          Visual Recognition
        </h3>
        <IconButton label="Download image">
          <DownloadIcon />
        </IconButton>
        <IconButton label="Expand image">
          <ExpandIcon />
        </IconButton>
      </div>
      <div className="flex flex-col gap-3 bg-[rgb(var(--accent-rgb)/0.08)] border border-[rgba(255,255,255,0.04)] rounded-xl px-4 py-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="font-ibm-plex-sans font-semibold text-[22px] text-white tracking-[-0.4px] tabular-nums leading-none">
              82%
            </span>
            <span className="font-ibm-plex-sans font-normal text-xs text-[#9a8fc0] tracking-[-0.1px]">
              Confidence Score
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#9a8fc0]">
            <IconButton label="Mark correct">
              <ThumbUpIcon />
            </IconButton>
            <IconButton label="Mark incorrect">
              <ThumbDownIcon />
            </IconButton>
          </div>
        </div>
        <span className="font-ibm-plex-sans font-normal text-[11px] text-[#9a8fc0] tracking-wide tabular-nums">
          Live Detection Image · 01/04/26, 10:44:13
        </span>
        <div
          className="relative h-[175px] w-full rounded-md overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 100%), linear-gradient(135deg, rgba(30,191,245,0.45), rgb(var(--accent-rgb)/0.35) 60%, rgba(12,11,25,0.75))',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(114,84,237,0.25),transparent_60%)]" />
          <div className="absolute top-1/2 left-6 right-6 h-px bg-[rgba(255,255,255,0.3)]" />
        </div>
      </div>
    </section>
  );
}

function PositionHistory() {
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-1">
        <h3 className="flex-1 font-ibm-plex-sans font-bold text-base text-white tracking-[0.1px] leading-5">
          Position History
        </h3>
        <button
          type="button"
          className="flex items-center gap-1 px-2 py-1.5 rounded text-[var(--accent-muted)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        >
          <OpenViewIcon />
          <span className="font-ibm-plex-sans font-bold text-sm tracking-[0.1px]">Open View</span>
        </button>
      </div>
      <div
        className="relative h-[210px] w-full rounded-lg overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 30% 40%, rgba(116,78,236,0.4), transparent 55%), radial-gradient(circle at 70% 70%, rgba(30,191,245,0.25), transparent 60%), #1c1836',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 210" fill="none" preserveAspectRatio="none">
          <path
            d="M 30 170 Q 100 140 160 110 T 300 50"
            stroke="#744eec"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 4"
          />
          <circle cx="30" cy="170" r="4" fill="#744eec" />
          <circle cx="160" cy="110" r="6" fill="#744eec" stroke="#fff" strokeWidth="1" />
          <circle cx="300" cy="50" r="5" fill="#744eec" />
        </svg>
      </div>
    </section>
  );
}

export default function TargetCard({ target, onBack, onClose }: TargetCardProps) {
  const [tab, setTab] = useState<Tab>('AID');
  const [alertInput, setAlertInput] = useState('');

  const fields: [string, string][] = [
    ['AID ID', target.aidId ?? '—'],
    ['Class/Subclass', target.vesselClass],
    ['Vessel Name', target.vesselName ?? target.name],
    ['Owner/Operator', target.owner ?? '—'],
    ['IMO Number', target.imoNumber ?? '—'],
    ['Threat Level', target.threatLevel ?? '—'],
  ];

  return (
    <GlassPanel
      className="absolute top-[110px] left-6 z-20"
      cornerRadius={24}
      padding="24px"
    >
      <div
        className="flex flex-col gap-6 w-[416px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ height: 'calc((100vh - 110px) / var(--ui-scale) - 110px)' }}
      >
        <div className="flex flex-col gap-5 w-full shrink-0">
          <div className="flex items-center justify-between w-full">
            <IconButton label="Back to list" onClick={onBack}>
              <BackIcon />
            </IconButton>
            <IconButton label="Close target card" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex gap-3 items-center w-full">
            <div className="flex items-center justify-center size-11 rounded-lg bg-[rgb(var(--accent-rgb)/0.15)] text-white shrink-0">
              <ShipIcon />
            </div>
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <div className="flex items-center gap-0.5 w-full">
                <h2 className="flex-1 font-ibm-plex-sans font-bold text-lg text-white leading-tight tracking-[-0.2px] truncate">
                  {target.name}
                </h2>
                <IconButton label="Track target">
                  <TargetDotIcon />
                </IconButton>
                <IconButton label="Bookmark target">
                  <BookmarkIcon />
                </IconButton>
                <IconButton label="More actions">
                  <MoreIcon />
                </IconButton>
              </div>
              <div className="flex items-center">
                <StatusBadge status={target.status} />
              </div>
            </div>
          </div>
        </div>

        <VisualRecognition />

        <section className="flex flex-col gap-4 shrink-0">
          <div className="flex items-center h-7 border-b border-[rgba(255,255,255,0.06)]">
            {(['EO', 'AIS', 'AID'] as const).map((t) => (
              <TabButton key={t} label={t} active={tab === t} onClick={() => setTab(t)} />
            ))}
          </div>
          <div className="flex flex-col gap-2 w-full">
            {[0, 2, 4].map((i) => (
              <div key={i} className="flex gap-2 items-center w-full">
                <Field label={fields[i][0]} value={fields[i][1]} />
                <Field label={fields[i + 1][0]} value={fields[i + 1][1]} />
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <h3 className="flex-1 font-ibm-plex-sans font-bold text-base text-white tracking-[0.1px] leading-5">
              Alerts
            </h3>
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1.5 rounded text-[var(--accent-muted)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <HistoryIcon />
              <span className="font-ibm-plex-sans font-bold text-sm tracking-[0.1px]">History</span>
            </button>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label className="flex items-center gap-2 bg-[rgb(var(--accent-rgb)/0.08)] border border-[rgb(var(--accent-rgb)/0.35)] rounded-lg px-3.5 py-2.5 w-full focus-within:border-[rgb(var(--accent-rgb)/0.6)] transition-colors">
              <input
                type="text"
                value={alertInput}
                onChange={(e) => setAlertInput(e.target.value)}
                placeholder="Add your input…"
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-ibm-plex-sans font-medium text-sm text-white placeholder:text-[#9a8fc0]"
              />
              <button
                type="button"
                className="flex items-center justify-center size-6 rounded-md bg-[rgb(var(--accent-rgb)/0.9)] cursor-pointer hover:bg-[var(--accent)] transition-colors disabled:opacity-40"
                disabled={alertInput.trim().length === 0}
                aria-label="Submit alert input"
              >
                <SendIcon />
              </button>
            </label>
            <AlertRow title="AIS Mismatch" time="27 Minutes ago" />
            <AlertRow title="AIS Mismatch" time="27 Minutes ago" />
          </div>
        </section>

      </div>
    </GlassPanel>
  );
}
