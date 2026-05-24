'use client';

import { createRef, RefObject, useRef, useState } from 'react';
import { useCarouselDraft, CarouselDraft, ImageSlideKey, ImageItem } from '@/lib/state/useCarouselDraft';
import { SLIDE_LABELS } from '@/lib/tokens';
import { downloadSlide, downloadAllAsZip } from '@/lib/utils/exportImage';
import { recordSlideToVideo } from '@/lib/utils/exportVideo';
import { SelectionProvider, useSelection } from '@/lib/state/SelectionContext';

import { TextField, TextareaField, NumberField, RangeField } from './editor/Fields';
import { MultiImageEditor } from './editor/MultiImageEditor';
import { HeroSlide } from './slides/HeroSlide';
import { TeamSlide } from './slides/TeamSlide';
import { WebsiteSlide } from './slides/WebsiteSlide';
import { ConceptSlide } from './slides/ConceptSlide';
import { TimelineSlide } from './slides/TimelineSlide';
import { OutroSlide } from './slides/OutroSlide';

const NUM_SLIDES = 6;
const PREVIEW_SCALE = 0.37;

const SLIDE_KEYS: ImageSlideKey[] = ['hero', 'team', 'website', 'concept', 'timeline', 'outro'];

export function CarouselStudio() {
  return (
    <SelectionProvider>
      <CarouselStudioInner />
    </SelectionProvider>
  );
}

function CarouselStudioInner() {
  const { draft, update, addImage, updateImage, removeImage, isLoaded } = useCarouselDraft();
  const { setSelectedId } = useSelection();
  const [activeTab, setActiveTab] = useState(0);
  const [exporting, setExporting] = useState(false);

  const slideRefs = useRef<RefObject<HTMLDivElement | null>[]>(
    Array.from({ length: NUM_SLIDES }, () => createRef<HTMLDivElement>())
  );

  if (!isLoaded) {
    return <div style={{ padding: 40 }}>로딩 중...</div>;
  }

  function getSlideNames() {
    const names = [
      draft.hero_name,
      draft.team_name,
      draft.website_name,
      draft.concept_name,
      draft.timeline_name,
      draft.outro_name,
    ];
    return Array.from({ length: NUM_SLIDES }, (_, i) =>
      `degulgul-W${String(draft.week).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}-${names[i]}.png`
    );
  }

  async function handleDownloadCurrent() {
    const node = slideRefs.current[activeTab]?.current;
    if (!node) return;
    setExporting(true);
    try {
      await downloadSlide(node, getSlideNames()[activeTab]);
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadVideo() {
    const node = slideRefs.current[activeTab]?.current;
    if (!node) return;
    setExporting(true);
    try {
      const filename = getSlideNames()[activeTab].replace('.png', '.mp4');
      await recordSlideToVideo(node, filename, 7000);
    } catch (err) {
      console.error(err);
      alert('영상 생성 실패: ' + (err instanceof Error ? err.message : '알 수 없는 에러'));
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadAll() {
    const nodes = slideRefs.current.map((r) => r.current).filter((n): n is HTMLDivElement => n !== null);
    if (nodes.length === 0) return;
    setExporting(true);
    try {
      await downloadAllAsZip(nodes, `degulgul-W${String(draft.week).padStart(2, '0')}.zip`, getSlideNames());
    } finally {
      setExporting(false);
    }
  }

  // 이미지 업데이트 핸들러 (활성 슬라이드용)
  function handleImageUpdate(id: string, updates: Partial<ImageItem>) {
    const slideKey = SLIDE_KEYS[activeTab];
    updateImage(slideKey, id, updates);
  }

  // 강조 박스 업데이트 (슬라이드 4)
  function handleEmphasisUpdate(updates: { x?: number; y?: number; width?: number; height?: number }) {
    if (updates.x !== undefined) update('concept_emphasis_x', updates.x);
    if (updates.y !== undefined) update('concept_emphasis_y', updates.y);
    if (updates.width !== undefined) update('concept_emphasis_width', updates.width);
    if (updates.height !== undefined) update('concept_emphasis_height', updates.height);
  }

  // 정적 슬라이드 (캡처용)
  function renderStaticSlide(index: number) {
    switch (index) {
      case 0: return <HeroSlide draft={draft} />;
      case 1: return <TeamSlide draft={draft} />;
      case 2: return <WebsiteSlide draft={draft} />;
      case 3: return <ConceptSlide draft={draft} />;
      case 4: return <TimelineSlide draft={draft} />;
      case 5: return <OutroSlide draft={draft} />;
      default: return null;
    }
  }

  // 편집 가능 슬라이드 (드래그 가능)
  function renderEditableSlide() {
    const slideProps = {
      draft,
      editable: true,
      onImageUpdate: handleImageUpdate,
      containerScale: PREVIEW_SCALE,
    };
    switch (activeTab) {
      case 0: return <HeroSlide {...slideProps} />;
      case 1: return <TeamSlide {...slideProps} />;
      case 2: return <WebsiteSlide {...slideProps} />;
      case 3: return <ConceptSlide {...slideProps} onEmphasisUpdate={handleEmphasisUpdate} />;
      case 4: return <TimelineSlide {...slideProps} />;
      case 5: return <OutroSlide {...slideProps} />;
      default: return null;
    }
  }

  function renderEditor() {
    const slideKey = SLIDE_KEYS[activeTab];
    const imagesKey = `${slideKey}_images` as keyof CarouselDraft;
    const images = draft[imagesKey] as any[];

    switch (activeTab) {
      case 0:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.hero_name} onChange={(v) => update('hero_name', v)} />
            <TextareaField label="메인 텍스트" value={draft.hero_mainText} onChange={(v) => update('hero_mainText', v)} rows={2} />
            <TextareaField label="서브 텍스트" value={draft.hero_subText} onChange={(v) => update('hero_subText', v)} rows={2} />
            <MultiImageEditor slideKey="hero" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 1:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.team_name} onChange={(v) => update('team_name', v)} />
            <TextField label="제목 1" value={draft.team_title1} onChange={(v) => update('team_title1', v)} />
            <TextField label="제목 2" value={draft.team_title2} onChange={(v) => update('team_title2', v)} />
            <TextareaField label="설명" value={draft.team_description} onChange={(v) => update('team_description', v)} rows={3} />
            <MultiImageEditor slideKey="team" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 2:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.website_name} onChange={(v) => update('website_name', v)} />
            <TextField label="제목 1" value={draft.website_title1} onChange={(v) => update('website_title1', v)} />
            <TextField label="제목 2 (강조)" value={draft.website_title2} onChange={(v) => update('website_title2', v)} />
            <TextField label="제목 3" value={draft.website_title3} onChange={(v) => update('website_title3', v)} />
            <TextareaField label="부제목" value={draft.website_subTitle} onChange={(v) => update('website_subTitle', v)} rows={2} />
            <MultiImageEditor slideKey="website" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 3:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.concept_name} onChange={(v) => update('concept_name', v)} />
            <TextField label="제목 1" value={draft.concept_title1} onChange={(v) => update('concept_title1', v)} />
            <TextField label="제목 2" value={draft.concept_title2} onChange={(v) => update('concept_title2', v)} />
            <TextField label="강조 텍스트" value={draft.concept_emphasis} onChange={(v) => update('concept_emphasis', v)} />
            <RangeField 
              label="강조 폰트 크기" 
              value={draft.concept_emphasis_fontSize} 
              onChange={(v) => update('concept_emphasis_fontSize', v)} 
              min={30} 
              max={150} 
            />
            <div style={{ fontSize: 12, color: '#6b7280', padding: 8, background: '#f9fafb', borderRadius: 4, marginBottom: 16 }}>
              💡 박스는 미리보기에서 클릭 후 드래그/모서리로 조절
            </div>
            <TextField label="본문 1" value={draft.concept_body1} onChange={(v) => update('concept_body1', v)} />
            <TextField label="본문 2" value={draft.concept_body2} onChange={(v) => update('concept_body2', v)} />
            <MultiImageEditor slideKey="concept" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 4:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.timeline_name} onChange={(v) => update('timeline_name', v)} />
            <TextField label="제목" value={draft.timeline_title} onChange={(v) => update('timeline_title', v)} />
            <TextField label="부제목" value={draft.timeline_subtitle} onChange={(v) => update('timeline_subtitle', v)} />
            <TextField label="설명" value={draft.timeline_description} onChange={(v) => update('timeline_description', v)} />
            <MultiImageEditor slideKey="timeline" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 5:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.outro_name} onChange={(v) => update('outro_name', v)} />
            <TextField label="메인 텍스트" value={draft.outro_mainText} onChange={(v) => update('outro_mainText', v)} />
            <TextField label="본문 1" value={draft.outro_body1} onChange={(v) => update('outro_body1', v)} />
            <TextField label="본문 2" value={draft.outro_body2} onChange={(v) => update('outro_body2', v)} />
            <TextareaField label="본문 3" value={draft.outro_body3} onChange={(v) => update('outro_body3', v)} rows={2} />
            <MultiImageEditor slideKey="outro" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="studio-layout">
      {/* 오프스크린 풀사이즈 (PNG/MP4 캡처용 - 정적) */}
      <div aria-hidden style={{ position: 'fixed', left: -99999, top: 0, width: 1080, pointerEvents: 'none' }}>
        {Array.from({ length: NUM_SLIDES }, (_, i) => (
          <div key={i} ref={slideRefs.current[i]} style={{ width: 1080, height: 1350 }}>
            {renderStaticSlide(i)}
          </div>
        ))}
      </div>

      {/* 좌측: 에디터 */}
      <div className="studio-editor">
        <div className="studio-topbar">
          <h1>🍍 데굴데굴 캐러셀</h1>
          <div className="topbar-actions">
            <button className="btn-secondary" onClick={handleDownloadCurrent} disabled={exporting}>
              {exporting ? '...' : '📷 PNG'}
            </button>
            <button className="btn-video" onClick={handleDownloadVideo} disabled={exporting}>
              {exporting ? '...' : '🎬 MP4'}
            </button>
            <button className="btn-primary" onClick={handleDownloadAll} disabled={exporting}>
              {exporting ? '...' : '📦 ZIP'}
            </button>
          </div>
        </div>

        <div className="common-fields-section">
          <div className="common-fields-title">공통 설정</div>
          <NumberField label="Week 번호" value={draft.week} onChange={(v) => update('week', v)} min={1} max={7} />
          <TextField label="주제" value={draft.topic} onChange={(v) => update('topic', v)} placeholder="데굴데굴" />
          <TextField label="작성자 핸들" value={draft.authorHandle} onChange={(v) => update('authorHandle', v)} placeholder="@spongeclub" />
        </div>

        <div className="tab-bar">
          {[draft.hero_name, draft.team_name, draft.website_name, draft.concept_name, draft.timeline_name, draft.outro_name].map((label, i) => (
            <button
              key={i}
              className={`tab-item${activeTab === i ? ' active' : ''}`}
              onClick={() => { setActiveTab(i); setSelectedId(null); }}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <div className="editor-content">
          {renderEditor()}
        </div>
      </div>

      {/* 우측: 미리보기 (편집 가능) */}
      <div className="studio-preview" onClick={() => setSelectedId(null)}>
        <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          현재 슬라이드: {activeTab + 1}. {[draft.hero_name, draft.team_name, draft.website_name, draft.concept_name, draft.timeline_name, draft.outro_name][activeTab]}
          <span style={{ marginLeft: 12, color: '#999' }}>· 미디어 클릭 후 드래그/리사이즈</span>
        </div>
        <div className="preview-frame">
          <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left', width: 1080, height: 1350 }}>
            {renderEditableSlide()}
          </div>
        </div>
      </div>
    </div>
  );
}
