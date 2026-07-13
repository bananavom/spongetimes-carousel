import { COLORS, px } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';
import { PillLabel } from './PillLabel';

// 헤딩 블록: (옵션)알약 → 헤딩 → (옵션)부캡션
export function BodyHeading({ slide }: { slide: BodySlide }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {slide.headingPill.on && (
        <div style={{ marginBottom: px(8) }}>
          <PillLabel text={slide.headingPill.text} color={slide.headingPill.color} fontSize={px(11)} />
        </div>
      )}
      <div
        style={{
          fontSize: px(30),
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: COLORS.textPrimary,
          whiteSpace: 'pre-line',
        }}
      >
        {slide.heading}
      </div>
      {slide.subcaption.on && (
        <div style={{ marginTop: px(8), fontSize: px(12), fontWeight: 500, color: COLORS.mutedMid, whiteSpace: 'pre-line' }}>
          {slide.subcaption.text}
        </div>
      )}
    </div>
  );
}
