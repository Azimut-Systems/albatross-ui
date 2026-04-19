import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import GlassPanel from './GlassPanel';
import TargetHoverCard, { type TargetHoverCardData } from './TargetHoverCard';
import { useUISize } from '../contexts/UISizeContext';

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

interface Camera {
  id: string;
  lng: number;
  lat: number;
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

const mockCameras: Camera[] = [
  { id: 'c1', lng: 34.6320, lat: 31.8260 },
  { id: 'c2', lng: 34.6480, lat: 31.8190 },
  { id: 'c3', lng: 34.6460, lat: 31.8230 },
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

  // Center dot
  const dot = document.createElement('div');
  dot.style.cssText = `
    width: 13.5px;
    height: 13.5px;
    border-radius: 50%;
    background: ${style.dot};
    border: 2px solid white;
  `;
  el.appendChild(dot);

  // Direction indicator
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

function CameraMarkerContent() {
  return (
    <GlassPanel cornerRadius={31} padding="12px" style={{ cursor: 'pointer' }}>
      <div className="flex items-center justify-center w-[36px] h-[36px]">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="8" width="22" height="18" rx="3" stroke="#c4bfef" strokeWidth="2" fill="none" />
          <path d="M24 14L32 10V26L24 22" stroke="#c4bfef" strokeWidth="2" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </GlassPanel>
  );
}

function createCameraMarkerEl(): HTMLDivElement {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<CameraMarkerContent />);
  return container;
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
  const { scale } = useUISize();

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

    const updateHoverPos = () => {
      setHover((prev) => {
        if (!prev) return prev;
        const p = map.project([prev.lng, prev.lat]);
        return { ...prev, screenX: p.x, screenY: p.y };
      });
    };

    const addMarkers = () => {
      mockVessels.forEach((vessel) => {
        const el = createVesselMarkerEl(vessel);
        el.addEventListener('mouseenter', () => {
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
        el.addEventListener('mouseleave', () => setHover(null));
        new mapboxgl.Marker({ element: el })
          .setLngLat([vessel.lng, vessel.lat])
          .addTo(map);
      });

      mockCameras.forEach((camera) => {
        const el = createCameraMarkerEl();
        new mapboxgl.Marker({ element: el })
          .setLngLat([camera.lng, camera.lat])
          .addTo(map);
      });
    };

    addMarkers();

    map.on('move', updateHoverPos);
    map.on('zoom', updateHoverPos);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      {hover && (
        <div
          className="pointer-events-none absolute z-20"
          style={{
            left: hover.screenX,
            top: hover.screenY - 20 * scale,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <TargetHoverCard target={hover.target} />
        </div>
      )}
    </>
  );
}
