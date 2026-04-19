import { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import ToolsBar from './components/ToolsBar';
import SettingsPanel from './components/SettingsPanel';
import TargetsList, { type Target } from './components/TargetsList';
import CamerasList, { type Camera } from './components/CamerasList';
import { UISizeProvider, useUISize } from './contexts/UISizeContext';

const MOCK_TARGETS: Target[] = Array.from({ length: 7 }, (_, i) => ({
  id: String(i),
  name: 'Target Name',
  coordinates: `31°38'17 N | 31°12'08 E`,
  status: 'Critical',
  vesselClass: 'Bulk',
  heading: '084°',
  speed: '09 kt',
  transmission: 'AIS',
  size: '72M',
}));

const MOCK_CAMERAS: Camera[] = Array.from({ length: 7 }, (_, i) => ({
  id: String(i),
  name: 'Cameras Name',
  status: 'Connected',
  activity: 'Idle',
  completion: 75,
}));

function AppShell() {
  const [activeNav, setActiveNav] = useState('Map');
  const [targetsOpen, setTargetsOpen] = useState(false);
  const [camerasOpen, setCamerasOpen] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState<string | undefined>('1');
  const [activeCameraId, setActiveCameraId] = useState<string | undefined>('1');
  const { scale } = useUISize();
  const uiScaleStyle = { zoom: scale } as React.CSSProperties;

  return (
    <div className="relative h-screen w-screen bg-[#12111b] overflow-hidden">
      <MapView />
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
        <svg width="80" height="17" viewBox="0 0 135 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M48.3412 8.91016H30.9934V13.7846H39.2333L30.5605 28.4101V28.7708H48.4599V23.8964H39.6685L48.3412 9.27079V8.91016Z" fill="#844CFF" fillOpacity="0.6"/>
          <path d="M28.9719 22.2422H21.7256V28.8802H28.9719V22.2422Z" fill="#844CFF" fillOpacity="0.6"/>
          <path d="M58.2705 8.88477H51.0801V28.764H58.2705V8.88477Z" fill="#844CFF" fillOpacity="0.6"/>
          <path d="M58.3068 0H51.0605V6.63805H58.3068V0Z" fill="#7318FF" fillOpacity="0.6"/>
          <path d="M127.637 2.49805H120.512V22.1795H127.637V2.49805Z" fill="#7318FF" fillOpacity="0.6"/>
          <path d="M135 22.1875H127.754V28.8256H135V22.1875Z" fill="#844CFF" fillOpacity="0.6"/>
          <path d="M134.88 9.08398H127.634V15.722H134.88V9.08398Z" fill="#844CFF" fillOpacity="0.6"/>
          <path d="M117.31 9.08594H110.127V22.2457H117.31V9.08594Z" fill="#7318FF" fillOpacity="0.6"/>
          <path d="M21.7412 22.2351V8.95898H10.8718C4.86577 8.95898 0 13.4169 0 18.9172C0 24.4175 4.86577 28.8731 10.8694 28.8731H14.4926V22.2351H7.2463V15.597H14.4949V22.2351H21.7412Z" fill="#844CFF" fillOpacity="0.6"/>
          <path d="M61.4857 9.49391V28.7636H67.6058V16.9928C67.6058 15.1012 68.9438 13.8053 70.9334 13.8053C72.8066 13.8053 74.1074 15.1012 74.1074 16.9928V28.7636H80.2274V16.9928C80.2274 15.1012 81.5655 13.8053 83.5551 13.8053C85.4283 13.8053 86.7291 15.1012 86.7291 16.9928V28.7636H92.8491V16.2553C92.8491 11.7019 89.9799 9.14258 85.6191 9.14258C82.6359 9.14258 80.3019 10.1942 78.8871 12.0858C77.8167 10.1942 75.9039 9.14258 73.1487 9.14258C70.7775 9.14258 68.9042 9.91271 67.6034 11.3157V9.49391H61.4834H61.4857Z" fill="#844CFF" fillOpacity="0.6"/>
          <path d="M95.7598 9.08594V18.9511C95.7598 24.4049 100.586 28.8256 106.541 28.8256H110.129V22.2457H102.946V9.08594H95.7621H95.7598Z" fill="#844CFF" fillOpacity="0.6"/>
        </svg>
      </div>
      <div style={uiScaleStyle}>
        <Header
          activeNav={activeNav}
          onNavChange={setActiveNav}
          targetsOpen={targetsOpen}
          onTargetsToggle={() => setTargetsOpen((v) => !v)}
          camerasOpen={camerasOpen}
          onCamerasToggle={() => setCamerasOpen((v) => !v)}
        />
        <ToolsBar />
        {targetsOpen && (
          <TargetsList
            targets={MOCK_TARGETS}
            activeId={activeTargetId}
            onSelect={setActiveTargetId}
          />
        )}
        {camerasOpen && (
          <CamerasList
            cameras={MOCK_CAMERAS}
            activeId={activeCameraId}
            onSelect={setActiveCameraId}
          />
        )}
        {activeNav === 'Settings' && <SettingsPanel />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UISizeProvider>
      <AppShell />
    </UISizeProvider>
  );
}
