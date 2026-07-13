import { COLORS, RADIUS, px } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';

// FLOW · 단계/노하우 (1→2→3) — 번호 배지 + 인물 + 한 마디
export function BodyFlowContent({ slide }: { slide: BodySlide }) {
  const items = slide.flow.filter((f) => f.on);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: px(12), marginTop: px(6) }}>
      {items.map((f, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: px(14),
            background: COLORS.cardWhite,
            borderRadius: RADIUS.card,
            padding: `${px(12)}px ${px(14)}px`,
          }}
        >
          <div
            style={{
              width: px(34),
              height: px(34),
              flexShrink: 0,
              borderRadius: '50%',
              background: COLORS.cardYellow,
              color: COLORS.textPrimary,
              fontSize: px(15),
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {i + 1}
          </div>
          <div>
            <div style={{ fontSize: px(14), fontWeight: 700 }}>{f.person}</div>
            <div style={{ fontSize: px(12), fontWeight: 400, color: COLORS.mutedHigh, marginTop: px(2) }}>{f.line}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
