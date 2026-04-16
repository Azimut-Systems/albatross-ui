import LiquidGlass from 'liquid-glass-react';
import type { ReactNode, CSSProperties } from 'react';

type GlassPanelProps = {
  children: ReactNode;
  /** Corner radius in px (default: 16) */
  cornerRadius?: number;
  /** Inner padding CSS value (default: '8px') */
  padding?: string;
  /** Additional inline styles on the glass element */
  style?: CSSProperties;
  /** Additional class on the outer wrapper */
  className?: string;
};

export default function GlassPanel({
  children,
  cornerRadius = 16,
  padding = '8px',
  style,
  className = '',
}: GlassPanelProps) {
  return (
    <div className={`glass-wrapper ${className}`}>
      <LiquidGlass
        displacementScale={70}
        blurAmount={0.1}
        saturation={140}
        elasticity={0}
        cornerRadius={cornerRadius}
        padding={padding}
        style={{
          background: 'rgba(105,49,245,0.075)',
          borderRadius: cornerRadius,
          ...style,
        }}
      >
        {children}
      </LiquidGlass>
    </div>
  );
}
