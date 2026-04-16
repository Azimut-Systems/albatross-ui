import { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import ToolsBar from './components/ToolsBar';

export default function App() {
  const [activeNav, setActiveNav] = useState('Map');

  return (
    <div className="relative h-screen w-screen bg-[#12111b] overflow-hidden">
      <MapView />
      <Header activeNav={activeNav} onNavChange={setActiveNav} />
      <ToolsBar />
    </div>
  );
}
