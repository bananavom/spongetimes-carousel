'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { ImageItem, ImageSlideKey, MAX_IMAGES_PER_SLIDE } from '@/lib/state/useCarouselDraft';
import { ANIMATION_OPTIONS } from '@/lib/tokens';
import { RangeField, SelectField } from './Fields';

type MultiImageEditorProps = {
  slideKey: ImageSlideKey;
  images: ImageItem[];
  addImage: (slideKey: ImageSlideKey, src: string, type?: 'image' | 'video') => void;
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
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  function handleImageFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        addImage(slideKey, ev.target.result as string, 'image');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleVideoFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 영상 파일 크기 체크 (50MB 제한)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('영상 파일은 50MB 이하만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        addImage(slideKey, ev.target.result as string, 'video');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const canAddMore = images.length < MAX_IMAGES_PER_SLIDE;

  return (
    <div className="multi-image-section">
      <div className="multi-image-header">
        <label className="field-label">
          🖼️ 미디어 ({images.length} / {MAX_IMAGES_PER_SLIDE})
        </label>
      </div>

      {/* 업로드 버튼 그룹 */}
      <div className="upload-buttons">
        <button
          className="btn-add-media btn-add-image"
          onClick={() => imageInputRef.current?.click()}
          disabled={!canAddMore}
          type="button"
        >
          📷 이미지 추가
        </button>
        <button
          className="btn-add-media btn-add-video"
          onClick={() => videoInputRef.current?.click()}
          disabled={!canAddMore}
          type="button"
        >
          🎥 영상 추가
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageFile}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleVideoFile}
        />
      </div>

      {!canAddMore && (
        <div style={{ fontSize: 12, color: '#ef4444', marginTop: 8, textAlign: 'center' }}>
          최대 {MAX_IMAGES_PER_SLIDE}개까지 추가 가능합니다
        </div>
      )}

      {images.length === 0 && (
        <div className="empty-images">
          📁 위 버튼을 눌러 첫 미디어를 추가하세요
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

/* ── 개별 이미지/영상 카드 (접기/펼치기) ── */
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
  const isVideo = image.type === 'video';

  return (
    <div className={`image-card${expanded ? ' expanded' : ''}`}>
      <div className="image-card-header">
        <div className="image-card-info" onClick={() => setExpanded(!expanded)}>
          {isVideo ? (
            <div className="image-card-thumb video-thumb">
              🎥
            </div>
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
          {!isVideo && (
            <>
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
