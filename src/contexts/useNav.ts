import { createContext, useContext } from 'react';

export type NavItem = 'Map' | 'Archive' | 'Fleet' | 'Settings';

export type NavContextValue = {
  activeNav: NavItem;
  setActiveNav: (item: NavItem) => void;

  targetsOpen: boolean;
  toggleTargets: () => void;
  closeTargets: () => void;

  camerasOpen: boolean;
  toggleCameras: () => void;
  closeCameras: () => void;

  activeTargetId: string | undefined;
  setActiveTargetId: (id: string | undefined) => void;

  activeCameraId: string | undefined;
  setActiveCameraId: (id: string | undefined) => void;
};

export const NavContext = createContext<NavContextValue | null>(null);

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
