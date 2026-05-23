'use client';

import { createRef, RefObject, useRef, useState } from 'react';
import { useCarouselDraft, CarouselDraft } from '@/lib/state/useCarouselDraft';
import { SLIDE_LABELS, ANIMATION_OPTIONS } from '@/lib/tokens';
import { downloadSlide, downloadAllAsZip } from '@/lib/utils/exportImage';

import { TextField, TextareaField, NumberField, RangeField, SelectField, ImageField } from './editor/Fields';
import { HeroSlide } from './slides/HeroSlide';
import { TeamSlide } from './slides/TeamSlide';
import { WebsiteSlide } from './slides/WebsiteSlide';
import { ConceptSlide } from './slides/ConceptSlide';
import { TimelineSlide } from './slides/TimelineSlide';
import { OutroSlide } from './slides/OutroSlide';

const NUM_SLIDES = 6;

export function CarouselStudio() {
  const { draft, update, reset, isLoaded } = useCarouselDraft();
  const [activeTab, setActiveTab] = useState(0);
  const [exporting, setExporting] = useState(false);

  const slideRefs = useRef<RefObject<HTMLDivElement | null>[]>(
    Array.from({ length: NUM_SLIDES }, () => createRef<HTMLDivElement>())
  );

  if (!isLoaded) {
    return <div style={{ padding: 40 }}>로딩 중...</div>;
  }

  function getSlideNames() {
    return Array.from({ length: NUM_SLIDES }, (_, i) =>
      `degulgul-W${String(draft.week).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}-${SLIDE_LABELS[i]}.png`
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
    switch (activeTab) {
      case 0: return <HeroEditor draft={draft} update={update} />;
      case 1: return <TeamEditor draft={draft} update={update} />;
      case 2: return <WebsiteEditor draft={draft} update={update} />;
      case 3: return <ConceptEditor draft={draft} update={update} />;
      case 4: return <TimelineEditor draft={draft} update={update} />;
      case 5: return <OutroEditor draft={draft} update={update} />;
      default: return null;
    }
  }

  return (
    <div className="studio-layout">
      {/* 오프스크린 풀사이즈 (PNG 캡처용) */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: -99999,
          top: 0,
          width: 1080,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: NUM_SLIDES }, (_, i) => (
          <div
            key={i}
            ref={slideRefs.current[i]}
            style={{ width: 1080, height: 1350 }}
          >
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
              {exporting ? '처리 중...' : '현재 PNG'}
            </button>
            <button className="btn-primary" onClick={handleDownloadAll} disabled={exporting}>
              {exporting ? '처리 중...' : '전체 ZIP'}
            </button>
          </div>
        </div>

        {/* 공통 필드 */}
        <div className="common-fields-section">
          <div className="common-fields-title">공통 설정</div>
          <NumberField label="Week 번호" value={draft.week} onChange={(v) => update('week', v)} min={1} max={7} />
          <TextField label="주제" value={draft.topic} onChange={(v) => update('topic', v)} placeholder="데굴데굴" />
          <TextField label="작성자 핸들" value={draft.authorHandle} onChange={(v) => update('authorHandle', v)} placeholder="@spongeclub" />
        </div>

        {/* 탭바 */}
        <div className="tab-bar">
          {SLIDE_LABELS.map((label, i) => (
            <button
              key={i}
              className={`tab-item${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {/* 슬라이드별 에디터 */}
        <div className="editor-content">
          {renderEditor()}
        </div>
      </div>

      {/* 우측: 미리보기 */}
      <div className="studio-preview">
        <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          현재 슬라이드: {activeTab + 1}. {SLIDE_LABELS[activeTab]}
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

/* ──────── 에디터 컴포넌트들 ──────── */

type EditorProps = {
  draft: CarouselDraft;
  update: <K extends keyof CarouselDraft>(key: K, value: CarouselDraft[K]) => void;
};

function ImageControls({
  prefix,
  draft,
  update,
}: {
  prefix: 'hero' | 'team' | 'website' | 'concept' | 'timeline' | 'outro';
  draft: CarouselDraft;
  update: EditorProps['update'];
}) {
  return (
    <>
      <ImageField
        label="이미지 업로드"
        value={draft[`${prefix}_image`] as string | null}
        onChange={(v) => update(`${prefix}_image` as any, v as any)}
      />
      {draft[`${prefix}_image`] && (
        <>
          <RangeField
            label="X 위치"
            value={draft[`${prefix}_imageX`] as number}
            onChange={(v) => update(`${prefix}_imageX` as any, v as any)}
            min={0}
            max={1080}
          />
          <RangeField
            label="Y 위치"
            value={draft[`${prefix}_imageY`] as number}
            onChange={(v) => update(`${prefix}_imageY` as any, v as any)}
            min={0}
            max={1350}
          />
          <RangeField
            label="크기"
            value={draft[`${prefix}_imageSize`] as number}
            onChange={(v) => update(`${prefix}_imageSize` as any, v as any)}
            min={100}
            max={900}
            step={10}
          />
          <SelectField
            label="애니메이션"
            value={draft[`${prefix}_imageAnimation`] as string}
            onChange={(v) => update(`${prefix}_imageAnimation` as any, v as any)}
            options={ANIMATION_OPTIONS}
          />
          <RangeField
            label="애니메이션 속도(초)"
            value={draft[`${prefix}_imageDuration`] as number}
            onChange={(v) => update(`${prefix}_imageDuration` as any, v as any)}
            min={1}
            max={10}
          />
        </>
      )}
    </>
  );
}

function HeroEditor({ draft, update }: EditorProps) {
  return (
    <>
      <TextareaField label="메인 텍스트" value={draft.hero_mainText} onChange={(v) => update('hero_mainText', v)} rows={2} />
      <TextareaField label="서브 텍스트" value={draft.hero_subText} onChange={(v) => update('hero_subText', v)} rows={2} />
      <ImageControls prefix="hero" draft={draft} update={update} />
    </>
  );
}

function TeamEditor({ draft, update }: EditorProps) {
  return (
    <>
      <TextField label="제목 1" value={draft.team_title1} onChange={(v) => update('team_title1', v)} />
      <TextField label="제목 2" value={draft.team_title2} onChange={(v) => update('team_title2', v)} />
      <TextareaField label="설명" value={draft.team_description} onChange={(v) => update('team_description', v)} rows={3} />
      <ImageControls prefix="team" draft={draft} update={update} />
    </>
  );
}

function WebsiteEditor({ draft, update }: EditorProps) {
  return (
    <>
      <TextField label="제목 1" value={draft.website_title1} onChange={(v) => update('website_title1', v)} />
      <TextField label="제목 2 (강조)" value={draft.website_title2} onChange={(v) => update('website_title2', v)} />
      <TextField label="제목 3" value={draft.website_title3} onChange={(v) => update('website_title3', v)} />
      <TextareaField label="부제목" value={draft.website_subTitle} onChange={(v) => update('website_subTitle', v)} rows={2} />
      <ImageControls prefix="website" draft={draft} update={update} />
    </>
  );
}

function ConceptEditor({ draft, update }: EditorProps) {
  return (
    <>
      <TextField label="제목 1" value={draft.concept_title1} onChange={(v) => update('concept_title1', v)} />
      <TextField label="제목 2" value={draft.concept_title2} onChange={(v) => update('concept_title2', v)} />
      <TextField label="강조 텍스트" value={draft.concept_emphasis} onChange={(v) => update('concept_emphasis', v)} />
      <TextField label="본문 1" value={draft.concept_body1} onChange={(v) => update('concept_body1', v)} />
      <TextField label="본문 2" value={draft.concept_body2} onChange={(v) => update('concept_body2', v)} />
      <ImageControls prefix="concept" draft={draft} update={update} />
    </>
  );
}

function TimelineEditor({ draft, update }: EditorProps) {
  return (
    <>
      <TextField label="제목" value={draft.timeline_title} onChange={(v) => update('timeline_title', v)} />
      <TextField label="부제목" value={draft.timeline_subtitle} onChange={(v) => update('timeline_subtitle', v)} />
      <TextField label="설명" value={draft.timeline_description} onChange={(v) => update('timeline_description', v)} />
      <ImageControls prefix="timeline" draft={draft} update={update} />
    </>
  );
}

function OutroEditor({ draft, update }: EditorProps) {
  return (
    <>
      <TextField label="메인 텍스트" value={draft.outro_mainText} onChange={(v) => update('outro_mainText', v)} />
      <TextField label="본문 1" value={draft.outro_body1} onChange={(v) => update('outro_body1', v)} />
      <TextField label="본문 2" value={draft.outro_body2} onChange={(v) => update('outro_body2', v)} />
      <TextareaField label="본문 3" value={draft.outro_body3} onChange={(v) => update('outro_body3', v)} rows={2} />
      <ImageControls prefix="outro" draft={draft} update={update} />
    </>
  );
}
