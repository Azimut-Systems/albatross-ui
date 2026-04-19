import GlassPanel from './GlassPanel';

const navItems = ['Map', 'Archive', 'Fleet', 'Settings'] as const;

function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="white" />
      <line x1="12" y1="1" x2="12" y2="5" stroke="white" strokeWidth="1.5" />
      <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="1.5" />
      <line x1="1" y1="12" x2="5" y2="12" stroke="white" strokeWidth="1.5" />
      <line x1="19" y1="12" x2="23" y2="12" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="14" height="12" rx="2" stroke="white" strokeWidth="1.5" />
      <path d="M16 9.5L21 7V17L16 14.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AzimutLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#6931F5" />
      <path d="M12 28L20 12L28 28H12Z" fill="white" fillOpacity="0.9" />
      <circle cx="20" cy="22" r="3" fill="#6931F5" />
    </svg>
  );
}

type HeaderProps = {
  activeNav: string;
  onNavChange: (item: string) => void;
  targetsOpen?: boolean;
  onTargetsToggle?: () => void;
};

export default function Header({ activeNav, onNavChange, targetsOpen, onTargetsToggle }: HeaderProps) {
  const utilityButtons = [
    {
      Icon: TargetIcon,
      label: 'Toggle targets list',
      active: targetsOpen,
      onClick: onTargetsToggle,
    },
    { Icon: CameraIcon, label: 'Cameras' },
    { Icon: BellIcon, label: 'Notifications' },
  ];

  return (
    <div className="absolute top-[25px] left-1/2 -translate-x-1/2 w-[calc(100%-44px)] h-[64px] z-20 flex items-center justify-between">
      {/* Left: Logo + Site Name */}
      <div className="flex items-center gap-4">
        <AzimutLogo />
        <span className="font-montserrat font-bold text-[28px] text-white tracking-[1.14px]">
          Ashdod
        </span>
      </div>

      {/* Center: Navigation Menu */}
      <GlassPanel className="absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onNavChange(item)}
              className={`flex items-center px-[14px] py-[14px] rounded-lg text-sm tracking-[0.25px] transition-all cursor-pointer ${
                activeNav === item
                  ? 'text-white font-bold'
                  : 'text-[#dee3e7] font-medium hover:text-white'
              }`}
              style={
                activeNav === item
                  ? {
                      backgroundImage:
                        'linear-gradient(90deg, rgba(105,49,245,0.35) 0%, rgba(105,49,245,0.35) 100%), linear-gradient(107deg, rgba(56,78,231,0.15) 5.66%, rgba(30,191,245,0.15) 98.96%)',
                    }
                  : undefined
              }
            >
              <span className="font-satoshi">{item}</span>
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
                    border: '1px solid #6e48f2',
                    background: 'rgba(110,72,242,0.15)',
                  }
                : undefined
            }
          >
            <button
              type="button"
              onClick={onClick}
              aria-label={label}
              aria-pressed={active ?? undefined}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                active ? 'text-white' : 'text-[#dee3e7] hover:text-white'
              }`}
            >
              <Icon />
            </button>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
