import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type MeasureMode = 'off' | 'awaiting-start' | 'awaiting-end';

export type LngLat = { lng: number; lat: number };

export type Measurement = {
  id: string;
  start: LngLat;
  end: LngLat;
};

export type MeasureStatus =
  | { variant: 'keycap'; prefix: string; key: string; suffix: string }
  | { variant: 'text'; text: string }
  | null;

const EXIT_STATUS: MeasureStatus = {
  variant: 'keycap',
  prefix: 'Press ',
  key: 'Esc',
  suffix: ' to exit measurement mode',
};

const DELETED_STATUS: MeasureStatus = {
  variant: 'text',
  text: 'Measurement has been deleted successfully',
};

type MeasureModeContextValue = {
  mode: MeasureMode;
  measurements: Measurement[];
  pendingStart: LngLat | null;
  selectedMeasurementId: string | null;
  status: MeasureStatus;
  toggleMeasureMode: () => void;
  exitMeasureMode: () => void;
  setSelectedMeasurement: (id: string | null) => void;
  placePoint: (lng: number, lat: number) => void;
  deleteMeasurement: (id: string) => void;
};

const MeasureModeContext = createContext<MeasureModeContextValue | null>(null);

export function MeasureModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<MeasureMode>('off');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [pendingStart, setPendingStart] = useState<LngLat | null>(null);
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<
    string | null
  >(null);
  const [status, setStatus] = useState<MeasureStatus>(null);
  const toastTimer = useRef<number | null>(null);

  const clearToastTimer = () => {
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
  };

  const modeRef = useRef<MeasureMode>('off');
  modeRef.current = mode;

  const flashStatus = useCallback((next: MeasureStatus, durationMs = 2200) => {
    clearToastTimer();
    setStatus(next);
    toastTimer.current = window.setTimeout(() => {
      const current = modeRef.current;
      setStatus(current === 'off' ? null : EXIT_STATUS);
      toastTimer.current = null;
    }, durationMs);
  }, []);

  useEffect(() => clearToastTimer, []);

  const exitMeasureMode = useCallback(() => {
    setMode('off');
    setPendingStart(null);
    setSelectedMeasurementId(null);
    setMeasurements([]);
    setStatus(null);
    clearToastTimer();
  }, []);

  const toggleMeasureMode = useCallback(() => {
    setPendingStart(null);
    setSelectedMeasurementId(null);
    clearToastTimer();
    setMode((prev) => {
      if (prev === 'off') {
        setStatus(EXIT_STATUS);
        return 'awaiting-start';
      }
      // Exiting — discard any placed measurements.
      setMeasurements([]);
      setStatus(null);
      return 'off';
    });
  }, []);

  const placePoint = useCallback((lng: number, lat: number) => {
    setMode((prev) => {
      if (prev === 'awaiting-start') {
        setPendingStart({ lng, lat });
        return 'awaiting-end';
      }
      if (prev === 'awaiting-end') {
        setPendingStart((start) => {
          if (start) {
            setMeasurements((ms) => [
              ...ms,
              {
                id: `msr-${Date.now()}-${Math.round(Math.random() * 1000)}`,
                start,
                end: { lng, lat },
              },
            ]);
          }
          return null;
        });
        return 'awaiting-start';
      }
      return prev;
    });
  }, []);

  const deleteMeasurement = useCallback(
    (id: string) => {
      setMeasurements((prev) => prev.filter((m) => m.id !== id));
      setSelectedMeasurementId(null);
      flashStatus(DELETED_STATUS);
    },
    [flashStatus],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mode === 'awaiting-end') {
        setPendingStart(null);
        setMode('awaiting-start');
        setStatus(EXIT_STATUS);
      } else if (mode === 'awaiting-start') {
        exitMeasureMode();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, exitMeasureMode]);

  return (
    <MeasureModeContext.Provider
      value={{
        mode,
        measurements,
        pendingStart,
        selectedMeasurementId,
        status,
        toggleMeasureMode,
        exitMeasureMode,
        setSelectedMeasurement: setSelectedMeasurementId,
        placePoint,
        deleteMeasurement,
      }}
    >
      {children}
    </MeasureModeContext.Provider>
  );
}

export function useMeasureMode() {
  const ctx = useContext(MeasureModeContext);
  if (!ctx)
    throw new Error('useMeasureMode must be used within MeasureModeProvider');
  return ctx;
}
