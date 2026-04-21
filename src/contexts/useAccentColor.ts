import { createContext, useContext } from 'react';

type AccentColorContextValue = {
  hex: string;
  rgb: string;
  setAccent: (hex: string) => void;
};

export const AccentColorContext = createContext<AccentColorContextValue | null>(null);

export function useAccentColor() {
  const ctx = useContext(AccentColorContext);
  if (!ctx) throw new Error('useAccentColor must be used within AccentColorProvider');
  return ctx;
}
