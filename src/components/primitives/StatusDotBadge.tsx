import { memo } from 'react';
import type { BadgeTone } from '../../design/tokens';

type StatusDotBadgeProps = {
  label: string;
  tone: BadgeTone;
};

/**
 * Compact pill with a leading colored dot — used for target statuses in the
 * target card header (distinct from the bordered list-item Badge).
 */
function StatusDotBadge({ label, tone }: StatusDotBadgeProps) {
  return (
    <div
      className="inline-flex h-[18px] items-center gap-1.5 px-2 rounded-full"
      style={{ backgroundColor: tone.bg }}
    >
      <span
        className="inline-block size-1.5 rounded-full"
        style={{ backgroundColor: tone.text }}
      />
      <span
        className="font-ibm-plex-sans font-semibold text-[10px] leading-none tracking-wide uppercase"
        style={{ color: tone.text }}
      >
        {label}
      </span>
    </div>
  );
}

export default memo(StatusDotBadge);
