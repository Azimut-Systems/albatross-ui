import GlassPanel from './GlassPanel';

function WifiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="20" r="1" fill="white" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 20V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 20V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 20v-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GlassShowcase() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-6 pointer-events-auto">
        {/* Wide card */}
        <GlassPanel padding="16px" cornerRadius={20}>
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[rgb(var(--accent-rgb)/0.3)] flex items-center justify-center">
              <ShieldIcon />
            </div>
            <div>
              <div className="text-white font-ibm-plex-sans font-bold text-sm">System Status</div>
              <div className="text-[#9ca3af] font-ibm-plex-sans text-xs mt-0.5">All systems operational</div>
            </div>
            <div className="ml-8 w-2 h-2 rounded-full bg-green-400" />
          </div>
        </GlassPanel>

        <div className="flex items-start gap-4">
          {/* Stat card */}
          <GlassPanel padding="16px" cornerRadius={20}>
            <div className="flex flex-col items-center gap-2 px-4 py-1">
              <ChartIcon />
              <div className="text-white font-ibm-plex-sans font-bold text-2xl">24</div>
              <div className="text-[#9ca3af] font-ibm-plex-sans text-xs">Active Vessels</div>
            </div>
          </GlassPanel>

          {/* Tall card */}
          <GlassPanel padding="16px" cornerRadius={20}>
            <div className="flex flex-col gap-3 px-2 py-1 min-w-[140px]">
              <div className="text-white font-ibm-plex-sans font-bold text-sm">Connections</div>
              {['AIS Feed', 'Radar', 'Camera'].map((label) => (
                <div key={label} className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <WifiIcon />
                    <span className="text-[#dee3e7] font-ibm-plex-sans text-xs">{label}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Icon-only small panel */}
          <div className="flex flex-col gap-3">
            <GlassPanel>
              <div className="p-3">
                <ShieldIcon />
              </div>
            </GlassPanel>
            <GlassPanel cornerRadius={24}>
              <div className="p-3">
                <ChartIcon />
              </div>
            </GlassPanel>
            <GlassPanel cornerRadius={24}>
              <div className="p-3">
                <WifiIcon />
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
