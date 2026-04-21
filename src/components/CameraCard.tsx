import CardPanel from './CardPanel';
import type { Camera } from './CamerasList';
import {
  BackIcon,
  BookmarkIcon,
  CloseIcon,
  CloseSmallIcon,
  CompassIcon,
  ExpandIcon,
  InfoIcon,
  PauseIcon,
  SwapIcon,
} from './icons';
import { Badge, Field, IconButton, SectionHeading } from './primitives';
import { CAMERA_STATUS_TONES, CAMERA_ACTIVITY_TONES } from '../design/tokens';

type CameraCardProps = {
  camera: Camera;
  onBack?: () => void;
  onClose?: () => void;
  onSwapView?: () => void;
  onLoadMission?: () => void;
  onPauseMission?: () => void;
  onCancelMission?: () => void;
};

function CameraIllustration() {
  return (
    <div className="relative w-[56px] h-[56px] shrink-0">
      <div className="absolute top-0 right-0 w-7 h-7 rounded bg-[rgb(var(--accent-rgb)/0.35)]" />
      <div className="absolute bottom-0 left-0 w-7 h-7 rounded bg-[rgb(var(--accent-rgb)/0.35)]" />
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
      className="flex items-center gap-1 px-2 py-1.5 rounded border border-[var(--border-accent)] text-white cursor-pointer hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.96] [transition-property:background-color,border-color,scale] [transition-duration:140ms] [transition-timing-function:cubic-bezier(0.2,0,0,1)]"
    >
      <span className="flex items-center justify-center size-4">{icon}</span>
      <span className="font-ibm-plex-sans font-medium text-sm">{label}</span>
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
      <SectionHeading
        title="Mission Details"
        action={
          <button
            type="button"
            onClick={onLoad}
            className="flex items-center gap-1 text-[var(--accent-muted)] cursor-pointer hover:text-white active:scale-[0.96] [transition-property:color,scale] [transition-duration:140ms] [transition-timing-function:cubic-bezier(0.2,0,0,1)]"
          >
            <span className="font-ibm-plex-sans font-bold text-sm tracking-[0.1px]">Load a mission</span>
            <InfoIcon />
          </button>
        }
      />
      <div className="flex flex-col gap-4 bg-[var(--surface-accent-subtle)] border-shadow rounded-xl px-4 py-5 w-full">
        <span className="font-ibm-plex-sans font-bold text-base text-white tabular-nums">
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
      <SectionHeading
        title="Live Camera"
        action={
          <button
            type="button"
            onClick={onSwap}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-[var(--accent-muted)] cursor-pointer hover:bg-[var(--hover-overlay)] active:scale-[0.96] [transition-property:background-color,color,scale] [transition-duration:140ms] [transition-timing-function:cubic-bezier(0.2,0,0,1)]"
          >
            <SwapIcon />
            <span className="font-ibm-plex-sans font-bold text-sm">Swap View</span>
          </button>
        }
      />
      <div className="relative h-[283px] w-full overflow-hidden rounded-[8.48px] img-outline">
        <img
          src="/live-camera.jpeg"
          alt="Live camera feed"
          className="absolute inset-0 w-full h-full object-cover"
        />
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
  return (
    <CardPanel className="absolute top-[110px] right-6 z-20">
      <div
        className="flex flex-col gap-8 w-[416px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ height: 'calc((100vh - 110px) / var(--ui-scale) - 110px)' }}
      >
        <div className="flex flex-col gap-6 w-full shrink-0">
          <div className="flex items-center justify-between w-full">
            <IconButton label="Back to list" onClick={onBack} className="text-white">
              <BackIcon />
            </IconButton>
            <IconButton label="Close camera card" onClick={onClose} className="text-white">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex gap-4 items-center w-full">
            <CameraIllustration />
            <div className="flex flex-1 flex-col gap-3 min-w-0">
              <div className="flex items-center gap-1.5 w-full">
                <h2 className="flex-1 font-ibm-plex-sans font-bold text-[22px] text-white leading-[1.5] truncate">
                  {camera.name}
                </h2>
                <IconButton label="Bookmark camera" className="text-white">
                  <BookmarkIcon />
                </IconButton>
              </div>
              <div className="flex items-center gap-1">
                <Badge label={camera.status} tone={CAMERA_STATUS_TONES[camera.status]} />
                <Badge label={camera.activity} tone={CAMERA_ACTIVITY_TONES[camera.activity]} />
              </div>
            </div>
          </div>
        </div>

        <LiveCamera onSwap={onSwapView} />

        <MissionDetails
          completion={camera.completion}
          onLoad={onLoadMission}
          onPause={onPauseMission}
          onCancel={onCancelMission}
        />

        <section className="flex flex-col gap-3 w-full shrink-0">
          <div className="flex gap-3 items-center w-full">
            <Field label="Camera" value="CS - AS637" variant="roomy" />
            <Field label="Speed" value="Normal" variant="roomy" />
          </div>
          <div className="flex gap-3 items-center w-full">
            <Field label="Target Size" value="84m" variant="roomy" />
            <Field label="Next Run" value="28/01/26, 10:48:02" variant="roomy" />
          </div>
        </section>
      </div>
    </CardPanel>
  );
}
