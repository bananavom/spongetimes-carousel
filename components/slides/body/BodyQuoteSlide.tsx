import { COLORS, px } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';
import { Highlighted } from '@/lib/utils/Highlighted';

// QUOTE · 멤버 어록 강조 — 큰 인용 + 출처 (+ 옵션 형광펜 강조)
export function BodyQuoteContent({ slide }: { slide: BodySlide }) {
  const { text, source, emphasis } = slide.quote;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontSize: px(23), fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.015em', whiteSpace: 'pre-line' }}>
        <span style={{ color: COLORS.mutedLow, fontFamily: 'Georgia, serif', fontSize: px(30), marginRight: px(4) }}>&ldquo;</span>
        <Highlighted text={text} highlight={emphasis.on ? emphasis.text : ''} fontSize={px(23)} />
      </div>
      <div style={{ marginTop: px(16), fontSize: px(13), fontWeight: 500, color: COLORS.mutedMid }}>
        {source}
      </div>
    </div>
  );
}
