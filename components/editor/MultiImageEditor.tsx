'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { ImageItem, MAX_IMAGES_PER_SLIDE } from '@/lib/state/useCarouselDraft';
import { ANIMATION_OPTIONS } from '@/lib/tokens';
import { measureAspect } from '@/lib/utils/measureAspect';
import { RangeField, SelectField } from './Fields';

type MultiImageEditorProps = {
  images: ImageItem[];
  onAdd: (src: string, type: 'image' | 'video', aspect: number) => void;
  onUpdate: (id: string, patch: Partial<ImageItem>) => void;
  onRemove: (id: string) => void;
  max?: number;
};

export function MultiImageEditor({ images, onAdd, onUpdate, onRemove, max = MAX_IMAGES_PER_SLIDE }: MultiImageEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  function handleImageFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (ev.target?.result) {
        const src = ev.target.result as string;
        const aspect = await measureAspect(src, 'image');
        onAdd(src, 'image', aspect);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleVideoFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('영상 파일은 50MB 이하만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (ev.target?.result) {
        const src = ev.target.result as string;
        const aspect = await measureAspect(src, 'video');
        onAdd(src, 'video', aspect);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const canAddMore = images.length < max;

  return (
    <div className="multi-image-section">
      <div className="multi-image-header">
        <label className="field-label">🖼️ 미디어 ({images.length} / {max})</label>
      </div>

      <div className="upload-buttons">
        <button className="btn-add-media btn-add-image" onClick={() => imageInputRef.current?.click()} disabled={!canAddMore} type="button">
          📷 이미지 추가
        </button>
        <button className="btn-add-media btn-add-video" onClick={() => videoInputRef.current?.click()} disabled={!canAddMore} type="button">
          🎥 영상 추가
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
        <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoFile} />
      </div>

      {!canAddMore && (
        <div style={{ fontSize: 12, color: '#ef4444', marginTop: 8, textAlign: 'center' }}>
          최대 {max}개까지 추가 가능합니다
        </div>
      )}

      {images.length === 0 && (
        <div className="empty-images">📁 위 버튼을 눌러 이미지/영상을 추가하세요</div>
      )}

      <div className="image-cards">
        {images.map((img, index) => (
          <ImageCard
            key={img.id}
            index={index + 1}
            image={img}
            onUpdate={(patch) => onUpdate(img.id, patch)}
            onRemove={() => onRemove(img.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── 개별 이미지/영상 카드 (접기/펼치기) ── */
function ImageCard({
  index,
  image,
  onUpdate,
  onRemove,
}: {
  index: number;
  image: ImageItem;
  onUpdate: (patch: Partial<ImageItem>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isVideo = image.type === 'video';

  return (
    <div className={`image-card${expanded ? ' expanded' : ''}`}>
      <div className="image-card-header">
        <div className="image-card-info" onClick={() => setExpanded(!expanded)}>
          {isVideo ? (
            <div className="image-card-thumb video-thumb">🎥</div>
          ) : (
            <img src={image.src} alt="" className="image-card-thumb" />
          )}
          <div className="image-card-meta">
            <div className="image-card-title">
              {isVideo ? '🎥' : '📷'} {isVideo ? '영상' : '이미지'} {index}
            </div>
            <div className="image-card-desc">
              {image.size}px · {image.animation === 'none' ? '정적' : image.animation}
            </div>
          </div>
        </div>
        <div className="image-card-actions">
          <button className="btn-icon" onClick={() => setExpanded(!expanded)} title={expanded ? '접기' : '펼치기'} type="button">
            {expanded ? '▲' : '▼'}
          </button>
          <button className="btn-icon btn-remove" onClick={onRemove} title="제거" type="button">✕</button>
        </div>
      </div>

      {expanded && (
        <div className="image-card-body">
          <RangeField label="X 위치" value={image.x} onChange={(v) => onUpdate({ x: v })} min={0} max={1080} />
          <RangeField label="Y 위치" value={image.y} onChange={(v) => onUpdate({ y: v })} min={0} max={1350} />
          <RangeField label="크기(너비)" value={image.size} onChange={(v) => onUpdate({ size: v })} min={50} max={1000} step={10} />
          <div style={{ fontSize: 12, color: '#6b7280', padding: 8, background: '#f9fafb', borderRadius: 4 }}>
            📐 비율 자동 유지 (원본 {image.aspect >= 1 ? '가로형' : '세로형'}). 미리보기에서 모서리 드래그로도 조절돼요.
          </div>
          {!isVideo && (
            <>
              <SelectField label="애니메이션" value={image.animation} onChange={(v) => onUpdate({ animation: v as ImageItem['animation'] })} options={ANIMATION_OPTIONS} />
              {image.animation !== 'none' && (
                <RangeField label="속도(초)" value={image.duration} onChange={(v) => onUpdate({ duration: v })} min={1} max={10} />
              )}
            </>
          )}
          {isVideo && (
            <div style={{ fontSize: 12, color: '#6b7280', padding: 8, background: '#f9fafb', borderRadius: 4 }}>
              💡 영상은 자동 재생/반복됩니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
