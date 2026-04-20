import GlassPanel from './GlassPanel';

const navItems = ['Map', 'Archive', 'Fleet', 'Settings'] as const;

function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" />
      <line x1="1" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="19" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 9.5L21 7V17L16 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AzimutLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="var(--accent)" />
      <path d="M12 28L20 12L28 28H12Z" fill="currentColor" fillOpacity="0.9" />
      <circle cx="20" cy="22" r="3" fill="var(--accent)" />
    </svg>
  );
}

type HeaderProps = {
  activeNav: string;
  onNavChange: (item: string) => void;
  targetsOpen?: boolean;
  onTargetsToggle?: () => void;
  camerasOpen?: boolean;
  onCamerasToggle?: () => void;
};

export default function Header({
  activeNav,
  onNavChange,
  targetsOpen,
  onTargetsToggle,
  camerasOpen,
  onCamerasToggle,
}: HeaderProps) {
  const utilityButtons = [
    {
      Icon: TargetIcon,
      label: 'Toggle targets list',
      active: targetsOpen,
      onClick: onTargetsToggle,
    },
    {
      Icon: CameraIcon,
      label: 'Toggle cameras list',
      active: camerasOpen,
      onClick: onCamerasToggle,
    },
    { Icon: BellIcon, label: 'Notifications' },
  ];

  return (
    <div className="absolute top-[25px] left-1/2 -translate-x-1/2 w-[calc(100%-44px)] h-[64px] z-20 flex items-center justify-between">
      <div />

      {/* Center: Navigation Menu */}
      <GlassPanel className="absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onNavChange(item)}
              className={`flex items-center px-[14px] py-[14px] text-sm tracking-[0.25px] transition-colors cursor-pointer ${
                activeNav === item ? 'font-bold' : 'font-medium'
              }`}
              style={
                activeNav === item
                  ? {
                      borderRadius: 'var(--glass-inner-radius)',
                      color: 'var(--accent-active-fg)',
                      backgroundImage:
                        'linear-gradient(90deg, rgb(var(--accent-rgb) / 0.35) 0%, rgb(var(--accent-rgb) / 0.35) 100%), linear-gradient(107deg, rgba(56,78,231,0.15) 5.66%, rgba(30,191,245,0.15) 98.96%)',
                    }
                  : { borderRadius: 'var(--glass-inner-radius)', color: 'var(--accent-muted)' }
              }
            >
              <span className="font-ibm-plex-sans">{item}</span>
            </button>
          ))}
        </div>
      </GlassPanel>

      {/* Right: Utility Buttons */}
      <div className="flex items-center gap-2">
        {utilityButtons.map(({ Icon, label, active, onClick }) => (
          <GlassPanel
            key={label}
            style={
              active
                ? {
                    border: '1px solid var(--accent)',
                    background: 'rgb(var(--accent-rgb) / 0.15)',
                  }
                : undefined
            }
          >
            <button
              type="button"
              onClick={onClick}
              aria-label={label}
              aria-pressed={active ?? undefined}
              className="flex items-center p-3 cursor-pointer transition-colors"
              style={{
                borderRadius: 'var(--glass-inner-radius)',
                color: active ? 'var(--accent-active-fg)' : 'var(--accent-muted)',
              }}
            >
              <Icon />
            </button>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
