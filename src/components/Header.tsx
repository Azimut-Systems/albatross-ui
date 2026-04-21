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
          {navItems.map((item) => {
            const active = activeNav === item;
            const baseStyle = {
              borderRadius: 'var(--glass-inner-radius)',
              transitionProperty: 'color, background-color, scale',
              transitionDuration: '160ms',
              transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
            } as React.CSSProperties;
            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                aria-pressed={active}
                className={`flex items-center px-[14px] py-[14px] text-sm tracking-[0.25px] cursor-pointer active:scale-[0.96] ${
                  active ? 'font-bold' : 'font-medium'
                }`}
                style={
                  active
                    ? {
                        ...baseStyle,
                        color: 'var(--accent-active-fg)',
                        backgroundImage:
                          'linear-gradient(90deg, rgb(var(--accent-rgb) / 0.35) 0%, rgb(var(--accent-rgb) / 0.35) 100%), linear-gradient(107deg, rgba(56,78,231,0.15) 5.66%, rgba(30,191,245,0.15) 98.96%)',
                      }
                    : { ...baseStyle, color: 'var(--accent-muted)' }
                }
              >
                <span className="font-ibm-plex-sans">{item}</span>
              </button>
            );
          })}
        </div>
      </GlassPanel>

      {/* Right: Utility Buttons */}
      <div className="flex items-center gap-2">
        {utilityButtons.map(({ Icon, label, active, onClick }) => (
          <GlassPanel key={label}>
            <button
              type="button"
              onClick={onClick}
              aria-label={label}
              aria-pressed={active ?? undefined}
              className="flex items-center p-3 cursor-pointer active:scale-[0.96]"
              style={{
                borderRadius: 'var(--glass-inner-radius)',
                color: active ? 'var(--accent-active-fg)' : 'var(--accent-muted)',
                backgroundColor: active
                  ? 'rgb(var(--accent-rgb) / 0.2)'
                  : 'transparent',
                boxShadow: active
                  ? 'inset 0 0 0 1px var(--accent)'
                  : 'inset 0 0 0 1px transparent',
                transitionProperty: 'color, background-color, box-shadow, scale',
                transitionDuration: '220ms',
                transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
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
