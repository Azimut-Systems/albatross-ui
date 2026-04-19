import { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import ToolsBar from './components/ToolsBar';
import GlassShowcase from './components/GlassShowcase';
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
      <div style={uiScaleStyle}>
        <GlassShowcase />
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
