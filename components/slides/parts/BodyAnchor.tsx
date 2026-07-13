import { COLORS, px } from '@/lib/tokens';
import type { Pill } from '@/lib/state/bodySlide';
import { PillLabel } from './PillLabel';

const pad2 = (n: number) => String(n).padStart(2, '0');
const INSET = px(24);

// 본문 슬라이드 4코너 anchor
export function BodyAnchor({
  index,
  total,
  category,
  cornerPill,
  star,
}: {
  index: number;   // 1-based 본문 번호
  total: number;   // 본문 총 장수
  category: string;
  cornerPill: Pill;
  star: boolean;
}) {
  const cornerText: React.CSSProperties = {
    position: 'absolute',
    fontSize: px(9),
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: COLORS.mutedMid,
    zIndex: 2,
  };

  return (
    <>
      {/* 좌상단: #NN · CATEGORY */}
      <div style={{ ...cornerText, top: INSET, left: INSET }}>
        #{pad2(index)} · {category.toUpperCase()}
      </div>

      {/* 우상단: 알약 라벨 */}
      {cornerPill.on && (
        <div style={{ position: 'absolute', top: INSET - px(4), right: INSET, zIndex: 2 }}>
          <PillLabel text={cornerPill.text} color={cornerPill.color} fontSize={px(9)} />
        </div>
      )}

      {/* 좌하단: NN / total */}
      <div style={{ ...cornerText, bottom: INSET, left: INSET }}>
        {pad2(index)} / {pad2(total)}
      </div>

      {/* 우하단: ★ */}
      {star && (
        <div style={{ position: 'absolute', bottom: INSET - px(3), right: INSET, fontSize: px(12), color: COLORS.textPrimary, zIndex: 2 }}>
          ★
        </div>
      )}
    </>
  );
}
