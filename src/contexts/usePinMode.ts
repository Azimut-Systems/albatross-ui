import { createContext, useContext } from 'react';

export type PinMode = 'off' | 'placing' | 'moving';

export type Pin = {
  id: string;
  lng: number;
  lat: number;
};

export type PinStatus =
  | { variant: 'keycap'; prefix: string; key: string; suffix: string }
  | { variant: 'text'; text: string }
  | null;

type PinModeContextValue = {
  mode: PinMode;
  pins: Pin[];
  movingPinId: string | null;
  selectedPinId: string | null;
  status: PinStatus;
  togglePinMode: () => void;
  exitPinMode: () => void;
  setSelectedPin: (id: string | null) => void;
  addPin: (lng: number, lat: number) => void;
  startMovePin: (id: string) => void;
  commitMovePin: (lng: number, lat: number) => void;
  deletePin: (id: string) => void;
};

export const PinModeContext = createContext<PinModeContextValue | null>(null);

export function usePinMode() {
  const ctx = useContext(PinModeContext);
  if (!ctx) throw new Error('usePinMode must be used within PinModeProvider');
  return ctx;
}
