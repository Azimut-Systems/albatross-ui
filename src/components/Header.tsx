import type { ComponentType } from 'react';
import GlassPanel from './GlassPanel';
import { BellIcon, CameraIcon, TargetRadarIcon } from './icons';
import type { IconProps } from './icons';
import { useNav, type NavItem } from '../contexts/useNav';

const navItems: readonly NavItem[] = ['Map', 'Archive', 'Fleet', 'Settings'] as const;

export default function Header() {
  const {
    activeNav,
    setActiveNav,
    targetsOpen,
    toggleTargets,
    camerasOpen,
    toggleCameras,
  } = useNav();

  const utilityButtons: Array<{
    Icon: ComponentType<IconProps>;
    label: string;
    active?: boolean;
    onClick?: () => void;
  }> = [
    {
      Icon: TargetRadarIcon,
      label: 'Toggle targets list',
      active: targetsOpen,
      onClick: toggleTargets,
    },
    {
      Icon: CameraIcon,
      label: 'Toggle cameras list',
      active: camerasOpen,
      onClick: toggleCameras,
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
              onClick={() => setActiveNav(item)}
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
