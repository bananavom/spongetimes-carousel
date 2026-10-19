import { ReactNode } from 'react';
import { COLORS, FONT_FAMILY, px } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';
import type { ImageItem } from '@/lib/state/useCarouselDraft';
import { YellowCircleDeco } from '../parts/YellowCircleDeco';
import { BodyAnchor } from '../parts/BodyAnchor';
import { BodyHeading } from '../parts/BodyHeading';
import { MultiImages, DraggableMultiImages } from '../AnimatedImage';

const CONTENT_X = px(28);
const CONTENT_TOP = px(42);
const CONTENT_BOT = px(42);

// 본문 공통 래퍼: 배경 + 노란 원 데코 + 4코너 anchor + 헤딩 + 이미지 슬롯 + 템플릿 children
export function BodySlideHost({
  slide,
  index,
  total,
  editable = false,
  onImageUpdate,
  containerScale,
  skipImageSlot = false,
  children,
}: {
  slide: BodySlide;
  index: number;
  total: number;
  editable?: boolean;
  onImageUpdate?: (imgId: string, patch: Partial<ImageItem>) => void;
  containerScale?: number;
  skipImageSlot?: boolean; // SIDE_PROFILE 등 템플릿이 이미지를 직접 배치할 때
  children?: ReactNode;
}) {
  const showImages = !skipImageSlot && slide.images.length > 0;

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: COLORS.bodyBg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
        color: COLORS.textPrimary,
        wordBreak: 'keep-all', // 한국어 어절 단위 줄바꿈 (상속됨)
      }}
    >
      <YellowCircleDeco circle={slide.circle} />

      {/* 콘텐츠 영역 */}
      <div
        style={{
          position: 'absolute',
          top: CONTENT_TOP,
          bottom: CONTENT_BOT,
          left: CONTENT_X,
          right: CONTENT_X,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BodyHeading slide={slide} />
        <div style={{ flex: 1, marginTop: px(16), position: 'relative' }}>{children}</div>
      </div>

      <BodyAnchor
        index={index}
        total={total}
        category={slide.category}
        cornerPill={slide.cornerPill}
        star={slide.star}
      />

      {/* 자유 이미지/영상 슬롯 (멀티, 드래그) */}
      {showImages && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          {editable && onImageUpdate ? (
            <DraggableMultiImages images={slide.images} onUpdate={onImageUpdate} containerScale={containerScale} />
          ) : (
            <MultiImages images={slide.images} />
          )}
        </div>
      )}
    </div>
  );
}
