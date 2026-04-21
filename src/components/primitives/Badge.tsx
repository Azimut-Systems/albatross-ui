import type { BadgeTone } from '../../design/tokens';

type BadgeProps = {
  label: string;
  tone: BadgeTone;
  /** 'solid' shows border (default); 'soft' omits it */
  variant?: 'solid' | 'soft';
};

/**
 * Label chip colored by a semantic tone. Never accept raw colors — always a
 * tone from `design/tokens.ts`, so a palette change propagates everywhere.
 */
export default function Badge({ label, tone, variant = 'solid' }: BadgeProps) {
  const showBorder = variant === 'solid';
  return (
    <div
      className={`flex h-5 items-center px-2 rounded-[34px] ${showBorder ? 'border' : ''}`}
      style={{
        borderColor: showBorder ? tone.border : undefined,
        backgroundColor: tone.bg,
      }}
    >
      <span
        className="font-ibm-plex-sans font-medium text-xs leading-none"
        style={{ color: tone.text }}
      >
        {label}
      </span>
    </div>
  );
}
