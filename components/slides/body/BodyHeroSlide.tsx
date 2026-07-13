import { COLORS, px } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';

// HERO · 미션 진입 / 섹션 헤더 — 큰 헤딩(Host) + 짧은 본문
export function BodyHeroContent({ slide }: { slide: BodySlide }) {
  return (
    <div
      style={{
        fontSize: px(15),
        fontWeight: 400,
        lineHeight: 1.6,
        color: COLORS.mutedHigh,
        whiteSpace: 'pre-line',
        maxWidth: '78%',
        marginTop: px(8),
      }}
    >
      {slide.heroBody}
    </div>
  );
}
