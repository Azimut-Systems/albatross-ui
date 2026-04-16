import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

type VesselColor = 'blue' | 'red' | 'orange' | 'yellow';

interface Vessel {
  id: string;
  lng: number;
  lat: number;
  color: VesselColor;
  heading: number;
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
  { id: 'v1', lng: 34.6385, lat: 31.8305, color: 'red', heading: 45 },
  { id: 'v2', lng: 34.6520, lat: 31.8270, color: 'red', heading: 120 },
  { id: 'v3', lng: 34.6410, lat: 31.8340, color: 'orange', heading: 200 },
  { id: 'v4', lng: 34.6470, lat: 31.8220, color: 'orange', heading: 310 },
  { id: 'v5', lng: 34.6350, lat: 31.8260, color: 'blue', heading: 170 },
  { id: 'v6', lng: 34.6490, lat: 31.8290, color: 'blue', heading: 90 },
  { id: 'v7', lng: 34.6530, lat: 31.8250, color: 'blue', heading: 260 },
  { id: 'v8', lng: 34.6440, lat: 31.8200, color: 'yellow', heading: 30 },
  { id: 'v9', lng: 34.6380, lat: 31.8235, color: 'yellow', heading: 150 },
  { id: 'v10', lng: 34.6500, lat: 31.8210, color: 'yellow', heading: 280 },
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
    width: 36px;
    height: 36px;
    border-radius: 22.5px;
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
  const dist = 22;
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

function createCameraMarkerEl(): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText = `
    width: 62px;
    height: 62px;
    border-radius: 38.75px;
    border: 1.292px solid #8b85c4;
    background: linear-gradient(222.59deg, rgba(29,22,58,0.8) 13.21%, rgba(83,64,152,0.8) 82.98%);
    backdrop-filter: blur(5.167px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 12.917px;
    overflow: hidden;
  `;

  const svg = document.createElement('div');
  svg.innerHTML = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="22" height="18" rx="3" stroke="#c4bfef" stroke-width="2" fill="none" />
      <path d="M24 14L32 10V26L24 22" stroke="#c4bfef" stroke-width="2" stroke-linejoin="round" fill="none" />
    </svg>
  `;
  el.appendChild(svg);

  return el;
}

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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

    map.on('load', () => {
      // Add vessel markers
      mockVessels.forEach((vessel) => {
        const el = createVesselMarkerEl(vessel);
        new mapboxgl.Marker({ element: el })
          .setLngLat([vessel.lng, vessel.lat])
          .addTo(map);
      });

      // Add camera markers
      mockCameras.forEach((camera) => {
        const el = createCameraMarkerEl();
        new mapboxgl.Marker({ element: el })
          .setLngLat([camera.lng, camera.lat])
          .addTo(map);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
  );
}
