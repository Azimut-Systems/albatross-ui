import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  MeasureModeContext,
  type LngLat,
  type MeasureMode,
  type MeasureStatus,
  type Measurement,
} from './useMeasureMode';

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
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

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
