import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AccentPreset = { label: string; hex: string; rgb: string };

export const accentPresets: AccentPreset[] = [
  { label: 'Purple', hex: '#6931F5', rgb: '105 49 245' },
  { label: 'Blue', hex: '#2563EB', rgb: '37 99 235' },
  { label: 'Cyan', hex: '#06B6D4', rgb: '6 182 212' },
  { label: 'Teal', hex: '#14B8A6', rgb: '20 184 166' },
  { label: 'Green', hex: '#10B981', rgb: '16 185 129' },
  { label: 'Amber', hex: '#F59E0B', rgb: '245 158 11' },
  { label: 'Orange', hex: '#F97316', rgb: '249 115 22' },
  { label: 'Red', hex: '#EF4444', rgb: '239 68 68' },
  { label: 'Pink', hex: '#EC4899', rgb: '236 72 153' },
];

export const DEFAULT_ACCENT = accentPresets[0];

type AccentColorContextValue = {
  hex: string;
  rgb: string;
  setAccent: (hex: string) => void;
};

const AccentColorContext = createContext<AccentColorContextValue | null>(null);
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

export function useAccentColor() {
  const ctx = useContext(AccentColorContext);
  if (!ctx) throw new Error('useAccentColor must be used within AccentColorProvider');
  return ctx;
}
