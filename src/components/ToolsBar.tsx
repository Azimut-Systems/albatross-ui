import GlassPanel from './GlassPanel';
import PinIcon from './icons/PinIcon';
import RulerIcon from './icons/RulerIcon';
import { usePinMode } from '../contexts/usePinMode';
import {
  useMeasureMode,
  type MeasureStatus,
} from '../contexts/useMeasureMode';
import type { PinStatus } from '../contexts/usePinMode';

function LayersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function StatusTooltip() {
  const { status: pinStatus } = usePinMode();
  const { status: measureStatus } = useMeasureMode();
  const status: PinStatus | MeasureStatus = pinStatus ?? measureStatus;
  if (!status) return null;

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap">
      <GlassPanel cornerRadius={8} padding="6px 10px">
        {status.variant === 'keycap' ? (
          <div className="flex items-center gap-1 text-white text-xs font-medium tracking-[0.25px]">
            <span>{status.prefix}</span>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1 rounded-[4px] bg-[rgb(var(--accent-rgb)/0.45)] border border-[rgba(255,255,255,0.15)] text-[11px] font-semibold">
              {status.key}
            </span>
            <span>{status.suffix}</span>
          </div>
        ) : (
          <div className="text-white text-xs font-medium tracking-[0.25px]">
            {status.text}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

function ToolButton({
  label,
  active = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center p-[10px] cursor-pointer active:scale-[0.96] ${
        active
          ? 'bg-[rgb(var(--accent-rgb)/0.55)]'
          : 'hover:bg-[rgb(var(--accent-rgb)/0.2)]'
      }`}
      style={{
        borderRadius: 'var(--glass-inner-radius)',
        transitionProperty: 'background-color, color, scale',
        transitionDuration: '160ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
        ...(active ? {} : { color: 'var(--accent-muted)' }),
      }}
    >
      {children}
    </button>
  );
}

export default function ToolsBar() {
  const { mode: pinMode, togglePinMode, exitPinMode } = usePinMode();
  const {
    mode: measureMode,
    toggleMeasureMode,
    exitMeasureMode,
  } = useMeasureMode();
  const pinActive = pinMode !== 'off';
  const measureActive = measureMode !== 'off';

  const handleMeasureClick = () => {
    if (pinActive) exitPinMode();
    toggleMeasureMode();
  };

  const handlePinClick = () => {
    if (measureActive) exitMeasureMode();
    togglePinMode();
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <StatusTooltip />
      <GlassPanel>
        <div className="flex items-center gap-2">
          <ToolButton
            label="Measure"
            active={measureActive}
            onClick={handleMeasureClick}
          >
            <RulerIcon />
          </ToolButton>
          <ToolButton label="Pin" active={pinActive} onClick={handlePinClick}>
            <PinIcon />
          </ToolButton>
          <ToolButton label="Layers">
            <LayersIcon />
          </ToolButton>
        </div>
      </GlassPanel>
    </div>
  );
}
