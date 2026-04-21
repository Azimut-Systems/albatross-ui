import { useEffect, useState } from 'react';
import { usePinMode } from '../contexts/usePinMode';
import PinIcon from './icons/PinIcon';

export default function PinCursor() {
  const { mode } = usePinMode();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (mode === 'off') {
      document.body.style.cursor = '';
      return;
    }
    document.body.style.cursor = 'none';
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.body.style.cursor = '';
    };
  }, [mode]);

  if (mode === 'off' || !pos) return null;

  // Offset so the pin tip (svg coords 2,22 in a 24×24 box at size 22) aligns with the click point.
  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: pos.x - 2,
        top: pos.y - 20,
      }}
    >
      <PinIcon size={22} color="white" strokeWidth={1.6} />
    </div>
  );
}
