import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import GlassPanel from './GlassPanel';
import PinContextMenu from './PinContextMenu';
import PinIcon from './icons/PinIcon';
import TargetHoverCard, { type TargetHoverCardData } from './TargetHoverCard';
import { useUISize } from '../contexts/UISizeContext';
import { usePinMode } from '../contexts/PinModeContext';

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

function createVesselMarkerEl(vessel: Vessel): HTMLDivElement {
  const style = vesselStyles[vessel.color];
  const el = document.createElement('div');
  el.style.cssText = `
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${style.bg};
    border: 1px solid ${style.border};
    backdrop-filter: blur(0.655px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `;

  const dot = document.createElement('div');
  dot.style.cssText = `
    width: 13.5px;
    height: 13.5px;
    border-radius: 50%;
    background: ${style.dot};
    border: 2px solid white;
  `;
  el.appendChild(dot);

  const arrow = document.createElement('div');
  const rad = (vessel.heading - 90) * (Math.PI / 180);
  const dist = 19;
  const ax = Math.cos(rad) * dist;
  const ay = Math.sin(rad) * dist;
  arrow.style.cssText = `
    position: absolute;
    width: 12px;
    height: 12px;
    left: calc(50% + ${ax}px - 6px);
    top: calc(50% + ${ay}px - 6px);
    transform: rotate(${vessel.heading}deg);
  `;
  arrow.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 0L10 8L6 6L2 8L6 0Z" fill="${style.border}" />
    </svg>
  `;
  el.appendChild(arrow);

  return el;
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
  const hideTimerRef = useRef<number | null>(null);
  const { scale } = useUISize();
  const pin = usePinMode();

  const pinRef = useRef(pin);
  pinRef.current = pin;

  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [, setMapRenderTick] = useState(0);
  const [pinScreenPositions, setPinScreenPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [cameraScreenPositions, setCameraScreenPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimerRef.current = window.setTimeout(() => {
      setHover(null);
      hideTimerRef.current = null;
    }, 300);
  }, [cancelHide]);

  const recomputePinScreenPositions = useCallback(() => {
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
  }, []);

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
      recomputePinScreenPositions();
    };

    mockVessels.forEach((vessel) => {
      const el = createVesselMarkerEl(vessel);
      el.addEventListener('mouseenter', () => {
        if (pinRef.current.mode !== 'off') return;
        cancelHide();
        const p = map.project([vessel.lng, vessel.lat]);
        setHover({
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
        });
      });
      new mapboxgl.Marker({ element: el })
        .setLngLat([vessel.lng, vessel.lat])
        .addTo(map);
    });

    map.on('click', (e) => {
      const state = pinRef.current;
      if (state.mode === 'placing') {
        state.addPin(e.lngLat.lng, e.lngLat.lat);
      } else if (state.mode === 'moving') {
        state.commitMovePin(e.lngLat.lng, e.lngLat.lat);
      } else if (state.selectedPinId) {
        state.setSelectedPin(null);
      }
    });

    map.on('move', updateHoverPos);
    map.on('zoom', updateHoverPos);
    map.on('load', recomputePinScreenPositions);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [cancelHide, recomputePinScreenPositions]);

  // Recompute pin screen positions whenever pins change.
  useEffect(() => {
    recomputePinScreenPositions();
  }, [pin.pins, recomputePinScreenPositions]);

  // Map cursor reflects pin mode.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const canvas = map.getCanvas();
    canvas.style.cursor = pin.mode !== 'off' ? 'none' : '';
  }, [pin.mode]);

  return (
    <>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      {/* Fixed cameras (infrastructure, not tied to pin mode). */}
      {mockCameras.map((c) => {
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
      {hover && pin.mode === 'off' && (
        <div
          className="absolute z-20"
          style={{
            left: hover.screenX,
            top: hover.screenY + 15,
            transform: 'translate(-50%, -100%)',
            paddingBottom: 30,
          }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <TargetHoverCard target={hover.target} style={{ zoom: scale }} />
        </div>
      )}
    </>
  );
}
