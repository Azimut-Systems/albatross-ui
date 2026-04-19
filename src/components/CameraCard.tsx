import GlassPanel from './GlassPanel';
import type { Camera, CameraStatus, CameraActivity } from './CamerasList';

type CameraCardProps = {
  camera: Camera;
  onBack?: () => void;
  onClose?: () => void;
  onSwapView?: () => void;
  onLoadMission?: () => void;
  onPauseMission?: () => void;
  onCancelMission?: () => void;
};

const STATUS_STYLES: Record<CameraStatus, { border: string; bg: string; text: string }> = {
  Connected: { border: '#12a96f', bg: 'rgba(18,169,111,0.2)', text: '#2eb07e' },
  Disconnected: { border: '#ff3646', bg: 'rgba(255,54,70,0.2)', text: '#ff3646' },
};

const ACTIVITY_STYLES: Record<CameraActivity, { border: string; bg: string; text: string }> = {
  Idle: { border: '#ef835d', bg: 'rgba(239,131,93,0.2)', text: '#ef835d' },
  Active: { border: '#6931f5', bg: 'rgba(105,49,245,0.2)', text: '#a88cff' },
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

function BookmarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4H18V20L12 16L6 20V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4" y="3.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
      <rect x="9.5" y="3.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function CloseSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 5H13L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 11H3L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 15L12 7L15 15L12 13L9 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10V4H10M20 10V4H14M4 14V20H10M20 14V20H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIllustration() {
  return (
    <div className="relative w-[56px] h-[56px] shrink-0">
      <div className="absolute top-0 right-0 w-7 h-7 rounded bg-[rgba(122,86,246,0.35)]" />
      <div className="absolute bottom-0 left-0 w-7 h-7 rounded bg-[rgba(122,86,246,0.35)]" />
      <svg
        className="absolute inset-0 m-auto text-white"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 11L21 8.5V15.5L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
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

function Badge({ label, border, bg, text }: { label: string; border: string; bg: string; text: string }) {
  return (
    <div
      className="flex h-5 items-center px-2 rounded-[34px] border"
      style={{ borderColor: border, backgroundColor: bg }}
    >
      <span className="font-satoshi font-medium text-xs leading-none" style={{ color: text }}>
        {label}
      </span>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 flex flex-col items-start bg-[rgba(93,52,165,0.1)] rounded-xl px-3 py-4 min-w-0">
      <span className="font-satoshi font-normal text-xs text-[#bbb0dc]">{label}</span>
      <span className="font-satoshi font-medium text-sm text-white truncate w-full">{value}</span>
    </div>
  );
}

function MissionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1.5 rounded border border-[#4c3d7b] text-white cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors"
    >
      <span className="flex items-center justify-center size-4">{icon}</span>
      <span className="font-satoshi font-medium text-sm">{label}</span>
    </button>
  );
}

function MissionDetails({
  completion,
  onLoad,
  onPause,
  onCancel,
}: {
  completion: number;
  onLoad?: () => void;
  onPause?: () => void;
  onCancel?: () => void;
}) {
  const clamped = Math.max(0, Math.min(100, completion));
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-1">
        <h3 className="flex-1 font-satoshi font-bold text-base text-white tracking-[0.1px] leading-5">
          Mission Details
        </h3>
        <button
          type="button"
          onClick={onLoad}
          className="flex items-center gap-1 text-[#bbb0dc] cursor-pointer hover:text-white transition-colors"
        >
          <span className="font-satoshi font-bold text-sm tracking-[0.1px]">Load a mission</span>
          <InfoIcon />
        </button>
      </div>
      <div className="flex flex-col gap-4 bg-[rgba(93,52,165,0.1)] rounded-xl px-4 py-5 w-full">
        <span className="font-satoshi font-bold text-base text-white">
          {Math.round(clamped)}% To complete
        </span>
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
        <div className="flex items-center gap-2">
          <MissionButton icon={<PauseIcon />} label="Pause" onClick={onPause} />
          <MissionButton icon={<CloseSmallIcon />} label="Cancel" onClick={onCancel} />
        </div>
      </div>
    </section>
  );
}

function LiveCamera({ onSwap }: { onSwap?: () => void }) {
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-1">
        <h3 className="flex-1 font-satoshi font-bold text-base text-white tracking-[0.1px] leading-5">
          Live Camera
        </h3>
        <button
          type="button"
          onClick={onSwap}
          className="flex items-center gap-1 px-2 py-1.5 rounded text-[#bbb0dc] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        >
          <SwapIcon />
          <span className="font-satoshi font-bold text-sm">Swap View</span>
        </button>
      </div>
      <div
        className="relative h-[283px] w-full overflow-hidden rounded-[8.48px] border border-black"
        style={{
          background:
            'linear-gradient(135deg, rgba(30,191,245,0.35), rgba(105,49,245,0.35) 55%, rgba(12,11,25,0.75))',
        }}
      >
        <div className="absolute inset-0 bg-[rgba(105,49,245,0.1)]" />
        <div className="absolute left-0 right-0 top-3 flex items-center justify-between px-5 text-white/80">
          <CompassIcon />
          <ExpandIcon />
        </div>
      </div>
    </section>
  );
}

export default function CameraCard({
  camera,
  onBack,
  onClose,
  onSwapView,
  onLoadMission,
  onPauseMission,
  onCancelMission,
}: CameraCardProps) {
  const status = STATUS_STYLES[camera.status];
  const activity = ACTIVITY_STYLES[camera.activity];

  return (
    <GlassPanel
      className="absolute top-[110px] right-6 z-20"
      cornerRadius={24}
      padding="24px"
    >
      <div
        className="flex flex-col gap-8 w-[416px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ height: 'calc((100vh - 110px) / var(--ui-scale) - 110px)' }}
      >
        <div className="flex flex-col gap-6 w-full shrink-0">
          <div className="flex items-center justify-between w-full">
            <IconButton label="Back to list" onClick={onBack}>
              <BackIcon />
            </IconButton>
            <IconButton label="Close camera card" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex gap-4 items-center w-full">
            <CameraIllustration />
            <div className="flex flex-1 flex-col gap-3 min-w-0">
              <div className="flex items-center gap-1.5 w-full">
                <h2 className="flex-1 font-satoshi font-bold text-[22px] text-white leading-[1.5] truncate">
                  {camera.name}
                </h2>
                <IconButton label="Bookmark camera">
                  <BookmarkIcon />
                </IconButton>
              </div>
              <div className="flex items-center gap-1">
                <Badge label={camera.status} border={status.border} bg={status.bg} text={status.text} />
                <Badge label={camera.activity} border={activity.border} bg={activity.bg} text={activity.text} />
              </div>
            </div>
          </div>
        </div>

        <MissionDetails
          completion={camera.completion}
          onLoad={onLoadMission}
          onPause={onPauseMission}
          onCancel={onCancelMission}
        />

        <section className="flex flex-col gap-3 w-full shrink-0">
          <div className="flex gap-3 items-center w-full">
            <Field label="Camera" value="CS - AS637" />
            <Field label="Speed" value="Normal" />
          </div>
          <div className="flex gap-3 items-center w-full">
            <Field label="Target Size" value="84m" />
            <Field label="Next Run" value="28/01/26, 10:48:02" />
          </div>
        </section>

        <LiveCamera onSwap={onSwapView} />
      </div>
    </GlassPanel>
  );
}
