import { useEffect, useRef } from 'react';
import GlassPanel from './GlassPanel';
import { useUISize, type UISize } from '../contexts/UISizeContext';
import { useAccentColor, accentPresets } from '../contexts/AccentColorContext';

const sizeOptions: { label: string; value: UISize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

export default function SettingsPanel({ onClose }: { onClose?: () => void }) {
  const { size, setSize } = useUISize();
  const { hex, setAccent } = useAccentColor();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onClose]);

  return (
    <div ref={panelRef} className="absolute top-[110px] left-1/2 -translate-x-1/2 z-30">
      <GlassPanel padding="16px">
        <div className="flex flex-col gap-4 min-w-[300px]">
          <div className="flex flex-col gap-3">
            <span className="font-ibm-plex-sans font-bold text-white text-sm tracking-[0.25px]">
              UI Size
            </span>
            <div className="flex items-center gap-2">
              {sizeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSize(opt.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm tracking-[0.25px] transition-all cursor-pointer font-ibm-plex-sans ${
                    size === opt.value
                      ? 'text-white font-bold'
                      : 'text-[#dee3e7] font-medium hover:text-white'
                  }`}
                  style={
                    size === opt.value
                      ? {
                          backgroundImage:
                            'linear-gradient(90deg, rgb(var(--accent-rgb) / 0.35) 0%, rgb(var(--accent-rgb) / 0.35) 100%), linear-gradient(107deg, rgba(56,78,231,0.15) 5.66%, rgba(30,191,245,0.15) 98.96%)',
                        }
                      : undefined
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-ibm-plex-sans font-bold text-white text-sm tracking-[0.25px]">
              Accent Color
            </span>
            <div className="grid grid-cols-3 gap-2">
              {accentPresets.map((opt) => {
                const active = hex.toLowerCase() === opt.hex.toLowerCase();
                return (
                  <button
                    key={opt.hex}
                    onClick={() => setAccent(opt.hex)}
                    className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs tracking-[0.25px] transition-all cursor-pointer font-ibm-plex-sans border ${
                      active
                        ? 'text-white font-bold border-white/60'
                        : 'text-[#dee3e7] font-medium border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                      style={{ background: opt.hex }}
                    />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <label className="flex items-center gap-2 text-xs text-[#dee3e7] font-ibm-plex-sans">
              <span>Custom</span>
              <input
                type="color"
                value={hex}
                onChange={(e) => setAccent(e.target.value)}
                className="h-7 w-10 bg-transparent border border-white/10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setAccent(e.target.value)}
                className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs font-mono outline-none focus:border-white/30"
              />
            </label>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
