import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './useTheme';

const STORAGE_KEY = 'albatross:theme';
const DEFAULT_THEME: Theme = 'dark';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : DEFAULT_THEME;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}
