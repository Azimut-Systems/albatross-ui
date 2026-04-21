import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
  label: string;
};

/**
 * Standard icon-only button. Inherits color from parent via `currentColor`.
 * Always requires `label` for accessibility (becomes aria-label).
 */
export default function IconButton({
  children,
  label,
  className = '',
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`flex items-center justify-center p-1 rounded cursor-pointer hover:bg-[var(--hover-overlay)] transition-colors ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
