import type { AnimationType } from '@/lib/tokens';

export function AnimatedImage({
  src,
  x,
  y,
  size,
  animation,
  duration,
}: {
  src: string;
  x: number;
  y: number;
  size: number;
  animation: AnimationType;
  duration: number;
}) {
  return (
    <img
      src={src}
      alt=""
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        objectFit: 'contain',
        transform: 'translate(-50%, -50%)',
        animation: animation !== 'none' ? `${animation} ${duration}s ease-in-out infinite` : undefined,
      }}
    />
  );
}
