import { useEffect, useState } from 'react';
import { usePinMode } from '../contexts/PinModeContext';
import PinIcon from './icons/PinIcon';

export default function PinCursor() {
  const { mode } = usePinMode();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (mode === 'off') {
      setPos(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mode]);

  if (mode === 'off' || !pos) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: pos.x + 14,
        top: pos.y - 20,
      }}
    >
      <PinIcon size={22} color="white" strokeWidth={1.6} />
    </div>
  );
}
