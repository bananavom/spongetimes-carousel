'use client';

import { createRef, RefObject, useRef, useState } from 'react';
import { useCarouselDraft, CarouselDraft, ImageSlideKey } from '@/lib/state/useCarouselDraft';
import { SLIDE_LABELS } from '@/lib/tokens';
import { downloadSlide, downloadAllAsZip } from '@/lib/utils/exportImage';
import { recordSlideToVideo } from '@/lib/utils/exportVideo';

import { TextField, TextareaField, NumberField } from './editor/Fields';
import { MultiImageEditor } from './editor/MultiImageEditor';
import { HeroSlide } from './slides/HeroSlide';
import { TeamSlide } from './slides/TeamSlide';
import { WebsiteSlide } from './slides/WebsiteSlide';
import { ConceptSlide } from './slides/ConceptSlide';
import { TimelineSlide } from './slides/TimelineSlide';
import { OutroSlide } from './slides/OutroSlide';

const NUM_SLIDES = 6;

const SLIDE_KEYS: ImageSlideKey[] = ['hero', 'team', 'website', 'concept', 'timeline', 'outro'];

export function CarouselStudio() {
  const { draft, update, addImage, updateImage, removeImage, isLoaded } = useCarouselDraft();
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
      await recordSlideToVideo(node, filename, 7000); // 7초
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
      await downloadAllAsZip(
        nodes,
        `degulgul-W${String(draft.week).padStart(2, '0')}.zip`,
        getSlideNames()
      );
    } finally {
      setExporting(false);
    }
  }

  function renderSlide(index: number) {
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

  function renderEditor() {
    const slideKey = SLIDE_KEYS[activeTab];
    const imagesKey = `${slideKey}_images` as keyof CarouselDraft;
    const images = draft[imagesKey] as any[];

    switch (activeTab) {
      case 0:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.hero_name} onChange={(v) => update('hero_name', v)} placeholder="히어로" />
            <TextareaField label="메인 텍스트" value={draft.hero_mainText} onChange={(v) => update('hero_mainText', v)} rows={2} />
            <TextareaField label="서브 텍스트" value={draft.hero_subText} onChange={(v) => update('hero_subText', v)} rows={2} />
            <MultiImageEditor slideKey="hero" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 1:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.team_name} onChange={(v) => update('team_name', v)} placeholder="팀" />
            <TextField label="제목 1" value={draft.team_title1} onChange={(v) => update('team_title1', v)} />
            <TextField label="제목 2" value={draft.team_title2} onChange={(v) => update('team_title2', v)} />
            <TextareaField label="설명" value={draft.team_description} onChange={(v) => update('team_description', v)} rows={3} />
            <MultiImageEditor slideKey="team" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 2:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.website_name} onChange={(v) => update('website_name', v)} placeholder="웹사이트" />
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
            <TextField label="📝 슬라이드 이름" value={draft.concept_name} onChange={(v) => update('concept_name', v)} placeholder="컨셉" />
            <TextField label="제목 1" value={draft.concept_title1} onChange={(v) => update('concept_title1', v)} />
            <TextField label="제목 2" value={draft.concept_title2} onChange={(v) => update('concept_title2', v)} />
            <TextField label="강조 텍스트" value={draft.concept_emphasis} onChange={(v) => update('concept_emphasis', v)} />
            <TextField label="본문 1" value={draft.concept_body1} onChange={(v) => update('concept_body1', v)} />
            <TextField label="본문 2" value={draft.concept_body2} onChange={(v) => update('concept_body2', v)} />
            <MultiImageEditor slideKey="concept" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 4:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.timeline_name} onChange={(v) => update('timeline_name', v)} placeholder="타임라인" />
            <TextField label="제목" value={draft.timeline_title} onChange={(v) => update('timeline_title', v)} />
            <TextField label="부제목" value={draft.timeline_subtitle} onChange={(v) => update('timeline_subtitle', v)} />
            <TextField label="설명" value={draft.timeline_description} onChange={(v) => update('timeline_description', v)} />
            <MultiImageEditor slideKey="timeline" images={images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 5:
        return (
          <>
            <TextField label="📝 슬라이드 이름" value={draft.outro_name} onChange={(v) => update('outro_name', v)} placeholder="마무리" />
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
      {/* 오프스크린 풀사이즈 (PNG 캡처용) */}
      <div aria-hidden style={{ position: 'fixed', left: -99999, top: 0, width: 1080, pointerEvents: 'none' }}>
        {Array.from({ length: NUM_SLIDES }, (_, i) => (
          <div key={i} ref={slideRefs.current[i]} style={{ width: 1080, height: 1350 }}>
            {renderSlide(i)}
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
              onClick={() => setActiveTab(i)}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <div className="editor-content">
          {renderEditor()}
        </div>
      </div>

      {/* 우측: 미리보기 */}
      <div className="studio-preview">
        <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          현재 슬라이드: {activeTab + 1}. {[draft.hero_name, draft.team_name, draft.website_name, draft.concept_name, draft.timeline_name, draft.outro_name][activeTab]}
        </div>
        <div className="preview-frame">
          <div style={{ transform: 'scale(0.37)', transformOrigin: 'top left', width: 1080, height: 1350 }}>
            {renderSlide(activeTab)}
          </div>
        </div>
      </div>
    </div>
  );
}
