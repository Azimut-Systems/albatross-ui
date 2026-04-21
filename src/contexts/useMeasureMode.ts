import { createContext, useContext } from 'react';

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

export const MeasureModeContext = createContext<MeasureModeContextValue | null>(null);

export function useMeasureMode() {
  const ctx = useContext(MeasureModeContext);
  if (!ctx)
    throw new Error('useMeasureMode must be used within MeasureModeProvider');
  return ctx;
}
