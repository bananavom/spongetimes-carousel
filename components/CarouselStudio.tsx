'use client';

import { createRef, RefObject, useRef, useState } from 'react';
import { useCarouselDraft, ImageItem } from '@/lib/state/useCarouselDraft';
import { TOTAL_WEEKS, CONTENT_TYPES, PUBLISHERS, ContentType, Publisher } from '@/lib/tokens';
import { downloadSlide, downloadAllAsZip } from '@/lib/utils/exportImage';
import { recordSlideToVideo } from '@/lib/utils/exportVideo';
import { SelectionProvider, useSelection } from '@/lib/state/SelectionContext';
import { generateCharacterPrompt } from '@/lib/character/prompt';

import { TextField, TextareaField, NumberField, SelectField, ImageField } from './editor/Fields';
import { MultiImageEditor } from './editor/MultiImageEditor';
import { CoverSlide } from './slides/CoverSlide';
import { CtaSlide } from './slides/CtaSlide';

const NUM_SLIDES = 2;
const PREVIEW_SCALE = 0.37;
const SLIDE_NAMES = ['표지', 'CTA'] as const;

const CONTENT_TYPE_OPTIONS = CONTENT_TYPES.map((t) => ({ value: t, label: t }));
const PUBLISHER_OPTIONS = PUBLISHERS.map((p) => ({ value: p, label: p }));

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
    return Array.from({ length: NUM_SLIDES }, (_, i) =>
      `spongetimes-2gi-W${String(draft.week).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}-${SLIDE_NAMES[i]}.png`
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
      await downloadAllAsZip(nodes, `spongetimes-2gi-W${String(draft.week).padStart(2, '0')}.zip`, getSlideNames());
    } finally {
      setExporting(false);
    }
  }

  function handleCoverImageUpdate(id: string, updates: Partial<ImageItem>) {
    updateImage('cover', id, updates);
  }

  function renderStaticSlide(index: number) {
    switch (index) {
      case 0: return <CoverSlide draft={draft} />;
      case 1: return <CtaSlide draft={draft} />;
      default: return null;
    }
  }

  function renderEditableSlide() {
    switch (activeTab) {
      case 0:
        return (
          <CoverSlide
            draft={draft}
            editable
            onImageUpdate={handleCoverImageUpdate}
            containerScale={PREVIEW_SCALE}
          />
        );
      case 1:
        return <CtaSlide draft={draft} />;
      default:
        return null;
    }
  }

  function renderEditor() {
    switch (activeTab) {
      case 0:
        return (
          <>
            <TextareaField label="메인 타이틀 (줄바꿈 = 실제 줄바꿈)" value={draft.cover_mainTitle} onChange={(v) => update('cover_mainTitle', v)} rows={3} />
            <TextField label="🖍️ 형광펜 강조 단어" value={draft.cover_highlight} onChange={(v) => update('cover_highlight', v)} placeholder="타이틀 안의 강조할 단어/구절" />
            <div style={{ fontSize: 12, color: '#6b7280', padding: 8, background: '#f9fafb', borderRadius: 4, marginBottom: 12 }}>
              🧸 캐릭터는 미리보기에서 클릭 후 드래그/리사이즈로 배치하세요 (우하단 권장)
            </div>
            <MultiImageEditor slideKey="cover" images={draft.cover_images} addImage={addImage} updateImage={updateImage} removeImage={removeImage} />
          </>
        );
      case 1:
        return (
          <>
            <TextField label="옐로우 라벨" value={draft.cta_label} onChange={(v) => update('cta_label', v)} placeholder="💬 댓글로 이야기해요" />
            <TextareaField label="질문 (줄바꿈 지원)" value={draft.cta_question} onChange={(v) => update('cta_question', v)} rows={3} />
            <TextField label="🖍️ 질문 형광펜 강조" value={draft.cta_questionHighlight} onChange={(v) => update('cta_questionHighlight', v)} placeholder="질문 안의 강조할 단어" />
            <TextareaField label="발행자 자유 멘트 (캐릭터 우측, 2~3줄)" value={draft.cta_message} onChange={(v) => update('cta_message', v)} rows={3} />
            <ImageField label="🧽 캐릭터 이미지" value={draft.cta_character || null} onChange={(v) => update('cta_character', v ?? '')} />
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
          <h1>🍍 스폰지타임즈 2기 캐러셀</h1>
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
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <NumberField label="Week" value={draft.week} onChange={(v) => update('week', v)} min={1} max={TOTAL_WEEKS} />
            <NumberField label="Vol." value={draft.volume} onChange={(v) => update('volume', v)} min={1} />
            <NumberField label="Year" value={draft.year} onChange={(v) => update('year', v)} min={2024} max={2100} />
          </div>
          <SelectField label="콘텐츠 유형" value={draft.contentType} onChange={(v) => update('contentType', v as ContentType)} options={CONTENT_TYPE_OPTIONS} />
          <SelectField label="발행자" value={draft.publisher} onChange={(v) => update('publisher', v as Publisher)} options={PUBLISHER_OPTIONS} />
        </div>

        <div className="tab-bar">
          {SLIDE_NAMES.map((label, i) => (
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
          <CharacterPromptPanel
            publisher={draft.publisher}
            contentType={draft.contentType}
            slideType={activeTab === 0 ? 'cover' : 'cta'}
            seed={draft.week}
          />
        </div>
      </div>

      {/* 우측: 미리보기 */}
      <div className="studio-preview" onClick={() => setSelectedId(null)}>
        <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          현재 슬라이드: {activeTab + 1}. {SLIDE_NAMES[activeTab]}
          {activeTab === 0 && <span style={{ marginLeft: 12, color: '#999' }}>· 캐릭터 클릭 후 드래그/리사이즈</span>}
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

/* ── 캐릭터 AI 프롬프트 생성 패널 ── */
function CharacterPromptPanel({
  publisher,
  contentType,
  slideType,
  seed,
}: {
  publisher: Publisher;
  contentType: ContentType;
  slideType: 'cover' | 'cta';
  seed: number;
}) {
  const [copied, setCopied] = useState(false);
  const prompt = generateCharacterPrompt({ publisher, contentType, slideType, seed });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert('복사에 실패했습니다. 프롬프트를 직접 선택해 복사하세요.');
    }
  }

  return (
    <div style={{ marginTop: 20, padding: 14, background: '#1A1F36', borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FFE67A' }}>
          🤖 캐릭터 AI 프롬프트 ({publisher} · {slideType === 'cover' ? '표지' : 'CTA'})
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: '#FFE67A', color: '#1A1F36', border: 'none',
            fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
          }}
        >
          {copied ? '✅ 복사됨' : '📋 복사'}
        </button>
      </div>
      <textarea
        readOnly
        value={prompt}
        rows={7}
        style={{
          width: '100%', fontSize: 11, lineHeight: 1.5, color: '#E8EAF0', background: '#111528',
          border: '1px solid #2A3050', borderRadius: 6, padding: 10, resize: 'vertical', fontFamily: 'monospace',
        }}
      />
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
        Midjourney·DALL·E 등에 붙여넣어 캐릭터를 만든 뒤, 투명 PNG로 업로드하세요.
      </div>
    </div>
  );
}
