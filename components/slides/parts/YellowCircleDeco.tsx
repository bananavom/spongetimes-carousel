import { COLORS } from '@/lib/tokens';
import type { CircleDeco } from '@/lib/state/bodySlide';
import { px } from '@/lib/tokens';

const DIAMETER: Record<CircleDeco['size'], number> = {
  sm: px(120),
  md: px(190),
  lg: px(270),
};

function placement(position: CircleDeco['position'], d: number): React.CSSProperties {
  const off = -d * 0.42;
  const midTop = (1350 - d) / 2;
  switch (position) {
    case 'top-left': return { left: off, top: off };
    case 'top-right': return { right: off, top: off };
    case 'center-left': return { left: off, top: midTop };
    case 'center-right': return { right: off, top: midTop };
    case 'bottom-left': return { left: off, bottom: off };
    case 'bottom-right': return { right: off, bottom: off };
    default: return { right: off, top: off };
  }
}

// 큰 노란 원 배경 데코 — 4 shape × 6 position × 3 size
export function YellowCircleDeco({ circle }: { circle: CircleDeco }) {
  if (!circle.on) return null;
  const d = DIAMETER[circle.size];
  const pos = placement(circle.position, d);
  const base: React.CSSProperties = { position: 'absolute', zIndex: 0, ...pos };

  if (circle.shape === 'dot') {
    const dot = d / 9;
    return (
      <div style={{ ...base, width: d, height: d, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: d / 6, placeItems: 'center' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ width: dot, height: dot, borderRadius: '50%', background: COLORS.cardYellow }} />
        ))}
      </div>
    );
  }

  if (circle.shape === 'curve') {
    return <div style={{ ...base, width: d, height: d, borderRadius: '50%', border: `${px(28)}px solid ${COLORS.cardYellow}`, background: 'transparent' }} />;
  }

  if (circle.shape === 'half') {
    return <div style={{ ...base, width: d, height: d / 2, background: COLORS.cardYellow, borderRadius: `${d}px ${d}px 0 0` }} />;
  }

  // circle
  return <div style={{ ...base, width: d, height: d, borderRadius: '50%', background: COLORS.cardYellow }} />;
}
