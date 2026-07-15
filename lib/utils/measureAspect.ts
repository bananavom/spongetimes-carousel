// 업로드된 미디어의 자연 가로세로 비율(=W/H)을 측정한다.
// 실패 시 1(정사각) fallback.
export function measureAspect(src: string, type: 'image' | 'video'): Promise<number> {
  return new Promise((resolve) => {
    if (type === 'video') {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => {
        const a = v.videoWidth && v.videoHeight ? v.videoWidth / v.videoHeight : 1;
        resolve(a || 1);
      };
      v.onerror = () => resolve(1);
      v.src = src;
    } else {
      const img = new Image();
      img.onload = () => {
        const a = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        resolve(a || 1);
      };
      img.onerror = () => resolve(1);
      img.src = src;
    }
  });
}
