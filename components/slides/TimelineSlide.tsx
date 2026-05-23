import { COLORS } from '@/lib/tokens';
import type { CarouselDraft } from '@/lib/state/useCarouselDraft';
import { AnimatedImage } from './AnimatedImage';

export function TimelineSlide({ draft }: { draft: CarouselDraft }) {
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
        🍍 Week {String(draft.week).padStart(2, '0')} · 타임라인
      </div>

      <div style={{ position: 'absolute', top: 180, left: 60, right: 60, fontSize: 58, fontWeight: 700, lineHeight: 1.3, color: COLORS.text, textAlign: 'center' }}>
        {draft.timeline_title}
      </div>

      {draft.timeline_image && (
        <AnimatedImage
          src={draft.timeline_image}
          x={draft.timeline_imageX}
          y={draft.timeline_imageY}
          size={draft.timeline_imageSize}
          animation={draft.timeline_imageAnimation}
          duration={draft.timeline_imageDuration}
        />
      )}

      <div style={{ position: 'absolute', bottom: 250, left: 60, right: 60, fontSize: 48, fontWeight: 700, color: COLORS.accent, textAlign: 'center' }}>
        {draft.timeline_subtitle}
      </div>

      <div style={{ position: 'absolute', bottom: 150, left: 60, right: 60, fontSize: 36, fontWeight: 500, color: COLORS.textSub, textAlign: 'center' }}>
        {draft.timeline_description}
      </div>

      <div style={{ position: 'absolute', bottom: 60, left: 60, fontSize: 24, color: COLORS.textSub }}>
        {draft.authorHandle}
      </div>
    </div>
  );
}
