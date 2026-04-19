import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type UISize = 'small' | 'medium' | 'large';

export const uiSizeToScale: Record<UISize, number> = {
  small: 0.8,
  medium: 1,
  large: 1.15,
};

type UISizeContextValue = {
  size: UISize;
  setSize: (size: UISize) => void;
  scale: number;
};

const UISizeContext = createContext<UISizeContextValue | null>(null);
const STORAGE_KEY = 'albatross:uiSize';

export function UISizeProvider({ children }: { children: ReactNode }) {
  const [size, setSizeState] = useState<UISize>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as UISize | null;
    return stored && stored in uiSizeToScale ? stored : 'medium';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, size);
    document.documentElement.style.setProperty('--ui-scale', String(uiSizeToScale[size]));
  }, [size]);

  return (
    <UISizeContext.Provider value={{ size, setSize: setSizeState, scale: uiSizeToScale[size] }}>
      {children}
    </UISizeContext.Provider>
  );
}

export function useUISize() {
  const ctx = useContext(UISizeContext);
  if (!ctx) throw new Error('useUISize must be used within UISizeProvider');
  return ctx;
}
