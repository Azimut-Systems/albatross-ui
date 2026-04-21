import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { NavContext, type NavItem } from './useNav';

export function NavProvider({ children }: { children: ReactNode }) {
  const [activeNav, setActiveNav] = useState<NavItem>('Map');
  const [targetsOpen, setTargetsOpen] = useState(false);
  const [camerasOpen, setCamerasOpen] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState<string | undefined>(undefined);
  const [activeCameraId, setActiveCameraId] = useState<string | undefined>(undefined);

  const toggleTargets = useCallback(() => setTargetsOpen((v) => !v), []);
  const closeTargets = useCallback(() => {
    setTargetsOpen(false);
    setActiveTargetId(undefined);
  }, []);
  const toggleCameras = useCallback(() => setCamerasOpen((v) => !v), []);
  const closeCameras = useCallback(() => {
    setCamerasOpen(false);
    setActiveCameraId(undefined);
  }, []);

  const value = useMemo(
    () => ({
      activeNav,
      setActiveNav,
      targetsOpen,
      toggleTargets,
      closeTargets,
      camerasOpen,
      toggleCameras,
      closeCameras,
      activeTargetId,
      setActiveTargetId,
      activeCameraId,
      setActiveCameraId,
    }),
    [
      activeNav,
      targetsOpen,
      toggleTargets,
      closeTargets,
      camerasOpen,
      toggleCameras,
      closeCameras,
      activeTargetId,
      activeCameraId,
    ],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
