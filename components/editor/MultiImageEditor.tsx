'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { ImageItem, ImageSlideKey, MAX_IMAGES_PER_SLIDE } from '@/lib/state/useCarouselDraft';
import { ANIMATION_OPTIONS } from '@/lib/tokens';
import { RangeField, SelectField } from './Fields';

type MultiImageEditorProps = {
  slideKey: ImageSlideKey;
  images: ImageItem[];
  addImage: (slideKey: ImageSlideKey, src: string) => void;
  updateImage: (slideKey: ImageSlideKey, imageId: string, updates: Partial<ImageItem>) => void;
  removeImage: (slideKey: ImageSlideKey, imageId: string) => void;
};

export function MultiImageEditor({
  slideKey,
  images,
  addImage,
  updateImage,
  removeImage,
}: MultiImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        addImage(slideKey, ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    // 같은 파일 다시 선택 가능하게
    e.target.value = '';
  }

  const canAddMore = images.length < MAX_IMAGES_PER_SLIDE;

  return (
    <div className="multi-image-section">
      <div className="multi-image-header">
        <label className="field-label">
          🖼️ 이미지 ({images.length} / {MAX_IMAGES_PER_SLIDE})
        </label>
        <button
          className="btn-add-image"
          onClick={() => fileInputRef.current?.click()}
          disabled={!canAddMore}
          type="button"
        >
          {canAddMore ? '+ 이미지 추가' : '최대 개수 도달'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </div>

      {images.length === 0 && (
        <div className="empty-images" onClick={() => fileInputRef.current?.click()}>
          📁 클릭해서 첫 이미지 추가
        </div>
      )}

      <div className="image-cards">
        {images.map((img, index) => (
          <ImageCard
            key={img.id}
            index={index + 1}
            image={img}
            onUpdate={(updates) => updateImage(slideKey, img.id, updates)}
            onRemove={() => removeImage(slideKey, img.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── 개별 이미지 카드 (접기/펼치기) ── */
function ImageCard({
  index,
  image,
  onUpdate,
  onRemove,
}: {
  index: number;
  image: ImageItem;
  onUpdate: (updates: Partial<ImageItem>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`image-card${expanded ? ' expanded' : ''}`}>
      {/* 카드 헤더 (썸네일 + 제어 버튼) */}
      <div className="image-card-header">
        <div className="image-card-info" onClick={() => setExpanded(!expanded)}>
          <img src={image.src} alt="" className="image-card-thumb" />
          <div className="image-card-meta">
            <div className="image-card-title">이미지 {index}</div>
            <div className="image-card-desc">
              {image.size}px · {image.animation === 'none' ? '정적' : image.animation}
            </div>
          </div>
        </div>
        <div className="image-card-actions">
          <button
            className="btn-icon"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? '접기' : '펼치기'}
            type="button"
          >
            {expanded ? '▲' : '▼'}
          </button>
          <button
            className="btn-icon btn-remove"
            onClick={onRemove}
            title="제거"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 펼쳐졌을 때 조정 컨트롤 */}
      {expanded && (
        <div className="image-card-body">
          <RangeField
            label="X 위치"
            value={image.x}
            onChange={(v) => onUpdate({ x: v })}
            min={0}
            max={1080}
          />
          <RangeField
            label="Y 위치"
            value={image.y}
            onChange={(v) => onUpdate({ y: v })}
            min={0}
            max={1350}
          />
          <RangeField
            label="크기"
            value={image.size}
            onChange={(v) => onUpdate({ size: v })}
            min={50}
            max={900}
            step={10}
          />
          <SelectField
            label="애니메이션"
            value={image.animation}
            onChange={(v) => onUpdate({ animation: v as any })}
            options={ANIMATION_OPTIONS}
          />
          {image.animation !== 'none' && (
            <RangeField
              label="속도(초)"
              value={image.duration}
              onChange={(v) => onUpdate({ duration: v })}
              min={1}
              max={10}
            />
          )}
        </div>
      )}
    </div>
  );
}
