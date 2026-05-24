import { COLORS } from '@/lib/tokens';
import type { CarouselDraft, ImageItem } from '@/lib/state/useCarouselDraft';
import { MultiImages, DraggableMultiImages } from './AnimatedImage';

export function OutroSlide({ 
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
    <div style={{ width: 1080, height: 1350, background: COLORS.coverBg, position: 'relative', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      <div style={{ position: 'absolute', top: 60, left: 60, fontSize: 28, fontWeight: 600, color: COLORS.textSub }}>
        🍍 Week {String(draft.week).padStart(2, '0')} · {draft.outro_name}
      </div>
      <div style={{ position: 'absolute', top: 200, left: 60, right: 60, fontSize: 72, fontWeight: 800, color: COLORS.text, textAlign: 'center', letterSpacing: '-0.03em' }}>
        {draft.outro_mainText}
      </div>
      {editable && onImageUpdate ? (
        <DraggableMultiImages images={draft.outro_images} onUpdate={onImageUpdate} containerScale={containerScale} />
      ) : (
        <MultiImages images={draft.outro_images} />
      )}
      <div style={{ position: 'absolute', bottom: 300, left: 60, right: 60, fontSize: 44, fontWeight: 700, color: COLORS.text, textAlign: 'center' }}>
        {draft.outro_body1}
      </div>
      <div style={{ position: 'absolute', bottom: 230, left: 60, right: 60, fontSize: 36, fontWeight: 500, color: COLORS.textSub, textAlign: 'center' }}>
        {draft.outro_body2}
      </div>
      <div style={{ position: 'absolute', bottom: 110, left: 60, right: 60, fontSize: 32, fontWeight: 500, color: COLORS.textSub, textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
        {draft.outro_body3}
      </div>
      <div style={{ position: 'absolute', bottom: 30, left: 60, fontSize: 24, color: COLORS.textSub }}>
        {draft.authorHandle}
      </div>
    </div>
  );
}
