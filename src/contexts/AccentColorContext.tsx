import { useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_ACCENT } from './accentPresets';
import { AccentColorContext } from './useAccentColor';

const STORAGE_KEY = 'albatross:accentColor';

function hexToRgbTriplet(hex: string): string | null {
  const m = hex.trim().match(/^#?([a-fA-F0-9]{6})$/);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function AccentColorProvider({ children }: { children: ReactNode }) {
  const [hex, setHexState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ACCENT.hex;
  });

  const rgb = hexToRgbTriplet(hex) ?? DEFAULT_ACCENT.rgb;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, hex);
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--accent-rgb', rgb);
  }, [hex, rgb]);

  const setAccent = (next: string) => {
    if (hexToRgbTriplet(next)) setHexState(next);
  };

  return (
    <AccentColorContext.Provider value={{ hex, rgb, setAccent }}>
      {children}
    </AccentColorContext.Provider>
  );
}
