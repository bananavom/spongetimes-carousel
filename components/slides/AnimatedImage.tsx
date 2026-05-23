import type { ImageItem } from '@/lib/state/useCarouselDraft';

export function AnimatedImage({ image }: { image: ImageItem }) {
  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    left: image.x,
    top: image.y,
    width: image.size,
    height: image.size,
    objectFit: 'contain',
    transform: 'translate(-50%, -50%)',
    animation: image.animation !== 'none' 
      ? `${image.animation} ${image.duration}s ease-in-out infinite` 
      : undefined,
  };

  // 영상인 경우
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

  // 이미지인 경우 (기본)
  return (
    <img
      src={image.src}
      alt=""
      style={commonStyle}
    />
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
