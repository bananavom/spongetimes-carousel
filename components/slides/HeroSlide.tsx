import { COLORS } from '@/lib/tokens';
import type { CarouselDraft } from '@/lib/state/useCarouselDraft';
import { AnimatedImage } from './AnimatedImage';

export function HeroSlide({ draft }: { draft: CarouselDraft }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: COLORS.coverBg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      }}
    >
      {/* 상단 헤더 태그 */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 60,
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.textSub,
          letterSpacing: '-0.02em',
        }}
      >
        🍍 Week {String(draft.week).padStart(2, '0')} · {draft.topic}
      </div>

      {/* 메인 텍스트 */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 60,
          right: 60,
          fontSize: 80,
          fontWeight: 800,
          lineHeight: 1.2,
          color: COLORS.text,
          letterSpacing: '-0.03em',
          whiteSpace: 'pre-line',
        }}
      >
        {draft.hero_mainText}
      </div>

      {/* 이미지 */}
      {draft.hero_image && (
        <AnimatedImage
          src={draft.hero_image}
          x={draft.hero_imageX}
          y={draft.hero_imageY}
          size={draft.hero_imageSize}
          animation={draft.hero_imageAnimation}
          duration={draft.hero_imageDuration}
        />
      )}

      {/* 서브 텍스트 */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: 60,
          right: 60,
          fontSize: 42,
          fontWeight: 500,
          color: COLORS.text,
          letterSpacing: '-0.02em',
          whiteSpace: 'pre-line',
          textAlign: 'center',
        }}
      >
        {draft.hero_subText}
      </div>

      {/* 핸들 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 60,
          fontSize: 24,
          color: COLORS.textSub,
        }}
      >
        {draft.authorHandle}
      </div>
    </div>
  );
}
