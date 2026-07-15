import type { BodySlide } from '@/lib/state/bodySlide';
import type { ImageItem } from '@/lib/state/useCarouselDraft';
import { BodySlideHost } from './BodySlideHost';
import { BodyHeroContent } from './BodyHeroSlide';
import { BodyQuoteContent } from './BodyQuoteSlide';
import { BodyQuoteMultiContent } from './BodyQuoteMultiSlide';
import { BodyFlowContent } from './BodyFlowSlide';
import { BodySideProfileContent } from './BodySideProfileSlide';
import { BodyGridHeroContent } from './BodyGridHeroSlide';

export function BodySlideRenderer({
  slide,
  index,
  total,
  editable = false,
  onImageUpdate,
  containerScale,
}: {
  slide: BodySlide;
  index: number; // 1-based 본문 번호
  total: number; // 본문 총 장수
  editable?: boolean;
  onImageUpdate?: (imgId: string, patch: Partial<ImageItem>) => void;
  containerScale?: number;
}) {
  // SIDE_PROFILE 은 이미지를 자체 슬롯에 배치하므로 Host 자유 이미지 슬롯을 끔
  const skipImageSlot = slide.template === 'SIDE_PROFILE';

  return (
    <BodySlideHost
      slide={slide}
      index={index}
      total={total}
      editable={editable}
      onImageUpdate={onImageUpdate}
      containerScale={containerScale}
      skipImageSlot={skipImageSlot}
    >
      {slide.template === 'HERO' && <BodyHeroContent slide={slide} />}
      {slide.template === 'QUOTE' && <BodyQuoteContent slide={slide} />}
      {slide.template === 'QUOTE_MULTI' && <BodyQuoteMultiContent slide={slide} />}
      {slide.template === 'FLOW' && <BodyFlowContent slide={slide} />}
      {slide.template === 'SIDE_PROFILE' && <BodySideProfileContent slide={slide} />}
      {slide.template === 'GRID_HERO' && <BodyGridHeroContent slide={slide} />}
    </BodySlideHost>
  );
}
