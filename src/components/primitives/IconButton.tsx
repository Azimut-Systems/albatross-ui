import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
  label: string;
};

/**
 * Standard icon-only button. Inherits color from parent via `currentColor`.
 * Always requires `label` for accessibility (becomes aria-label).
 */
function IconButton({
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
      className={`relative flex items-center justify-center p-1 rounded cursor-pointer hover:bg-[var(--hover-overlay)] active:scale-[0.96] before:absolute before:inset-[-8px] before:content-[''] ${className}`}
      style={{
        transitionProperty: 'background-color, scale',
        transitionDuration: '140ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default memo(IconButton);
