import { COLORS, RADIUS, px } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';

// SIDE PROFILE · 좌측 리스트 + 우측 이미지 슬롯 (이미지는 이 템플릿이 직접 배치)
export function BodySideProfileContent({ slide }: { slide: BodySlide }) {
  const items = slide.side.filter((s) => s.on);
  const img = slide.image.on ? slide.image.item : null;
  return (
    <div style={{ display: 'flex', gap: px(14), height: '100%', marginTop: px(6) }}>
      {/* 좌측 리스트 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: px(10) }}>
        {items.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: px(10),
              background: COLORS.cardWhite,
              borderRadius: RADIUS.smallCard,
              padding: `${px(12)}px ${px(14)}px`,
              fontSize: px(14),
              fontWeight: 500,
            }}
          >
            <span style={{ width: px(10), height: px(10), borderRadius: '50%', background: COLORS.cardYellow, flexShrink: 0 }} />
            {s.text}
          </div>
        ))}
      </div>

      {/* 우측 이미지 슬롯 */}
      <div
        style={{
          width: '40%',
          alignSelf: 'stretch',
          borderRadius: RADIUS.card,
          overflow: 'hidden',
          background: COLORS.cardWhite,
          border: img ? 'none' : `${px(2)}px dashed ${COLORS.mutedLow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {img ? (
          <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: px(11), color: COLORS.mutedMid }}>이미지 영역</span>
        )}
      </div>
    </div>
  );
}
