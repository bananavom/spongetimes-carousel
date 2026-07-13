import { COLORS, RADIUS, px } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';

// QUOTE MULTI · 어록 묶음 (3~5명) — 세로 인용 카드 N개
export function BodyQuoteMultiContent({ slide }: { slide: BodySlide }) {
  const items = slide.quoteMulti.filter((q) => q.on);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: px(12), marginTop: px(6) }}>
      {items.map((q, i) => (
        <div
          key={i}
          style={{
            background: COLORS.cardWhite,
            borderRadius: RADIUS.card,
            padding: `${px(14)}px ${px(16)}px`,
          }}
        >
          <div style={{ fontSize: px(14), fontWeight: 500, lineHeight: 1.45, whiteSpace: 'pre-line' }}>
            {q.text}
          </div>
          <div style={{ marginTop: px(6), fontSize: px(11), fontWeight: 500, color: COLORS.mutedMid }}>
            {q.source}
          </div>
        </div>
      ))}
    </div>
  );
}
