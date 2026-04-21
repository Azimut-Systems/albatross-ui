import { memo } from 'react';

type FieldProps = {
  label: string;
  value: string;
  /**
   * `compact` — tight 2-column field with border (TargetCard).
   * `roomy` — taller field w/o border, for the camera card.
   */
  variant?: 'compact' | 'roomy';
};

/**
 * Labeled value block (uppercase label above value). One of the most-repeated
 * patterns in the cards — consolidated here so typography and background
 * changes happen in one place.
 */
function Field({ label, value, variant = 'compact' }: FieldProps) {
  if (variant === 'roomy') {
    return (
      <div className="flex-1 flex flex-col items-start bg-[var(--surface-accent-subtle)] border-shadow rounded-xl px-3 py-4 min-w-0">
        <span className="font-ibm-plex-sans font-normal text-xs text-[var(--accent-muted)]">
          {label}
        </span>
        <span className="font-ibm-plex-sans font-medium text-sm text-white truncate w-full tabular-nums">
          {value}
        </span>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col gap-1 items-start bg-[var(--surface-accent-soft)] border-shadow rounded-lg px-3 py-2.5 min-w-0">
      <span
        className="font-ibm-plex-sans font-normal text-[11px] tracking-wide uppercase"
        style={{ color: 'var(--accent-muted)' }}
      >
        {label}
      </span>
      <span className="font-ibm-plex-sans font-medium text-sm text-white truncate w-full tabular-nums">
        {value}
      </span>
    </div>
  );
}

export default memo(Field);
