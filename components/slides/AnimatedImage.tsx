import type { ImageItem } from '@/lib/state/useCarouselDraft';

export function AnimatedImage({ image }: { image: ImageItem }) {
  return (
    <img
      src={image.src}
      alt=""
      style={{
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
      }}
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
