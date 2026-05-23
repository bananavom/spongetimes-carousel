import { COLORS } from '@/lib/tokens';
import type { CarouselDraft } from '@/lib/state/useCarouselDraft';
import { MultiImages } from './AnimatedImage';

export function TeamSlide({ draft }: { draft: CarouselDraft }) {
  return (
    <div style={{ width: 1080, height: 1350, background: COLORS.bodyBg, position: 'relative', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      <div style={{ position: 'absolute', top: 60, left: 60, fontSize: 28, fontWeight: 600, color: COLORS.textSub }}>
        🍍 Week {String(draft.week).padStart(2, '0')} · {draft.team_name}
      </div>
      <div style={{ position: 'absolute', top: 180, left: 60, right: 60, fontSize: 56, fontWeight: 700, lineHeight: 1.3, color: COLORS.text, letterSpacing: '-0.02em' }}>
        {draft.team_title1}
      </div>
      <div style={{ position: 'absolute', top: 280, left: 60, right: 60, fontSize: 56, fontWeight: 700, lineHeight: 1.3, color: COLORS.text, letterSpacing: '-0.02em' }}>
        {draft.team_title2}
      </div>
      <MultiImages images={draft.team_images} />
      <div style={{ position: 'absolute', bottom: 150, left: 60, right: 60, fontSize: 36, fontWeight: 500, lineHeight: 1.5, color: COLORS.textSub, whiteSpace: 'pre-line', textAlign: 'center' }}>
        {draft.team_description}
      </div>
      <div style={{ position: 'absolute', bottom: 60, left: 60, fontSize: 24, color: COLORS.textSub }}>
        {draft.authorHandle}
      </div>
    </div>
  );
}
