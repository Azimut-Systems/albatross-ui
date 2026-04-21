import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  PinModeContext,
  type Pin,
  type PinMode,
  type PinStatus,
} from './usePinMode';

const INITIAL_PINS: Pin[] = [];

const EXIT_STATUS: PinStatus = {
  variant: 'keycap',
  prefix: 'Press ',
  key: 'Esc',
  suffix: ' to exit pin mode',
};

const CANCEL_STATUS: PinStatus = {
  variant: 'keycap',
  prefix: 'Press ',
  key: 'Esc',
  suffix: ' to cancel',
};

const DELETED_STATUS: PinStatus = {
  variant: 'text',
  text: 'Pin has been deleted successfully',
};

export function PinModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PinMode>('off');
  const [pins, setPins] = useState<Pin[]>(INITIAL_PINS);
  const [movingPinId, setMovingPinId] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [status, setStatus] = useState<PinStatus>(null);
  const toastTimer = useRef<number | null>(null);

  const clearToastTimer = () => {
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
  };

  const modeRef = useRef<PinMode>('off');
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const flashStatus = useCallback((next: PinStatus, durationMs = 2200) => {
    clearToastTimer();
    setStatus(next);
    toastTimer.current = window.setTimeout(() => {
      // Restore the mode-appropriate status after the toast.
      const current = modeRef.current;
      setStatus(
        current === 'moving'
          ? CANCEL_STATUS
          : current === 'placing'
            ? EXIT_STATUS
            : null,
      );
      toastTimer.current = null;
    }, durationMs);
  }, []);

  useEffect(() => clearToastTimer, []);

  const exitPinMode = useCallback(() => {
    setMode('off');
    setMovingPinId(null);
    setSelectedPinId(null);
    setStatus(null);
    clearToastTimer();
  }, []);

  const togglePinMode = useCallback(() => {
    setMovingPinId(null);
    setSelectedPinId(null);
    clearToastTimer();
    setMode((prev) => {
      if (prev === 'off') {
        setStatus(EXIT_STATUS);
        return 'placing';
      }
      setStatus(null);
      return 'off';
    });
  }, []);

  const addPin = useCallback((lng: number, lat: number) => {
    setPins((prev) => [
      ...prev,
      { id: `pin-${Date.now()}-${Math.round(Math.random() * 1000)}`, lng, lat },
    ]);
  }, []);

  const startMovePin = useCallback((id: string) => {
    setMovingPinId(id);
    setMode('moving');
    setSelectedPinId(null);
    setStatus(CANCEL_STATUS);
  }, []);

  const commitMovePin = useCallback((lng: number, lat: number) => {
    setPins((prev) =>
      prev.map((p) => (p.id === movingPinId ? { ...p, lng, lat } : p)),
    );
    setMovingPinId(null);
    setMode('placing');
    setStatus(EXIT_STATUS);
  }, [movingPinId]);

  const deletePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    setSelectedPinId(null);
    flashStatus(DELETED_STATUS);
  }, [flashStatus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mode === 'moving') {
        setMovingPinId(null);
        setMode('placing');
        setStatus(EXIT_STATUS);
      } else if (mode === 'placing') {
        exitPinMode();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, exitPinMode]);

  return (
    <PinModeContext.Provider
      value={{
        mode,
        pins,
        movingPinId,
        selectedPinId,
        status,
        togglePinMode,
        exitPinMode,
        setSelectedPin: setSelectedPinId,
        addPin,
        startMovePin,
        commitMovePin,
        deletePin,
      }}
    >
      {children}
    </PinModeContext.Provider>
  );
}
