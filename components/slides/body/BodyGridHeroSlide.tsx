import { COLORS, RADIUS, px } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';
import { PillLabel } from '../parts/PillLabel';

// GRID HERO · 인물·상황 4종 비교 — 2×2 카드 (옐로우 띠 + 다크 알약 태그)
export function BodyGridHeroContent({ slide }: { slide: BodySlide }) {
  const cards = slide.grid.slice(0, 4);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: px(12),
        height: '100%',
        marginTop: px(6),
      }}
    >
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            background: COLORS.cardWhite,
            borderRadius: RADIUS.card,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            opacity: c.on ? 1 : 0.35,
          }}
        >
          <div style={{ height: px(10), background: COLORS.cardYellow }} />
          <div style={{ padding: `${px(12)}px ${px(14)}px`, display: 'flex', flexDirection: 'column', gap: px(8) }}>
            <div>
              <PillLabel text={c.tag} color="dark" fontSize={px(10)} />
            </div>
            <div style={{ fontSize: px(13), fontWeight: 500, lineHeight: 1.4, color: COLORS.textPrimary }}>
              {c.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
