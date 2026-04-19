import GlassPanel from './GlassPanel';
import PinIcon from './icons/PinIcon';
import { usePinMode } from '../contexts/PinModeContext';

function PencilIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function StatusTooltip() {
  const { status } = usePinMode();
  if (!status) return null;

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap">
      <GlassPanel cornerRadius={8} padding="6px 10px">
        {status.variant === 'keycap' ? (
          <div className="flex items-center gap-1 text-white text-xs font-medium tracking-[0.25px]">
            <span>{status.prefix}</span>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1 rounded-[4px] bg-[rgba(105,49,245,0.45)] border border-[rgba(255,255,255,0.15)] text-[11px] font-semibold">
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

export default function ToolsBar() {
  const { mode, togglePinMode } = usePinMode();
  const pinActive = mode !== 'off';

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <StatusTooltip />
      <GlassPanel>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Draw"
            className="flex items-center p-[10px] rounded-lg cursor-pointer hover:bg-[rgba(122,86,246,0.2)] transition-colors"
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            aria-label="Pin"
            aria-pressed={pinActive}
            onClick={togglePinMode}
            className={`flex items-center p-[10px] rounded-lg cursor-pointer transition-colors ${
              pinActive
                ? 'bg-[rgba(105,49,245,0.55)]'
                : 'hover:bg-[rgba(122,86,246,0.2)]'
            }`}
          >
            <PinIcon />
          </button>
          <button
            type="button"
            aria-label="Layers"
            className="flex items-center p-[10px] rounded-lg cursor-pointer hover:bg-[rgba(122,86,246,0.2)] transition-colors"
          >
            <LayersIcon />
          </button>
        </div>
      </GlassPanel>
    </div>
  );
}
