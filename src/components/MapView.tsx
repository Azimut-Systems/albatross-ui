import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import GlassPanel from './GlassPanel';
import PinContextMenu from './PinContextMenu';
import PinIcon from './icons/PinIcon';
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
  { id: 'c1', lng: 34.632, lat: 31.826 },
  { id: 'c2', lng: 34.648, lat: 31.819 },
  { id: 'c3', lng: 34.646, lat: 31.823 },
];

const mockVessels: Vessel[] = [
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
];

function VesselMarker({
  vessel,
  onClick,
}: {
  vessel: Vessel;
  onClick: (e: React.MouseEvent) => void;
}) {
  const style = vesselStyles[vessel.color];
  const rad = (vessel.heading - 90) * (Math.PI / 180);
  const dist = 19;
  const ax = Math.cos(rad) * dist;
  const ay = Math.sin(rad) * dist;
  return (
    <div
      onClick={onClick}
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
}: {
  count: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
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
          <rect x="2" y="8" width="22" height="18" rx="3" stroke="#c4bfef" strokeWidth="2" fill="none" />
          <path d="M24 14L32 10V26L24 22" stroke="#c4bfef" strokeWidth="2" strokeLinejoin="round" fill="none" />
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

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const { scale } = useUISize();
  const pin = usePinMode();
  const measure = useMeasureMode();

  const pinRef = useRef(pin);
  pinRef.current = pin;
  const measureRef = useRef(measure);
  measureRef.current = measure;

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
  const [pendingStartScreen, setPendingStartScreen] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [cursorLngLat, setCursorLngLat] = useState<LngLat | null>(null);
  const [cursorScreen, setCursorScreen] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [mapZoom, setMapZoom] = useState<number>(14);

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
    map.easeTo({
      center: [cluster.lng, cluster.lat],
      zoom: Math.min(map.getZoom() + 1.5, 20),
      duration: 350,
    });
  };

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
            className="absolute z-10"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
            }}
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
            >
              <VesselMarker
                vessel={item.vessel}
                onClick={(e) => handleVesselClick(item.vessel, e)}
              />
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
          >
            <VesselClusterMarker
              count={item.vessels.length}
              onClick={(e) => handleClusterClick(item, e)}
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
      {hover && !hoverHiddenByCluster && pin.mode === 'off' && measure.mode === 'off' && (
        <div
          className="absolute z-20"
          style={{
            left: hover.screenX,
            top: hover.screenY + 15,
            transform: 'translate(-50%, -100%)',
            paddingBottom: 30,
          }}
        >
          <TargetHoverCard target={hover.target} style={{ zoom: scale }} />
        </div>
      )}
    </>
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
            '0 0 0 2px rgba(105,49,245,0.55), 0 0 6px rgba(0,0,0,0.6)',
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
