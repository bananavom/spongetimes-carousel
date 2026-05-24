import { COLORS } from '@/lib/tokens';
import type { CarouselDraft } from '@/lib/state/useCarouselDraft';
import { MultiImages, DraggableMultiImages } from './AnimatedImage';
import type { ImageItem } from '@/lib/state/useCarouselDraft';

export function HeroSlide({ 
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
        🍍 Week {String(draft.week).padStart(2, '0')} · {draft.hero_name}
      </div>
      <div style={{ position: 'absolute', top: 200, left: 60, right: 60, fontSize: 80, fontWeight: 800, lineHeight: 1.2, color: COLORS.text, letterSpacing: '-0.03em', whiteSpace: 'pre-line' }}>
        {draft.hero_mainText}
      </div>
      {editable && onImageUpdate ? (
        <DraggableMultiImages images={draft.hero_images} onUpdate={onImageUpdate} containerScale={containerScale} />
      ) : (
        <MultiImages images={draft.hero_images} />
      )}
      <div style={{ position: 'absolute', bottom: 200, left: 60, right: 60, fontSize: 42, fontWeight: 500, color: COLORS.text, letterSpacing: '-0.02em', whiteSpace: 'pre-line', textAlign: 'center' }}>
        {draft.hero_subText}
      </div>
      <div style={{ position: 'absolute', bottom: 60, left: 60, fontSize: 24, color: COLORS.textSub }}>
        {draft.authorHandle}
      </div>
    </div>
  );
}
