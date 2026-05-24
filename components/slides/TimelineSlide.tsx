import { COLORS } from '@/lib/tokens';
import type { CarouselDraft, ImageItem } from '@/lib/state/useCarouselDraft';
import { MultiImages, DraggableMultiImages } from './AnimatedImage';

export function TimelineSlide({ 
  draft, 
  editable = false,
  onImageUpdate,
  containerScale,
}: { 
  draft: CarouselDraft;
  editable?: boolean;
  onImageUpdate?: (id: string, updates: Partial<ImageItem>) => void;
  containerScale?: number;
}) {
  return (
    <div style={{ width: 1080, height: 1350, background: COLORS.bodyBg, position: 'relative', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      <div style={{ position: 'absolute', top: 60, left: 60, fontSize: 28, fontWeight: 600, color: COLORS.textSub }}>
        🍍 Week {String(draft.week).padStart(2, '0')} · {draft.timeline_name}
      </div>
      <div style={{ position: 'absolute', top: 180, left: 60, right: 60, fontSize: 58, fontWeight: 700, lineHeight: 1.3, color: COLORS.text, textAlign: 'center' }}>
        {draft.timeline_title}
      </div>
      {editable && onImageUpdate ? (
        <DraggableMultiImages images={draft.timeline_images} onUpdate={onImageUpdate} containerScale={containerScale} />
      ) : (
        <MultiImages images={draft.timeline_images} />
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
