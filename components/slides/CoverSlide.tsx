import { COLORS, FONT_FAMILY, RADIUS, px } from '@/lib/tokens';
import type { CarouselDraft, ImageItem } from '@/lib/state/useCarouselDraft';
import { MultiImages, DraggableMultiImages } from './AnimatedImage';
import { Highlighted } from '@/lib/utils/Highlighted';

const PADX = Math.round(1080 * 0.07);   // 좌우 7%
const PADTOP = Math.round(1350 * 0.06); // 상단 6%
const PADBOT = Math.round(1350 * 0.05); // 하단 5%

// 밝은 노란색 코너 1/4 원 데코 (우상단·좌하단)
const DECO_COLOR = '#FFF3AE';
const DECO_D = 640; // 지름 (중심을 코너에 두어 정확히 1/4만 노출)

export function CoverSlide({
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
  const volume = String(draft.volume).padStart(2, '0');

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: COLORS.coverBg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
        color: COLORS.textPrimary,
      }}
    >
      {/* 코너 1/4 원 데코 (밝은 노란색) — 우상단 · 좌하단 */}
      <div style={{ position: 'absolute', top: -DECO_D / 2, right: -DECO_D / 2, width: DECO_D, height: DECO_D, borderRadius: '50%', background: DECO_COLOR, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -DECO_D / 2, left: -DECO_D / 2, width: DECO_D, height: DECO_D, borderRadius: '50%', background: DECO_COLOR, zIndex: 0 }} />

      {/* 헤더 */}
      <div
        style={{
          position: 'absolute',
          top: PADTOP,
          left: PADX,
          right: PADX,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: px(10),
          fontWeight: 500,
          color: COLORS.mutedLow,
          zIndex: 1,
        }}
      >
        <span style={{ letterSpacing: '0.15em' }}>SPONGE TIMES</span>
        <span style={{ letterSpacing: '0.05em' }}>VOL.{volume} / {draft.year}</span>
      </div>

      {/* 라벨 (다크 알약) */}
      <div style={{ position: 'absolute', top: PADTOP + px(40), left: PADX, zIndex: 1 }}>
        <span
          style={{
            display: 'inline-block',
            background: COLORS.cardDark,
            color: COLORS.textOnDark,
            fontSize: px(15),
            fontWeight: 600,
            letterSpacing: '0.01em',
            padding: `${px(9)}px ${px(20)}px`,
            borderRadius: RADIUS.pill,
          }}
        >
          Week {draft.week} · {draft.contentType}
        </span>
      </div>

      {/* 메인 타이틀 (좌측 정렬 + 오렌지 형광펜) */}
      <div
        style={{
          position: 'absolute',
          top: Math.round(1350 * 0.30),
          left: PADX,
          right: PADX,
          fontSize: px(40),
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
          textAlign: 'left',
          zIndex: 1,
        }}
      >
        <Highlighted text={draft.cover_mainTitle} highlight={draft.cover_highlight} fontSize={px(40)} />
      </div>

      {/* 캐릭터 (우하단, 업로드) */}
      {editable && onImageUpdate ? (
        <DraggableMultiImages images={draft.cover_images} onUpdate={onImageUpdate} containerScale={containerScale} />
      ) : (
        <MultiImages images={draft.cover_images} />
      )}

      {/* 푸터 */}
      <div
        style={{
          position: 'absolute',
          bottom: PADBOT,
          left: PADX,
          right: PADX,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: px(10),
          fontWeight: 500,
          color: COLORS.mutedLow,
          zIndex: 1,
        }}
      >
        <span>@spongeclub</span>
        <span>by {draft.publisher}</span>
      </div>
    </div>
  );
}
