import type { ReactNode, CSSProperties } from 'react';
import GlassPanel from './GlassPanel';

type CardPanelProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Preset GlassPanel sized for full-height side cards (targets list, target
 * detail, cameras list, camera detail). Change padding/radius here once and
 * every full-height card updates.
 */
export default function CardPanel({ children, className, style }: CardPanelProps) {
  return (
    <GlassPanel cornerRadius={24} padding="24px" className={className} style={style}>
      {children}
    </GlassPanel>
  );
}
