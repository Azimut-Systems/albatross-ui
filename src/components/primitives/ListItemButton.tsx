import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ListItemButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
  active: boolean;
};

/**
 * Tappable list-item card used in TargetsList / CamerasList.
 * Active state is uniform across both.
 */
export default function ListItemButton({
  children,
  active,
  className = '',
  type = 'button',
  ...rest
}: ListItemButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={`flex flex-col gap-5 p-4 rounded-xl w-full text-left cursor-pointer active:scale-[0.96] ${
        active
          ? 'bg-[var(--surface-accent-strong)] border border-[var(--border-accent)]'
          : 'bg-[var(--surface-accent-subtle)] border-shadow border border-transparent hover:bg-[var(--surface-accent-medium)]'
      } ${className}`}
      style={{
        transitionProperty: 'background-color, border-color, scale',
        transitionDuration: '180ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
