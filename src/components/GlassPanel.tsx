import LiquidGlass from 'liquid-glass-react';
import { useEffect } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { useUISize } from '../contexts/UISizeContext';

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

/**
 * LiquidGlass measures itself with getBoundingClientRect() on mount; under an
 * ancestor `zoom`, those values are scaled and the baked SVG filter ends up
 * smaller than the layout box. We cancel the ancestor zoom on the wrapper so
 * LiquidGlass measures in an effective-zoom-1 context, then re-apply the zoom
 * on the inner content (padding included) so the panel still scales visually.
 */
export default function GlassPanel({
  children,
  cornerRadius = 16,
  padding = '8px',
  style,
  className = '',
}: GlassPanelProps) {
  const { scale } = useUISize();

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [scale]);

  return (
    <div
      className={`glass-wrapper ${className}`}
      style={{ zoom: 1 / scale } as CSSProperties}
    >
      <LiquidGlass
        displacementScale={70}
        blurAmount={0.1}
        saturation={140}
        elasticity={0}
        cornerRadius={cornerRadius}
        padding="0px"
        style={{
          background: 'rgb(var(--accent-rgb)/0.075)',
          borderRadius: cornerRadius,
          ...style,
        }}
      >
        <div style={{ zoom: scale, padding } as CSSProperties}>{children}</div>
      </LiquidGlass>
    </div>
  );
}
