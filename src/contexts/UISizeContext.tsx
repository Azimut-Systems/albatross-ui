import { useEffect, useState, type ReactNode } from 'react';
import { UISizeContext, type UISize } from './useUISize';
import { uiSizeToScale } from './uiSizeToScale';

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
