import { useState } from 'react';
import CardPanel from './CardPanel';
import type { Target, TargetStatus } from './TargetsList';
import {
  BackIcon,
  BookmarkIcon,
  CloseIcon,
  DownloadIcon,
  ExpandIcon,
  HistoryIcon,
  MoreIcon,
  SendIcon,
  ShipIcon,
  TargetDotIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from './icons';
import {
  Field,
  IconButton,
  SectionHeading,
  StatusDotBadge,
} from './primitives';
import { AUTO_TAG_TONE, TARGET_STATUS_TONES } from '../design/tokens';

type TargetCardProps = {
  target: Target;
  onBack?: () => void;
  onClose?: () => void;
};

type Tab = 'EO' | 'AIS' | 'AID';

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
        active ? 'text-white' : 'hover:text-white'
      }`}
      style={active ? undefined : { color: 'var(--accent-muted)' }}
    >
      {label}
      {active && (
        <span className="absolute -bottom-px left-0 right-0 h-px bg-[var(--accent)]" />
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: TargetStatus }) {
  return <StatusDotBadge label={status} tone={TARGET_STATUS_TONES[status]} />;
}

function AlertRow({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex items-center gap-3 bg-[rgb(var(--accent-rgb)/0.12)] border border-[var(--border-soft)] rounded-lg pl-3.5 pr-2 py-2.5 w-full">
      <div className="flex flex-1 flex-col min-w-0 font-ibm-plex-sans">
        <span className="font-medium text-sm text-white truncate">{title}</span>
        <span className="font-normal text-[11px] truncate" style={{ color: 'var(--accent-muted)' }}>
          {time}
        </span>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <div
          className="inline-flex h-[18px] items-center px-1.5 rounded-full"
          style={{ backgroundColor: AUTO_TAG_TONE.bg }}
        >
          <span
            className="font-ibm-plex-sans font-medium text-[10px] leading-none tracking-wide uppercase"
            style={{ color: AUTO_TAG_TONE.text }}
          >
            Auto
          </span>
        </div>
        <IconButton label="Alert actions" className="text-white">
          <MoreIcon />
        </IconButton>
      </div>
    </div>
  );
}

function VisualRecognition() {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading
        title="Visual Recognition"
        action={
          <>
            <IconButton label="Download image" className="text-white">
              <DownloadIcon />
            </IconButton>
            <IconButton label="Expand image" className="text-white">
              <ExpandIcon />
            </IconButton>
          </>
        }
      />
      <div className="flex flex-col gap-3 bg-[var(--surface-accent-soft)] border border-[var(--border-soft)] rounded-xl px-4 py-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="font-ibm-plex-sans font-semibold text-[22px] text-white tracking-[-0.4px] tabular-nums leading-none">
              82%
            </span>
            <span
              className="font-ibm-plex-sans font-normal text-xs tracking-[-0.1px]"
              style={{ color: 'var(--accent-muted)' }}
            >
              Confidence Score
            </span>
          </div>
          <div className="flex items-center gap-1" style={{ color: 'var(--accent-muted)' }}>
            <IconButton label="Mark correct">
              <ThumbUpIcon />
            </IconButton>
            <IconButton label="Mark incorrect">
              <ThumbDownIcon />
            </IconButton>
          </div>
        </div>
        <span
          className="font-ibm-plex-sans font-normal text-[11px] tracking-wide tabular-nums"
          style={{ color: 'var(--accent-muted)' }}
        >
          Live Detection Image · 01/04/26, 10:44:13
        </span>
        <div className="w-full rounded-xl overflow-hidden">
          <img src="/target-image.jpg" alt="Live detection image" className="w-full h-auto block" />
        </div>
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
    <CardPanel className="absolute top-[110px] left-6 z-20">
      <div
        className="flex flex-col gap-6 w-[416px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ height: 'calc((100vh - 110px) / var(--ui-scale) - 110px)' }}
      >
        <div className="flex flex-col gap-5 w-full shrink-0">
          <div className="flex items-center justify-between w-full">
            <IconButton label="Back to list" onClick={onBack} className="text-white">
              <BackIcon />
            </IconButton>
            <IconButton label="Close target card" onClick={onClose} className="text-white">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex gap-3 items-center w-full">
            <div className="flex items-center justify-center size-11 rounded-lg bg-[var(--surface-accent-muted)] text-white shrink-0">
              <ShipIcon size={22} />
            </div>
            <div className="flex flex-1 flex-col items-start gap-1.5 min-w-0">
              <h2 className="max-w-full font-ibm-plex-sans font-bold text-lg text-white leading-tight tracking-[-0.2px] truncate">
                {target.name}
              </h2>
              <StatusBadge status={target.status} />
            </div>
            <div className="flex items-center gap-0.5 shrink-0 -mr-1">
              <IconButton label="Track target" className="text-white">
                <TargetDotIcon />
              </IconButton>
              <IconButton label="Bookmark target" className="text-white">
                <BookmarkIcon />
              </IconButton>
              <IconButton label="More actions" className="text-white">
                <MoreIcon />
              </IconButton>
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
          <SectionHeading
            title="Alerts"
            action={
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-1.5 rounded text-[var(--accent-muted)] cursor-pointer hover:bg-[var(--hover-overlay)] transition-colors"
              >
                <HistoryIcon />
                <span className="font-ibm-plex-sans font-bold text-sm tracking-[0.1px]">History</span>
              </button>
            }
          />
          <div className="flex flex-col gap-4 w-full">
            <label className="flex items-center gap-2 bg-[var(--surface-accent-soft)] border border-[rgb(var(--accent-rgb)/0.35)] rounded-lg px-3.5 py-2.5 w-full focus-within:border-[rgb(var(--accent-rgb)/0.6)] transition-colors">
              <input
                type="text"
                value={alertInput}
                onChange={(e) => setAlertInput(e.target.value)}
                placeholder="Add your input…"
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-ibm-plex-sans font-medium text-sm text-white accent-muted-placeholder"
              />
              <button
                type="button"
                className="flex items-center justify-center size-6 rounded-md bg-[rgb(var(--accent-rgb)/0.9)] cursor-pointer hover:bg-[var(--accent)] transition-colors disabled:opacity-40 text-white"
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
    </CardPanel>
  );
}
