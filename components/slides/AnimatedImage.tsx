'use client';

import type { ImageItem } from '@/lib/state/useCarouselDraft';
import { DraggableBox } from './DraggableBox';
import { useSelection } from '@/lib/state/SelectionContext';

// 정적 렌더링 (PNG 캡처용 - 드래그 없음)
export function AnimatedImage({ image }: { image: ImageItem }) {
  const aspect = image.aspect || 1;
  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    left: image.x,
    top: image.y,
    width: image.size,
    height: image.size / aspect,
    objectFit: 'contain',
    transform: 'translate(-50%, -50%)',
    animation: image.animation !== 'none' 
      ? `${image.animation} ${image.duration}s ease-in-out infinite` 
      : undefined,
  };

  if (image.type === 'video') {
    return (
      <video
        src={image.src}
        style={commonStyle}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <img src={image.src} alt="" style={commonStyle} />
  );
}

export function MultiImages({ images }: { images: ImageItem[] }) {
  return (
    <>
      {images.map((img) => (
        <AnimatedImage key={img.id} image={img} />
      ))}
    </>
  );
}

// 드래그 가능한 이미지 (편집용)
export function DraggableImage({ 
  image, 
  onUpdate,
  containerScale = 0.37,
}: { 
  image: ImageItem;
  onUpdate: (updates: Partial<ImageItem>) => void;
  containerScale?: number;
}) {
  const { selectedId, setSelectedId } = useSelection();
  const selected = selectedId === image.id;
  const aspect = image.aspect || 1;

  const innerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    animation: image.animation !== 'none'
      ? `${image.animation} ${image.duration}s ease-in-out infinite`
      : undefined,
    pointerEvents: 'none',
  };

  return (
    <DraggableBox
      x={image.x}
      y={image.y}
      width={image.size}
      height={image.size / aspect}
      aspectRatio={aspect}
      containerWidth={1080}
      containerHeight={1350}
      containerScale={containerScale}
      selected={selected}
      onSelect={() => setSelectedId(image.id)}
      onChange={(updates) => {
        const newUpdates: Partial<ImageItem> = {};
        if (updates.x !== undefined) newUpdates.x = updates.x;
        if (updates.y !== undefined) newUpdates.y = updates.y;
        if (updates.width !== undefined) newUpdates.size = updates.width;
        onUpdate(newUpdates);
      }}
    >
      {image.type === 'video' ? (
        <video src={image.src} style={innerStyle} autoPlay loop muted playsInline />
      ) : (
        <img src={image.src} alt="" style={innerStyle} draggable={false} />
      )}
    </DraggableBox>
  );
}

export function DraggableMultiImages({ 
  images, 
  onUpdate,
  containerScale,
}: { 
  images: ImageItem[];
  onUpdate: (id: string, updates: Partial<ImageItem>) => void;
  containerScale?: number;
}) {
  return (
    <>
      {images.map((img) => (
        <DraggableImage 
          key={img.id} 
          image={img} 
          onUpdate={(updates) => onUpdate(img.id, updates)}
          containerScale={containerScale}
        />
      ))}
    </>
  );
}
