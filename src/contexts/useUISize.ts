import { createContext, useContext } from 'react';

export type UISize = 'small' | 'medium' | 'large';

type UISizeContextValue = {
  size: UISize;
  setSize: (size: UISize) => void;
  scale: number;
};

export const UISizeContext = createContext<UISizeContextValue | null>(null);

export function useUISize() {
  const ctx = useContext(UISizeContext);
  if (!ctx) throw new Error('useUISize must be used within UISizeProvider');
  return ctx;
}
