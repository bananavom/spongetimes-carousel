import { COLORS } from '@/lib/tokens';
import type { CarouselDraft } from '@/lib/state/useCarouselDraft';
import { AnimatedImage } from './AnimatedImage';

export function WebsiteSlide({ draft }: { draft: CarouselDraft }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: COLORS.bodyBg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 60,
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.textSub,
        }}
      >
        🍍 Week {String(draft.week).padStart(2, '0')} · 웹사이트
      </div>

      <div style={{ position: 'absolute', top: 180, left: 60, right: 60 }}>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.3, color: COLORS.text, letterSpacing: '-0.02em', marginBottom: 16 }}>
          {draft.website_title1}
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.3, color: COLORS.accent, letterSpacing: '-0.02em', marginBottom: 16 }}>
          {draft.website_title2}
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.3, color: COLORS.text, letterSpacing: '-0.02em' }}>
          {draft.website_title3}
        </div>
      </div>

      {draft.website_image && (
        <AnimatedImage
          src={draft.website_image}
          x={draft.website_imageX}
          y={draft.website_imageY}
          size={draft.website_imageSize}
          animation={draft.website_imageAnimation}
          duration={draft.website_imageDuration}
        />
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: 60,
          right: 60,
          fontSize: 38,
          fontWeight: 500,
          lineHeight: 1.5,
          color: COLORS.textSub,
          whiteSpace: 'pre-line',
          textAlign: 'center',
        }}
      >
        {draft.website_subTitle}
      </div>

      <div style={{ position: 'absolute', bottom: 60, left: 60, fontSize: 24, color: COLORS.textSub }}>
        {draft.authorHandle}
      </div>
    </div>
  );
}
