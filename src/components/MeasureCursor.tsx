import { useEffect, useState } from 'react';
import { useMeasureMode } from '../contexts/MeasureModeContext';

export default function MeasureCursor() {
  const { mode } = useMeasureMode();
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

  // Pointing-hand cursor. The tip (fingertip) sits at svg coords (9, 2) within the 24×24
  // box; offset positions so that point lands exactly on the mouse coordinate.
  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{ left: pos.x - 9, top: pos.y - 2 }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 2V13M9 13V8C9 7.17 8.33 6.5 7.5 6.5C6.67 6.5 6 7.17 6 8V15M9 13C9 12.17 9.67 11.5 10.5 11.5C11.33 11.5 12 12.17 12 13V15M12 13C12 12.17 12.67 11.5 13.5 11.5C14.33 11.5 15 12.17 15 13V15.5M15 14C15 13.17 15.67 12.5 16.5 12.5C17.33 12.5 18 13.17 18 14V19C18 20.66 16.66 22 15 22H10.5C9.3 22 8.22 21.29 7.75 20.19L5.5 15.5C5.17 14.79 5.5 13.95 6.22 13.62C6.9 13.31 7.7 13.56 8.1 14.2L9 15.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(0,0,0,0.25)"
        />
      </svg>
    </div>
  );
}
