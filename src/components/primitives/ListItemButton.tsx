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
      className={`flex flex-col gap-5 p-4 rounded-xl w-full text-left cursor-pointer transition-colors ${
        active
          ? 'bg-[var(--surface-accent-strong)] border border-[var(--border-accent)]'
          : 'bg-[var(--surface-accent-subtle)] border border-transparent hover:bg-[var(--surface-accent-medium)]'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
