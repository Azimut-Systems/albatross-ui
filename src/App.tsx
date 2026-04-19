import { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import ToolsBar from './components/ToolsBar';
import GlassShowcase from './components/GlassShowcase';
import SettingsPanel from './components/SettingsPanel';
import TargetsList from './components/TargetsList';
import { UISizeProvider, useUISize } from './contexts/UISizeContext';

function AppShell() {
  const [activeNav, setActiveNav] = useState('Map');
  const { scale } = useUISize();
  const uiScaleStyle = { zoom: scale } as React.CSSProperties;

  return (
    <div className="relative h-screen w-screen bg-[#12111b] overflow-hidden">
      <MapView />
      <GlassShowcase />
      <div style={uiScaleStyle}>
        <Header activeNav={activeNav} onNavChange={setActiveNav} />
        <ToolsBar />
        <TargetsList />
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
