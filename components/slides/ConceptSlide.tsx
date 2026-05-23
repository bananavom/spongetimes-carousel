import { COLORS } from '@/lib/tokens';
import type { CarouselDraft } from '@/lib/state/useCarouselDraft';
import { AnimatedImage } from './AnimatedImage';

export function ConceptSlide({ draft }: { draft: CarouselDraft }) {
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
      <div style={{ position: 'absolute', top: 60, left: 60, fontSize: 28, fontWeight: 600, color: COLORS.textSub }}>
        🍍 Week {String(draft.week).padStart(2, '0')} · 컨셉
      </div>

      <div style={{ position: 'absolute', top: 180, left: 60, right: 60, fontSize: 54, fontWeight: 700, lineHeight: 1.3, color: COLORS.text }}>
        {draft.concept_title1}
      </div>

      <div style={{ position: 'absolute', top: 280, left: 60, right: 60, fontSize: 54, fontWeight: 700, lineHeight: 1.3, color: COLORS.text }}>
        {draft.concept_title2}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 420,
          left: '50%',
          transform: 'translateX(-50%)',
          background: COLORS.accent,
          color: '#fff',
          padding: '24px 60px',
          borderRadius: 24,
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}
      >
        {draft.concept_emphasis}
      </div>

      {draft.concept_image && (
        <AnimatedImage
          src={draft.concept_image}
          x={draft.concept_imageX}
          y={draft.concept_imageY}
          size={draft.concept_imageSize}
          animation={draft.concept_imageAnimation}
          duration={draft.concept_imageDuration}
        />
      )}

      <div style={{ position: 'absolute', bottom: 200, left: 60, right: 60, fontSize: 40, fontWeight: 600, color: COLORS.text, textAlign: 'center', lineHeight: 1.5 }}>
        <p>{draft.concept_body1}</p>
        <p>{draft.concept_body2}</p>
      </div>

      <div style={{ position: 'absolute', bottom: 60, left: 60, fontSize: 24, color: COLORS.textSub }}>
        {draft.authorHandle}
      </div>
    </div>
  );
}
