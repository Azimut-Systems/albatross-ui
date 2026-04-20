import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import GlassPanel from './GlassPanel';
import PinContextMenu from './PinContextMenu';
import PinIcon from './icons/PinIcon';
import TargetContextMenu, {
  type TargetContextMenuAction,
} from './TargetContextMenu';
import TargetHoverCard, { type TargetHoverCardData } from './TargetHoverCard';
import { useUISize } from '../contexts/UISizeContext';
import { usePinMode } from '../contexts/PinModeContext';
import { useMeasureMode, type LngLat } from '../contexts/MeasureModeContext';

function haversineMeters(a: LngLat, b: LngLat): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function bearingDegrees(a: LngLat, b: LngLat): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δλ = toRad(b.lng - a.lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function formatMeasurement(a: LngLat, b: LngLat): string {
  const meters = haversineMeters(a, b);
  const bearing = bearingDegrees(a, b);
  const distanceLabel =
    meters >= 1000
      ? `${(meters / 1000).toFixed(1)} km`
      : `${meters.toFixed(1)} m`;
  return `${distanceLabel}, ${bearing.toFixed(1)}°`;
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

type VesselColor = 'blue' | 'red' | 'orange' | 'yellow';

interface Vessel {
  id: string;
  lng: number;
  lat: number;
  color: VesselColor;
  heading: number;
  name: string;
  externalId: string;
  thumbnailUrl?: string;
}

const vesselStyles: Record<VesselColor, { bg: string; border: string; dot: string }> = {
  blue: {
    bg: 'rgba(66,106,239,0.35)',
    border: '#426aef',
    dot: '#426aef',
  },
  red: {
    bg: 'rgba(255,54,70,0.35)',
    border: '#ef1e3d',
    dot: '#ef1e3d',
  },
  orange: {
    bg: 'rgba(254,113,12,0.35)',
    border: '#fe710c',
    dot: '#fe710c',
  },
  yellow: {
    bg: 'rgba(254,189,12,0.35)',
    border: '#febd0c',
    dot: '#febd0c',
  },
};

interface CameraPlacement {
  id: string;
  lng: number;
  lat: number;
}

const mockCameras: CameraPlacement[] = [
  // Ashdod (Israel)
  { id: 'c1', lng: 34.632, lat: 31.826 },
  { id: 'c2', lng: 34.648, lat: 31.819 },
  { id: 'c3', lng: 34.646, lat: 31.823 },
  // Bosphorus (Istanbul, TR)
  { id: 'c-bos-1', lng: 29.0574, lat: 41.0857 },
  { id: 'c-bos-2', lng: 29.0144, lat: 41.0253 },
  { id: 'c-bos-3', lng: 29.0925, lat: 41.1381 },
  // Strait of Gibraltar
  { id: 'c-gib-1', lng: -5.3442, lat: 36.1112 },
  { id: 'c-gib-2', lng: -5.4453, lat: 36.1239 },
  { id: 'c-gib-3', lng: -5.7283, lat: 36.0589 },
  // Panama Canal
  { id: 'c-pan-1', lng: -79.9211, lat: 9.2718 },
  { id: 'c-pan-2', lng: -79.5906, lat: 8.9936 },
  { id: 'c-pan-3', lng: -79.9089, lat: 9.3492 },
  // Suez Canal
  { id: 'c-suez-1', lng: 32.3019, lat: 31.2653 },
  { id: 'c-suez-2', lng: 32.2719, lat: 30.5965 },
  { id: 'c-suez-3', lng: 32.5469, lat: 29.9668 },
  // Strait of Malacca / Singapore
  { id: 'c-mal-1', lng: 103.8547, lat: 1.2364 },
  { id: 'c-mal-2', lng: 103.7436, lat: 1.4456 },
  { id: 'c-mal-3', lng: 102.2501, lat: 2.1896 },
  // Bab-el-Mandeb
  { id: 'c-bab-1', lng: 43.4172, lat: 12.6392 },
  { id: 'c-bab-2', lng: 44.9856, lat: 12.7856 },
  { id: 'c-bab-3', lng: 43.1403, lat: 11.5883 },
  // Strait of Hormuz
  { id: 'c-hor-1', lng: 56.2489, lat: 26.1833 },
  { id: 'c-hor-2', lng: 56.2897, lat: 27.1833 },
  { id: 'c-hor-3', lng: 55.9434, lat: 25.79 },
  // Dover Strait / English Channel
  { id: 'c-dov-1', lng: 1.3125, lat: 51.1279 },
  { id: 'c-dov-2', lng: 1.8542, lat: 50.9513 },
  { id: 'c-dov-3', lng: 0.9575, lat: 50.9139 },
];

const mockVessels: Vessel[] = [
  // Ashdod (Israel)
  { id: 'v1', lng: 34.6385, lat: 31.8305, color: 'red', heading: 45, name: 'Gustav Masrek 234', externalId: 'D983GH22', thumbnailUrl: '/target-ship.png' },
  { id: 'v2', lng: 34.6520, lat: 31.8270, color: 'red', heading: 120, name: 'Maria Lopez 118', externalId: 'M118LP42', thumbnailUrl: '/target-ship.png' },
  { id: 'v3', lng: 34.6410, lat: 31.8340, color: 'orange', heading: 200, name: 'Orion Tanker 77', externalId: 'O77TNK19', thumbnailUrl: '/target-ship.png' },
  { id: 'v4', lng: 34.6470, lat: 31.8220, color: 'orange', heading: 310, name: 'Kestrel 302', externalId: 'K302BL88', thumbnailUrl: '/target-ship.png' },
  { id: 'v5', lng: 34.6350, lat: 31.8260, color: 'blue', heading: 170, name: 'Nautilus 19', externalId: 'N19SUB07', thumbnailUrl: '/target-ship.png' },
  { id: 'v6', lng: 34.6490, lat: 31.8290, color: 'blue', heading: 90, name: 'Polaris Cargo', externalId: 'P042CG55', thumbnailUrl: '/target-ship.png' },
  { id: 'v7', lng: 34.6530, lat: 31.8250, color: 'blue', heading: 260, name: 'Aegean Star', externalId: 'A812ST31', thumbnailUrl: '/target-ship.png' },
  { id: 'v8', lng: 34.6440, lat: 31.8200, color: 'yellow', heading: 30, name: 'Helios 44', externalId: 'H044HL92', thumbnailUrl: '/target-ship.png' },
  { id: 'v9', lng: 34.6380, lat: 31.8235, color: 'yellow', heading: 150, name: 'Sirocco 8', externalId: 'S008SC61', thumbnailUrl: '/target-ship.png' },
  { id: 'v10', lng: 34.6500, lat: 31.8210, color: 'yellow', heading: 280, name: 'Zephyr 221', externalId: 'Z221ZP04', thumbnailUrl: '/target-ship.png' },
  // Bosphorus (N-S strait, ~0°/180° headings)
  { id: 'v-bos-1', lng: 29.0445, lat: 41.0793, color: 'red', heading: 182, name: 'Karadeniz 417', externalId: 'KD417BZ', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bos-2', lng: 29.0458, lat: 41.0801, color: 'blue', heading: 200, name: 'Marmara Star', externalId: 'MR088ST', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bos-3', lng: 29.0471, lat: 41.0788, color: 'orange', heading: 5, name: 'Anatolia 52', externalId: 'AN052TR', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bos-4', lng: 29.0312, lat: 41.0451, color: 'yellow', heading: 170, name: 'Izmir Pride', externalId: 'IZ512PR', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bos-5', lng: 29.0816, lat: 41.1207, color: 'blue', heading: 355, name: 'Bosphorus Link', externalId: 'BS779LK', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bos-6', lng: 29.0233, lat: 41.0335, color: 'red', heading: 185, name: 'Galata Trader', externalId: 'GT212GL', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bos-7', lng: 29.0947, lat: 41.1365, color: 'orange', heading: 8, name: 'Ussuri 9', externalId: 'USK009DR', thumbnailUrl: '/target-ship.png' },
  // Strait of Gibraltar (E-W strait, ~90°/270° headings)
  { id: 'v-gib-1', lng: -5.4095, lat: 35.9702, color: 'blue', heading: 92, name: 'Algeciras 77', externalId: 'AL077CG', thumbnailUrl: '/target-ship.png' },
  { id: 'v-gib-2', lng: -5.4108, lat: 35.9718, color: 'orange', heading: 275, name: 'Tarifa Voyager', externalId: 'TR641VY', thumbnailUrl: '/target-ship.png' },
  { id: 'v-gib-3', lng: -5.4121, lat: 35.9695, color: 'yellow', heading: 95, name: 'Ceuta Moon', externalId: 'CE248MN', thumbnailUrl: '/target-ship.png' },
  { id: 'v-gib-4', lng: -5.5932, lat: 35.9128, color: 'red', heading: 280, name: 'Atlantic Runner', externalId: 'AT903RN', thumbnailUrl: '/target-ship.png' },
  { id: 'v-gib-5', lng: -5.3205, lat: 36.0518, color: 'blue', heading: 85, name: 'Pillars of Hercules', externalId: 'PL311AH', thumbnailUrl: '/target-ship.png' },
  { id: 'v-gib-6', lng: -5.6784, lat: 35.9861, color: 'orange', heading: 270, name: 'Rock Trader', externalId: 'RK552TR', thumbnailUrl: '/target-ship.png' },
  // Panama Canal
  { id: 'v-pan-1', lng: -79.9198, lat: 9.2655, color: 'blue', heading: 160, name: 'Balboa Carrier', externalId: 'BL101CR', thumbnailUrl: '/target-ship.png' },
  { id: 'v-pan-2', lng: -79.9185, lat: 9.2641, color: 'red', heading: 340, name: 'Colón Bay 21', externalId: 'CB021BY', thumbnailUrl: '/target-ship.png' },
  { id: 'v-pan-3', lng: -79.9173, lat: 9.2629, color: 'orange', heading: 175, name: 'Panamax 7', externalId: 'PX007MX', thumbnailUrl: '/target-ship.png' },
  { id: 'v-pan-4', lng: -79.8991, lat: 9.3412, color: 'yellow', heading: 350, name: 'Gatun Star', externalId: 'GT778ST', thumbnailUrl: '/target-ship.png' },
  { id: 'v-pan-5', lng: -79.5844, lat: 8.9884, color: 'blue', heading: 170, name: 'Miraflores Light', externalId: 'MF134LT', thumbnailUrl: '/target-ship.png' },
  { id: 'v-pan-6', lng: -79.9042, lat: 9.3588, color: 'red', heading: 345, name: 'Cristóbal 3', externalId: 'CR003OB', thumbnailUrl: '/target-ship.png' },
  // Suez Canal (N-S, ~0°/180°)
  { id: 'v-suez-1', lng: 32.3157, lat: 31.2418, color: 'blue', heading: 180, name: 'Port Said Light', externalId: 'PS412LT', thumbnailUrl: '/target-ship.png' },
  { id: 'v-suez-2', lng: 32.2815, lat: 30.6127, color: 'orange', heading: 175, name: 'Ismailia Transit', externalId: 'IS099TR', thumbnailUrl: '/target-ship.png' },
  { id: 'v-suez-3', lng: 32.5501, lat: 29.9715, color: 'red', heading: 2, name: 'Suez Sentinel', externalId: 'SZ321SN', thumbnailUrl: '/target-ship.png' },
  { id: 'v-suez-4', lng: 32.5493, lat: 29.9822, color: 'yellow', heading: 8, name: 'Red Sea Clipper', externalId: 'RS678CL', thumbnailUrl: '/target-ship.png' },
  { id: 'v-suez-5', lng: 32.3641, lat: 30.3432, color: 'blue', heading: 180, name: 'Great Bitter 12', externalId: 'GB012BT', thumbnailUrl: '/target-ship.png' },
  { id: 'v-suez-6', lng: 32.3655, lat: 30.3445, color: 'orange', heading: 0, name: 'Canal Drifter', externalId: 'CD455DR', thumbnailUrl: '/target-ship.png' },
  { id: 'v-suez-7', lng: 32.3628, lat: 30.3418, color: 'red', heading: 185, name: 'Pyramids Dawn', externalId: 'PY719DW', thumbnailUrl: '/target-ship.png' },
  // Strait of Malacca / Singapore
  { id: 'v-mal-1', lng: 103.8512, lat: 1.2298, color: 'orange', heading: 125, name: 'Straits Tiger 8', externalId: 'ST008TG', thumbnailUrl: '/target-ship.png' },
  { id: 'v-mal-2', lng: 103.8527, lat: 1.2312, color: 'red', heading: 305, name: 'Singapore Drift', externalId: 'SG244DF', thumbnailUrl: '/target-ship.png' },
  { id: 'v-mal-3', lng: 103.8495, lat: 1.2276, color: 'blue', heading: 130, name: 'Johor Wave', externalId: 'JH567WV', thumbnailUrl: '/target-ship.png' },
  { id: 'v-mal-4', lng: 102.2418, lat: 2.1743, color: 'yellow', heading: 310, name: 'Malacca Rose', externalId: 'ML822RS', thumbnailUrl: '/target-ship.png' },
  { id: 'v-mal-5', lng: 100.3182, lat: 5.3917, color: 'blue', heading: 140, name: 'Penang Run', externalId: 'PN091RN', thumbnailUrl: '/target-ship.png' },
  { id: 'v-mal-6', lng: 103.7268, lat: 1.1632, color: 'red', heading: 300, name: 'South Sentinel', externalId: 'SS356SN', thumbnailUrl: '/target-ship.png' },
  { id: 'v-mal-7', lng: 101.3902, lat: 3.0044, color: 'orange', heading: 135, name: 'Kuala Breeze', externalId: 'KL114BR', thumbnailUrl: '/target-ship.png' },
  // Bab-el-Mandeb
  { id: 'v-bab-1', lng: 43.3587, lat: 12.5743, color: 'red', heading: 15, name: 'Aden Runner', externalId: 'AD612RN', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bab-2', lng: 43.3604, lat: 12.5759, color: 'orange', heading: 195, name: 'Perim Wind', externalId: 'PR887WD', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bab-3', lng: 43.3572, lat: 12.5728, color: 'yellow', heading: 25, name: 'Horn Horizon', externalId: 'HN202HZ', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bab-4', lng: 43.2145, lat: 12.1258, color: 'blue', heading: 200, name: 'Mocha 44', externalId: 'MC044HA', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bab-5', lng: 43.1498, lat: 11.6012, color: 'red', heading: 10, name: 'Djibouti Star', externalId: 'DJ551ST', thumbnailUrl: '/target-ship.png' },
  { id: 'v-bab-6', lng: 44.2317, lat: 12.8104, color: 'orange', heading: 190, name: 'Socotra Shadow', externalId: 'SC163SD', thumbnailUrl: '/target-ship.png' },
  // Strait of Hormuz
  { id: 'v-hor-1', lng: 56.2643, lat: 26.5812, color: 'red', heading: 300, name: 'Gulf Sentinel', externalId: 'GS904SN', thumbnailUrl: '/target-ship.png' },
  { id: 'v-hor-2', lng: 56.2659, lat: 26.5825, color: 'blue', heading: 120, name: 'Musandam Arc', externalId: 'MS088AR', thumbnailUrl: '/target-ship.png' },
  { id: 'v-hor-3', lng: 56.2628, lat: 26.5797, color: 'orange', heading: 295, name: 'Hormuz Tanker 12', externalId: 'HZ012TK', thumbnailUrl: '/target-ship.png' },
  { id: 'v-hor-4', lng: 55.9724, lat: 26.2518, color: 'yellow', heading: 130, name: 'Persian Pearl', externalId: 'PP451PL', thumbnailUrl: '/target-ship.png' },
  { id: 'v-hor-5', lng: 55.7856, lat: 26.7443, color: 'red', heading: 310, name: 'Qeshm Rider', externalId: 'QS237RD', thumbnailUrl: '/target-ship.png' },
  { id: 'v-hor-6', lng: 55.0328, lat: 25.2169, color: 'blue', heading: 125, name: 'Abu Musa Dawn', externalId: 'AM672DW', thumbnailUrl: '/target-ship.png' },
  { id: 'v-hor-7', lng: 56.4012, lat: 26.3841, color: 'orange', heading: 305, name: 'Strait Shepherd', externalId: 'SS893SP', thumbnailUrl: '/target-ship.png' },
  // Dover Strait / English Channel (SW-NE, ~60°/240°)
  { id: 'v-dov-1', lng: 1.4218, lat: 51.0317, color: 'blue', heading: 62, name: 'Channel Fox', externalId: 'CF433FX', thumbnailUrl: '/target-ship.png' },
  { id: 'v-dov-2', lng: 1.4234, lat: 51.0329, color: 'orange', heading: 240, name: 'Calais Link', externalId: 'CL782LK', thumbnailUrl: '/target-ship.png' },
  { id: 'v-dov-3', lng: 1.4203, lat: 51.0305, color: 'red', heading: 65, name: 'White Cliffs 3', externalId: 'WC003CL', thumbnailUrl: '/target-ship.png' },
  { id: 'v-dov-4', lng: 1.5976, lat: 50.9784, color: 'yellow', heading: 245, name: 'Kent Navigator', externalId: 'KN521NV', thumbnailUrl: '/target-ship.png' },
  { id: 'v-dov-5', lng: 1.2541, lat: 51.0912, color: 'blue', heading: 55, name: 'Strait Rider', externalId: 'SR864RD', thumbnailUrl: '/target-ship.png' },
  { id: 'v-dov-6', lng: 1.7325, lat: 50.9356, color: 'red', heading: 70, name: 'North Sea Pilot', externalId: 'NS298PL', thumbnailUrl: '/target-ship.png' },
];

function VesselMarker({
  vessel,
  onClick,
  onContextMenu,
}: {
  vessel: Vessel;
  onClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const style = vesselStyles[vessel.color];
  const rad = (vessel.heading - 90) * (Math.PI / 180);
  const dist = 19;
  const ax = Math.cos(rad) * dist;
  const ay = Math.sin(rad) * dist;
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        position: 'relative',
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: style.bg,
        border: `1px solid ${style.border}`,
        backdropFilter: 'blur(0.655px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 13.5,
          height: 13.5,
          borderRadius: '50%',
          background: style.dot,
          border: '2px solid white',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          left: `calc(50% + ${ax}px - 6px)`,
          top: `calc(50% + ${ay}px - 6px)`,
          transform: `rotate(${vessel.heading}deg)`,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 0L10 8L6 6L2 8L6 0Z" fill={style.border} />
        </svg>
      </div>
    </div>
  );
}

function VesselClusterMarker({
  count,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  count: number;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      <GlassPanel cornerRadius={31} padding="12px">
        <div
          className="flex items-center justify-center w-[36px] h-[36px]"
          style={{
            color: 'white',
            fontSize: count >= 10 ? 18 : 20,
            fontWeight: 600,
            letterSpacing: '0.3px',
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 1px 2px rgba(0,0,0,0.45)',
          }}
        >
          {count}
        </div>
      </GlassPanel>
    </div>
  );
}

type VesselClusterItem =
  | { kind: 'single'; id: string; x: number; y: number; vessel: Vessel }
  | {
      kind: 'cluster';
      id: string;
      x: number;
      y: number;
      lng: number;
      lat: number;
      vessels: Vessel[];
    };

function clusterVessels(
  vessels: Vessel[],
  positions: Record<string, { x: number; y: number }>,
  radiusPx: number,
): VesselClusterItem[] {
  const r2 = radiusPx * radiusPx;
  const used = new Set<string>();
  const out: VesselClusterItem[] = [];
  for (const v of vessels) {
    if (used.has(v.id)) continue;
    const p = positions[v.id];
    if (!p) continue;
    const group: Vessel[] = [v];
    used.add(v.id);
    for (const other of vessels) {
      if (used.has(other.id)) continue;
      const po = positions[other.id];
      if (!po) continue;
      const dx = po.x - p.x;
      const dy = po.y - p.y;
      if (dx * dx + dy * dy < r2) {
        group.push(other);
        used.add(other.id);
      }
    }
    if (group.length === 1) {
      out.push({ kind: 'single', id: v.id, x: p.x, y: p.y, vessel: v });
    } else {
      const cx =
        group.reduce((a, g) => a + positions[g.id].x, 0) / group.length;
      const cy =
        group.reduce((a, g) => a + positions[g.id].y, 0) / group.length;
      const clng =
        group.reduce((a, g) => a + g.lng, 0) / group.length;
      const clat =
        group.reduce((a, g) => a + g.lat, 0) / group.length;
      out.push({
        kind: 'cluster',
        id: `cluster-${group.map((g) => g.id).join('-')}`,
        x: cx,
        y: cy,
        lng: clng,
        lat: clat,
        vessels: group,
      });
    }
  }
  return out;
}

function CameraMarker() {
  return (
    <GlassPanel cornerRadius={31} padding="12px">
      <div className="flex items-center justify-center w-[36px] h-[36px]">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="8" width="22" height="18" rx="3" stroke="var(--accent-muted)" strokeWidth="2" fill="none" />
          <path d="M24 14L32 10V26L24 22" stroke="var(--accent-muted)" strokeWidth="2" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </GlassPanel>
  );
}

type MapPinProps = {
  dimmed: boolean;
  showHint: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
};

function MapPin({
  dimmed,
  showHint,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: MapPinProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <GlassPanel
        cornerRadius={31}
        padding="12px"
        style={{
          cursor: 'pointer',
          opacity: dimmed ? 0.35 : 1,
          transition: 'opacity 120ms ease',
        }}
      >
        <div className="flex items-center justify-center w-[36px] h-[36px]">
          <PinIcon size={24} color="white" strokeWidth={1.6} />
        </div>
      </GlassPanel>
      {showHint && (
        <div className="absolute -top-1 -right-3 pointer-events-none">
          <PinIcon size={20} color="rgba(255,255,255,0.85)" strokeWidth={1.6} />
        </div>
      )}
    </div>
  );
}

type HoverState = {
  vesselId: string;
  target: TargetHoverCardData;
  lng: number;
  lat: number;
  screenX: number;
  screenY: number;
};

type TargetMenuState = {
  vesselId: string;
  screenX: number;
  screenY: number;
};

type ClusterMenuState = {
  vessels: Vessel[];
  screenX: number;
  screenY: number;
};

// Synthetic historical trail: points (lng/lat) back-extrapolated from the
// vessel's current heading with a meandering wobble.
function generateHistoryTrail(vessel: Vessel): LngLat[] {
  const points: LngLat[] = [];
  const steps = 24;
  const stepMeters = 30;
  // Bearing opposite to heading (where the vessel came from).
  const backBearing = ((vessel.heading + 180) % 360) * (Math.PI / 180);
  const perp = backBearing + Math.PI / 2;
  const metersPerLat = 111_320;
  const metersPerLng = 111_320 * Math.cos((vessel.lat * Math.PI) / 180);
  for (let i = 0; i < steps; i++) {
    const along = stepMeters * i;
    const wobble = Math.sin(i * 0.9) * stepMeters * 0.9;
    const dxMeters = Math.sin(backBearing) * along + Math.sin(perp) * wobble;
    const dyMeters = Math.cos(backBearing) * along + Math.cos(perp) * wobble;
    points.push({
      lng: vessel.lng + dxMeters / metersPerLng,
      lat: vessel.lat + dyMeters / metersPerLat,
    });
  }
  return points;
}

export default function MapView({
  onTargetOpen,
  onCameraOpen,
}: {
  onTargetOpen?: (vesselId: string) => void;
  onCameraOpen?: (cameraId: string) => void;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const [targetMenu, setTargetMenu] = useState<TargetMenuState | null>(null);
  const [clusterMenu, setClusterMenu] = useState<ClusterMenuState | null>(null);
  const [historyVesselIds, setHistoryVesselIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [highlightedVesselIds, setHighlightedVesselIds] = useState<Set<string>>(
    () => new Set(),
  );
  const { scale } = useUISize();
  const pin = usePinMode();
  const measure = useMeasureMode();

  const pinRef = useRef(pin);
  pinRef.current = pin;
  const measureRef = useRef(measure);
  measureRef.current = measure;
  const historyIdsRef = useRef(historyVesselIds);
  historyIdsRef.current = historyVesselIds;
  const historyTrailsRef = useRef<Record<string, LngLat[]>>({});

  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [, setMapRenderTick] = useState(0);
  const [pinScreenPositions, setPinScreenPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [cameraScreenPositions, setCameraScreenPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [vesselScreenPositions, setVesselScreenPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [measurementScreenPositions, setMeasurementScreenPositions] = useState<
    Record<string, { start: { x: number; y: number }; end: { x: number; y: number } }>
  >({});
  const [historyScreenPaths, setHistoryScreenPaths] = useState<
    Record<string, { x: number; y: number }[]>
  >({});
  const [pendingStartScreen, setPendingStartScreen] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [cursorLngLat, setCursorLngLat] = useState<LngLat | null>(null);
  const [cursorScreen, setCursorScreen] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [mapZoom, setMapZoom] = useState<number>(14);

  // Overlay markers (cameras, vessels, pins) sit in front of the map canvas
  // as DOM siblings, so wheel events over them never reach mapbox's zoom
  // handler. Drive the map zoom directly instead, centered on the cursor.
  const forwardWheelToMap = useCallback((e: React.WheelEvent) => {
    const map = mapRef.current;
    if (!map) return;
    e.preventDefault();
    const rect = map.getContainer().getBoundingClientRect();
    const px: [number, number] = [e.clientX - rect.left, e.clientY - rect.top];
    const lineDelta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
    map.easeTo({
      zoom: map.getZoom() - lineDelta * 0.003,
      around: map.unproject(px),
      duration: 80,
    });
  }, []);

  const recomputeScreenPositions = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const pinPositions: Record<string, { x: number; y: number }> = {};
    pinRef.current.pins.forEach((p) => {
      const pt = map.project([p.lng, p.lat]);
      pinPositions[p.id] = { x: pt.x, y: pt.y };
    });
    setPinScreenPositions(pinPositions);
    const camPositions: Record<string, { x: number; y: number }> = {};
    mockCameras.forEach((c) => {
      const pt = map.project([c.lng, c.lat]);
      camPositions[c.id] = { x: pt.x, y: pt.y };
    });
    setCameraScreenPositions(camPositions);
    const vesselPositions: Record<string, { x: number; y: number }> = {};
    mockVessels.forEach((v) => {
      const pt = map.project([v.lng, v.lat]);
      vesselPositions[v.id] = { x: pt.x, y: pt.y };
    });
    setVesselScreenPositions(vesselPositions);
    const measurementPositions: Record<
      string,
      { start: { x: number; y: number }; end: { x: number; y: number } }
    > = {};
    measureRef.current.measurements.forEach((m) => {
      const s = map.project([m.start.lng, m.start.lat]);
      const e = map.project([m.end.lng, m.end.lat]);
      measurementPositions[m.id] = {
        start: { x: s.x, y: s.y },
        end: { x: e.x, y: e.y },
      };
    });
    setMeasurementScreenPositions(measurementPositions);
    const historyPaths: Record<string, { x: number; y: number }[]> = {};
    historyIdsRef.current.forEach((vid) => {
      const trail = historyTrailsRef.current[vid];
      if (!trail) return;
      historyPaths[vid] = trail.map((pt) => {
        const p = map.project([pt.lng, pt.lat]);
        return { x: p.x, y: p.y };
      });
    });
    setHistoryScreenPaths(historyPaths);
    const pending = measureRef.current.pendingStart;
    if (pending) {
      const pt = map.project([pending.lng, pending.lat]);
      setPendingStartScreen({ x: pt.x, y: pt.y });
    } else {
      setPendingStartScreen(null);
    }
  }, []);

  // Keep this alias for call sites that reference pin positions only.
  const recomputePinScreenPositions = recomputeScreenPositions;

  // Initialize map once.
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [34.6430, 31.8240],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    mapRef.current = map;
    setMapRenderTick((t) => t + 1);

    const updateHoverPos = () => {
      setHover((prev) => {
        if (!prev) return prev;
        const p = map.project([prev.lng, prev.lat]);
        return { ...prev, screenX: p.x, screenY: p.y };
      });
      recomputeScreenPositions();
    };

    map.on('click', (e) => {
      const pinState = pinRef.current;
      const measureState = measureRef.current;
      if (pinState.mode === 'placing') {
        pinState.addPin(e.lngLat.lng, e.lngLat.lat);
        return;
      }
      if (pinState.mode === 'moving') {
        pinState.commitMovePin(e.lngLat.lng, e.lngLat.lat);
        return;
      }
      if (measureState.mode !== 'off') {
        measureState.placePoint(e.lngLat.lng, e.lngLat.lat);
        return;
      }
      setHover(null);
      if (pinState.selectedPinId) pinState.setSelectedPin(null);
      if (measureState.selectedMeasurementId)
        measureState.setSelectedMeasurement(null);
    });

    map.on('mousemove', (e) => {
      setCursorLngLat({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      setCursorScreen({ x: e.point.x, y: e.point.y });
    });
    map.on('mouseout', () => {
      setCursorLngLat(null);
      setCursorScreen(null);
    });

    const updateZoom = () => setMapZoom(map.getZoom());
    map.on('move', updateHoverPos);
    map.on('zoom', updateHoverPos);
    map.on('zoom', updateZoom);
    map.on('load', () => {
      recomputeScreenPositions();
      updateZoom();
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [recomputeScreenPositions]);

  // Recompute screen positions whenever pins, measurements, or pending start change.
  useEffect(() => {
    recomputeScreenPositions();
  }, [
    pin.pins,
    measure.measurements,
    measure.pendingStart,
    historyVesselIds,
    recomputeScreenPositions,
  ]);

  // Map cursor reflects pin or measure mode.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const canvas = map.getCanvas();
    const active = pin.mode !== 'off' || measure.mode !== 'off';
    canvas.style.cursor = active ? 'none' : '';
  }, [pin.mode, measure.mode]);

  // Hide cursor on <body> only while measuring (PinCursor already manages this for pin mode).
  useEffect(() => {
    if (pin.mode !== 'off') return;
    if (measure.mode === 'off') {
      document.body.style.cursor = '';
      return;
    }
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = '';
    };
  }, [measure.mode, pin.mode]);

  // Preview end-point: while awaiting end click, follow cursor. Otherwise null.
  const previewEndScreen =
    measure.mode === 'awaiting-end' && cursorScreen ? cursorScreen : null;
  const previewEndLngLat =
    measure.mode === 'awaiting-end' && cursorLngLat ? cursorLngLat : null;

  // Group vessels whose projected screen positions overlap. Radius is a bit
  // larger than the marker diameter so visibly-touching icons collapse.
  const vesselItems = clusterVessels(mockVessels, vesselScreenPositions, 36);
  const clusteredVesselIds = new Set<string>();
  vesselItems.forEach((it) => {
    if (it.kind === 'cluster') it.vessels.forEach((v) => clusteredVesselIds.add(v.id));
  });
  const hoverHiddenByCluster =
    hover != null && clusteredVesselIds.has(hover.vesselId);

  const handleVesselContextMenu = (vessel: Vessel, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pin.mode !== 'off') return;
    if (measure.mode !== 'off') return;
    const map = mapRef.current;
    if (!map) return;
    const rect = mapContainer.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;
    setHover(null);
    setTargetMenu({ vesselId: vessel.id, screenX: x, screenY: y });
  };

  const handleTargetMenuAction = (
    vessel: Vessel,
    action: TargetContextMenuAction,
  ) => {
    setTargetMenu(null);
    if (action === 'history-path') {
      if (!historyTrailsRef.current[vessel.id]) {
        historyTrailsRef.current[vessel.id] = generateHistoryTrail(vessel);
      }
      setHistoryVesselIds((prev) => {
        const next = new Set(prev);
        if (next.has(vessel.id)) next.delete(vessel.id);
        else next.add(vessel.id);
        return next;
      });
      return;
    }
    if (action === 'highlight') {
      setHighlightedVesselIds((prev) => {
        const next = new Set(prev);
        if (next.has(vessel.id)) next.delete(vessel.id);
        else next.add(vessel.id);
        return next;
      });
      return;
    }
    if (action === 'measure') {
      if (measure.mode === 'off') measure.toggleMeasureMode();
      return;
    }
    if (action === 'track' || action === 'investigate' || action === 'point-camera') {
      onTargetOpen?.(vessel.id);
      return;
    }
    // 'clear-alert' — no-op in mock data.
  };

  // Close the context menu on outside click / escape.
  useEffect(() => {
    if (!targetMenu) return;
    const onDown = () => setTargetMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTargetMenu(null);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [targetMenu]);

  const handleVesselClick = (vessel: Vessel, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pin.mode !== 'off') return;
    if (measure.mode !== 'off') return;
    const map = mapRef.current;
    if (!map) return;
    const p = map.project([vessel.lng, vessel.lat]);
    setHover((prev) => {
      if (prev?.vesselId === vessel.id) return null;
      return {
        vesselId: vessel.id,
        target: {
          name: vessel.name,
          externalId: vessel.externalId,
          status: 'Active',
          thumbnailUrl: vessel.thumbnailUrl,
        },
        lng: vessel.lng,
        lat: vessel.lat,
        screenX: p.x,
        screenY: p.y,
      };
    });
  };

  const handleClusterClick = (
    cluster: Extract<VesselClusterItem, { kind: 'cluster' }>,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (pin.mode !== 'off') return;
    if (measure.mode !== 'off') return;
    const map = mapRef.current;
    if (!map) return;
    setClusterMenu(null);
    map.easeTo({
      center: [cluster.lng, cluster.lat],
      zoom: Math.min(map.getZoom() + 1.5, 20),
      duration: 350,
    });
  };

  const clusterCloseTimerRef = useRef<number | null>(null);
  const cancelClusterClose = () => {
    if (clusterCloseTimerRef.current !== null) {
      window.clearTimeout(clusterCloseTimerRef.current);
      clusterCloseTimerRef.current = null;
    }
  };
  const scheduleClusterClose = () => {
    cancelClusterClose();
    clusterCloseTimerRef.current = window.setTimeout(() => {
      setClusterMenu(null);
      clusterCloseTimerRef.current = null;
    }, 150);
  };
  const handleClusterHoverEnter = (
    cluster: Extract<VesselClusterItem, { kind: 'cluster' }>,
  ) => {
    if (pin.mode !== 'off') return;
    if (measure.mode !== 'off') return;
    cancelClusterClose();
    setClusterMenu({
      vessels: cluster.vessels,
      screenX: cluster.x,
      screenY: cluster.y,
    });
  };

  // Close the cluster menu when the map pans/zooms — the cluster may no
  // longer exist (vessels re-cluster or separate) once the viewport shifts.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const close = () => {
      cancelClusterClose();
      setClusterMenu(null);
    };
    map.on('movestart', close);
    map.on('zoomstart', close);
    return () => {
      map.off('movestart', close);
      map.off('zoomstart', close);
    };
  }, []);

  return (
    <>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      {/* Measurement lines (SVG overlay). */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 9 }}
      >
        {measure.measurements.map((m) => {
          const pos = measurementScreenPositions[m.id];
          if (!pos) return null;
          return (
            <line
              key={m.id}
              x1={pos.start.x}
              y1={pos.start.y}
              x2={pos.end.x}
              y2={pos.end.y}
              stroke="white"
              strokeWidth={1.25}
              strokeDasharray="5 4"
              strokeLinecap="round"
              opacity={0.95}
            />
          );
        })}
        {pendingStartScreen && previewEndScreen && (
          <line
            x1={pendingStartScreen.x}
            y1={pendingStartScreen.y}
            x2={previewEndScreen.x}
            y2={previewEndScreen.y}
            stroke="white"
            strokeWidth={1.25}
            strokeDasharray="5 4"
            strokeLinecap="round"
            opacity={0.95}
          />
        )}
      </svg>
      {/* Fixed cameras (infrastructure, not tied to pin mode). Hidden when
          zoomed out so they don't clutter the overview. */}
      {mapZoom >= 13 && mockCameras.map((c) => {
        const pos = cameraScreenPositions[c.id];
        if (!pos) return null;
        return (
          <div
            key={c.id}
            className="absolute z-10 cursor-pointer"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
            }}
            onWheel={forwardWheelToMap}
            onClick={(e) => {
              e.stopPropagation();
              onCameraOpen?.(c.id);
            }}
            role="button"
            tabIndex={0}
          >
            <CameraMarker />
          </div>
        );
      })}
      {/* Vessels: individual markers, or a count bubble when they overlap on screen. */}
      {vesselItems.map((item) => {
        if (item.kind === 'single') {
          return (
            <div
              key={item.id}
              className="absolute z-10"
              style={{
                left: item.x,
                top: item.y,
                transform: 'translate(-50%, -50%)',
              }}
              onWheel={forwardWheelToMap}
            >
              <VesselMarker
                vessel={item.vessel}
                onClick={(e) => handleVesselClick(item.vessel, e)}
                onContextMenu={(e) => handleVesselContextMenu(item.vessel, e)}
              />
              {highlightedVesselIds.has(item.vessel.id) && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: 58,
                    height: 58,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.95)',
                    boxShadow:
                      '0 0 0 3px rgba(255,255,255,0.25), 0 0 10px rgba(255,255,255,0.6)',
                  }}
                />
              )}
            </div>
          );
        }
        return (
          <div
            key={item.id}
            className="absolute z-10"
            style={{
              left: item.x,
              top: item.y,
              transform: 'translate(-50%, -50%)',
            }}
            onWheel={forwardWheelToMap}
          >
            <VesselClusterMarker
              count={item.vessels.length}
              onClick={(e) => handleClusterClick(item, e)}
              onMouseEnter={() => handleClusterHoverEnter(item)}
              onMouseLeave={scheduleClusterClose}
            />
          </div>
        );
      })}
      {/* User-placed pins. Interactive in pin mode. */}
      {pin.pins.map((p) => {
        const pos = pinScreenPositions[p.id];
        if (!pos) return null;
        const dimmed = pin.mode === 'moving' && pin.movingPinId === p.id;
        const isSelected = pin.selectedPinId === p.id;
        const showHint =
          pin.mode !== 'off' && hoveredPinId === p.id && !isSelected;
        return (
          <div
            key={p.id}
            className="absolute z-10"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
            }}
            onWheel={forwardWheelToMap}
          >
            <div className="relative">
              <MapPin
                dimmed={dimmed}
                showHint={showHint}
                onMouseEnter={() => setHoveredPinId(p.id)}
                onMouseLeave={() => setHoveredPinId(null)}
                onClick={(e) => {
                  const state = pinRef.current;
                  if (state.mode === 'off') return;
                  e.stopPropagation();
                  if (state.mode === 'moving') {
                    state.commitMovePin(p.lng, p.lat);
                    return;
                  }
                  state.setSelectedPin(
                    state.selectedPinId === p.id ? null : p.id,
                  );
                }}
              />
              {isSelected && (
                <div
                  className="absolute z-30"
                  style={{ left: 'calc(100% + 8px)', top: '-8px' }}
                >
                  <PinContextMenu
                    onMove={() => pin.startMovePin(p.id)}
                    onDelete={() => pin.deletePin(p.id)}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
      {/* Committed measurements (only visible while the tool is active — cleared on exit). */}
      {measure.measurements.map((m) => {
        const pos = measurementScreenPositions[m.id];
        if (!pos) return null;
        return (
          <div key={m.id}>
            <MeasurementEndpoint pos={pos.start} />
            <MeasurementEndpoint pos={pos.end} />
            <MeasurementLabel
              start={pos.start}
              end={pos.end}
              text={formatMeasurement(m.start, m.end)}
            />
          </div>
        );
      })}
      {/* Pending measurement: start dot, live end dot under cursor, live label. */}
      {pendingStartScreen && (
        <MeasurementEndpoint pos={pendingStartScreen} />
      )}
      {pendingStartScreen &&
        previewEndScreen &&
        measure.pendingStart &&
        previewEndLngLat && (
          <>
            <MeasurementEndpoint pos={previewEndScreen} />
            <MeasurementLabel
              start={pendingStartScreen}
              end={previewEndScreen}
              text={formatMeasurement(measure.pendingStart, previewEndLngLat)}
            />
          </>
        )}
      {/* History paths: wavy trail behind the vessel. */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 8 }}
      >
        {Object.entries(historyScreenPaths).map(([vid, pts]) => {
          if (pts.length < 2) return null;
          const d = pts
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`)
            .join(' ');
          return (
            <g key={vid}>
              <path
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={d}
                fill="none"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
      {clusterMenu && (
        <ClusterVesselMenuOverlay
          x={clusterMenu.screenX}
          y={clusterMenu.screenY}
          scale={scale}
          vessels={clusterMenu.vessels}
          onSelect={(vesselId) => {
            setClusterMenu(null);
            onTargetOpen?.(vesselId);
          }}
          onMouseEnter={cancelClusterClose}
          onMouseLeave={scheduleClusterClose}
          onWheel={forwardWheelToMap}
        />
      )}
      {targetMenu && (
        <TargetContextMenuOverlay
          x={targetMenu.screenX}
          y={targetMenu.screenY}
          scale={scale}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={forwardWheelToMap}
          onAction={(action) => {
            const vessel = mockVessels.find(
              (v) => v.id === targetMenu.vesselId,
            );
            if (vessel) handleTargetMenuAction(vessel, action);
          }}
        />
      )}
      {hover && !hoverHiddenByCluster && pin.mode === 'off' && measure.mode === 'off' && (
        <div
          className="absolute z-20"
          style={{
            left: hover.screenX,
            top: hover.screenY + 15,
            transform: 'translate(-50%, -100%)',
            paddingBottom: 30,
          }}
          onWheel={forwardWheelToMap}
        >
          <TargetHoverCard
            target={hover.target}
            style={{ zoom: scale }}
            onOpen={() => { onTargetOpen?.(hover.vesselId); setHover(null); }}
          />
        </div>
      )}
    </>
  );
}

function TargetContextMenuOverlay({
  x,
  y,
  scale,
  onAction,
  onMouseDown,
  onWheel,
}: {
  x: number;
  y: number;
  scale: number;
  onAction: (action: TargetContextMenuAction) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{
    openLeft: boolean;
    openUp: boolean;
    measured: boolean;
  }>({ openLeft: false, openUp: false, measured: false });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const openLeft = x + 12 + rect.width + margin > vw;
    const openUp = y + 12 + rect.height + margin > vh;
    setLayout({ openLeft, openUp, measured: true });
  }, [x, y, scale]);

  const offset = 12;
  const left = layout.openLeft ? x - offset : x + offset;
  const top = layout.openUp ? y - offset : y + offset;
  const translate = `${layout.openLeft ? '-100%' : '0'}, ${layout.openUp ? '-100%' : '0'}`;

  return (
    <div
      ref={ref}
      className="absolute z-30"
      style={{
        left,
        top,
        transform: `translate(${translate})`,
        visibility: layout.measured ? 'visible' : 'hidden',
      }}
      onMouseDown={onMouseDown}
      onContextMenu={(e) => e.preventDefault()}
      onWheel={onWheel}
    >
      <div style={{ zoom: scale }}>
        <TargetContextMenu
          onAction={onAction}
          openLeft={layout.openLeft}
          openUp={layout.openUp}
        />
      </div>
    </div>
  );
}

function ClusterShipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17L5 11H19L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 17C3 17 5 20 12 20C19 20 21 17 21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11V7H17V11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="4" x2="12" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClusterVesselRow({
  vessel,
  onClick,
}: {
  vessel: Vessel;
  onClick: () => void;
}) {
  const style = vesselStyles[vessel.color];
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full p-2 rounded-lg text-left cursor-pointer transition-colors bg-[rgb(var(--accent-rgb)/0.1)] hover:bg-[rgb(var(--accent-rgb)/0.3)]"
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
        style={{ background: style.bg, border: `1px solid ${style.border}` }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: style.dot, border: '2px solid white' }}
        />
      </div>
      <div className="flex flex-col min-w-0 flex-1 text-white">
        <span className="font-ibm-plex-sans font-bold text-sm truncate leading-tight">
          {vessel.name}
        </span>
        <span className="font-ibm-plex-sans font-normal text-xs text-[var(--accent-muted)] truncate">
          {vessel.externalId}
        </span>
      </div>
      <ClusterShipIcon />
    </button>
  );
}

function ClusterVesselMenu({
  vessels,
  onSelect,
}: {
  vessels: Vessel[];
  onSelect: (vesselId: string) => void;
}) {
  return (
    <GlassPanel cornerRadius={16} padding="12px">
      <div className="flex flex-col w-[260px] gap-1">
        <div className="px-1 pt-0.5 pb-1 font-ibm-plex-sans font-bold text-[13px] text-[var(--accent-muted)] tracking-wide uppercase">
          {vessels.length} Vessels
        </div>
        <div className="flex flex-col gap-1 max-h-[320px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {vessels.map((v) => (
            <ClusterVesselRow
              key={v.id}
              vessel={v}
              onClick={() => onSelect(v.id)}
            />
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

function ClusterVesselMenuOverlay({
  x,
  y,
  scale,
  vessels,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  onWheel,
}: {
  x: number;
  y: number;
  scale: number;
  vessels: Vessel[];
  onSelect: (vesselId: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onWheel: (e: React.WheelEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{
    openLeft: boolean;
    openUp: boolean;
    measured: boolean;
  }>({ openLeft: false, openUp: false, measured: false });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const openLeft = x + 34 + rect.width + margin > vw;
    const openUp = y + rect.height / 2 + margin > vh;
    setLayout({ openLeft, openUp, measured: true });
  }, [x, y, scale, vessels.length]);

  // Keep a tight visual connection to the cluster bubble so the cursor can
  // cross without triggering the close timer.
  const offset = 34;
  const left = layout.openLeft ? x - offset : x + offset;
  const top = y;
  const translate = `${layout.openLeft ? '-100%' : '0'}, ${
    layout.openUp ? '-100%' : '-50%'
  }`;

  return (
    <div
      ref={ref}
      className="absolute z-30"
      style={{
        left,
        top,
        transform: `translate(${translate})`,
        visibility: layout.measured ? 'visible' : 'hidden',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      onWheel={onWheel}
    >
      <div style={{ zoom: scale }}>
        <ClusterVesselMenu vessels={vessels} onSelect={onSelect} />
      </div>
    </div>
  );
}

function MeasurementEndpoint({ pos }: { pos: { x: number; y: number } }) {
  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="w-[8px] h-[8px] rounded-full"
        style={{
          background: '#ffffff',
          boxShadow:
            '0 0 0 2px rgb(var(--accent-rgb)/0.55), 0 0 6px rgba(0,0,0,0.6)',
        }}
      />
    </div>
  );
}

function MeasurementLabel({
  start,
  end,
  text,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  text: string;
}) {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  let angle =
    (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
  // Keep text upright: flip if line reads right-to-left.
  if (angle > 90) angle -= 180;
  else if (angle < -90) angle += 180;
  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{
        left: midX,
        top: midY,
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-14px)`,
        transformOrigin: 'center',
      }}
    >
      <div
        className="text-white text-[11px] font-medium tracking-[0.3px] whitespace-nowrap"
        style={{
          textShadow:
            '0 0 4px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        {text}
      </div>
    </div>
  );
}
