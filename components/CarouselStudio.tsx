'use client';

import { useRef, useState } from 'react';
import { useCarouselDraft, ImageItem, createImageItem } from '@/lib/state/useCarouselDraft';
import type { BodySlide } from '@/lib/state/bodySlide';
import { TOTAL_WEEKS, CONTENT_TYPES, PUBLISHERS, PUBLISHER_HIGHLIGHT, Publisher } from '@/lib/tokens';
import { downloadSlide, downloadAllAsZip } from '@/lib/utils/exportImage';
import { recordSlideToVideo } from '@/lib/utils/exportVideo';
import { measureAspect } from '@/lib/utils/measureAspect';
import { SelectionProvider, useSelection } from '@/lib/state/SelectionContext';
import { generateCharacterPrompt } from '@/lib/character/prompt';

import { TextField, TextareaField, NumberField, SelectField, ComboField, CheckboxField, ImageField } from './editor/Fields';
import { MultiImageEditor } from './editor/MultiImageEditor';
import { BodyEditor } from './editor/body/BodyEditor';
import { BodyListManager } from './editor/body/BodyListManager';
import { CoverSlide } from './slides/CoverSlide';
import { CtaSlide } from './slides/CtaSlide';
import { BodySlideRenderer } from './slides/body/BodySlideRenderer';

const PREVIEW_SCALE = 0.37;

const PUBLISHER_OPTIONS = PUBLISHERS.map((p) => ({ value: p, label: p }));

type SlideEntry =
  | { kind: 'cover' }
  | { kind: 'cta' }
  | { kind: 'body'; body: BodySlide; bodyIndex: number };

export function CarouselStudio() {
  return (
    <SelectionProvider>
      <CarouselStudioInner />
    </SelectionProvider>
  );
}

function CarouselStudioInner() {
  const {
    draft, update, addImage, updateImage, removeImage, isLoaded,
    addBody, updateBody, removeBody, moveBody, addBodyImage, updateBodyImage, removeBodyImage,
  } = useCarouselDraft();
  const { setSelectedId } = useSelection();
  const [activeTab, setActiveTab] = useState(0);
  const [exporting, setExporting] = useState(false);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  if (!isLoaded) {
    return <div style={{ padding: 40 }}>로딩 중...</div>;
  }

  const totalBody = draft.bodySlides.length;
  const slideOrder: SlideEntry[] = [
    { kind: 'cover' },
    ...draft.bodySlides.map((b, i) => ({ kind: 'body' as const, body: b, bodyIndex: i + 1 })),
    { kind: 'cta' },
  ];
  const safeTab = Math.min(activeTab, slideOrder.length - 1);
  const activeEntry = slideOrder[safeTab];

  function entryLabel(entry: SlideEntry): string {
    if (entry.kind === 'cover') return '표지';
    if (entry.kind === 'cta') return 'CTA';
    return `본문 ${entry.bodyIndex}`;
  }

  function getSlideNames() {
    return slideOrder.map((entry, i) =>
      `spongetimes-2gi-W${String(draft.week).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}-${entryLabel(entry)}.png`
    );
  }

  async function handleDownloadCurrent() {
    const node = nodesRef.current[safeTab];
    if (!node) return;
    setExporting(true);
    try {
      await downloadSlide(node, getSlideNames()[safeTab]);
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadVideo() {
    const node = nodesRef.current[safeTab];
    if (!node) return;
    setExporting(true);
    try {
      await recordSlideToVideo(node, getSlideNames()[safeTab].replace('.png', '.mp4'), 7000);
    } catch (err) {
      console.error(err);
      alert('영상 생성 실패: ' + (err instanceof Error ? err.message : '알 수 없는 에러'));
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadAll() {
    const nodes = nodesRef.current.slice(0, slideOrder.length).filter((n): n is HTMLDivElement => n !== null);
    if (nodes.length === 0) return;
    setExporting(true);
    try {
      await downloadAllAsZip(nodes, `spongetimes-2gi-W${String(draft.week).padStart(2, '0')}.zip`, getSlideNames());
    } finally {
      setExporting(false);
    }
  }

  function handleAddBody(template: Parameters<typeof addBody>[0]) {
    addBody(template);
    setActiveTab(draft.bodySlides.length + 1); // 새 본문 탭으로 이동 (cover=0 기준)
  }

  function selectBody(id: string) {
    const idx = slideOrder.findIndex((e) => e.kind === 'body' && e.body.id === id);
    if (idx >= 0) { setActiveTab(idx); setSelectedId(null); }
  }

  function renderStaticSlide(entry: SlideEntry) {
    if (entry.kind === 'cover') return <CoverSlide draft={draft} />;
    if (entry.kind === 'cta') return <CtaSlide draft={draft} />;
    return <BodySlideRenderer slide={entry.body} index={entry.bodyIndex} total={totalBody} highlightColor={PUBLISHER_HIGHLIGHT[draft.publisher]} />;
  }

  function renderEditableSlide(entry: SlideEntry) {
    if (entry.kind === 'cover') {
      return <CoverSlide draft={draft} editable onImageUpdate={(id, u) => updateImage('cover', id, u)} containerScale={PREVIEW_SCALE} />;
    }
    if (entry.kind === 'cta') return <CtaSlide draft={draft} />;
    return (
      <BodySlideRenderer
        slide={entry.body}
        index={entry.bodyIndex}
        total={totalBody}
        editable
        onImageUpdate={(imgId, patch) => updateBodyImage(entry.body.id, imgId, patch)}
        containerScale={PREVIEW_SCALE}
        highlightColor={PUBLISHER_HIGHLIGHT[draft.publisher]}
      />
    );
  }

  function renderEditor() {
    if (activeEntry.kind === 'cover') {
      return (
        <>
          <TextareaField label="메인 타이틀 (줄바꿈 = 실제 줄바꿈)" value={draft.cover_mainTitle} onChange={(v) => update('cover_mainTitle', v)} rows={3} />
          <TextField label="🖍️ 형광펜 강조 단어" value={draft.cover_highlight} onChange={(v) => update('cover_highlight', v)} placeholder="타이틀 안의 강조할 단어" />
          <div style={{ fontSize: 12, color: '#6b7280', padding: 8, background: '#f9fafb', borderRadius: 4, marginBottom: 12 }}>
            🧸 캐릭터/미디어는 미리보기에서 클릭 후 드래그/리사이즈로 배치하세요 (우하단 권장)
          </div>
          <MultiImageEditor
            images={draft.cover_images}
            onAdd={(src, type, aspect) => addImage('cover', src, type, aspect)}
            onUpdate={(id, patch) => updateImage('cover', id, patch)}
            onRemove={(id) => removeImage('cover', id)}
          />
        </>
      );
    }
    if (activeEntry.kind === 'cta') {
      return (
        <>
          <TextField label="옐로우 라벨" value={draft.cta_label} onChange={(v) => update('cta_label', v)} placeholder="💬 댓글로 이야기해요" />
          <TextareaField label="질문 (줄바꿈 지원)" value={draft.cta_question} onChange={(v) => update('cta_question', v)} rows={3} />
          <TextField label="🖍️ 질문 형광펜 강조" value={draft.cta_questionHighlight} onChange={(v) => update('cta_questionHighlight', v)} placeholder="질문 안의 강조 단어" />
          <TextareaField label="발행자 자유 멘트 (캐릭터 우측, 2~3줄)" value={draft.cta_message} onChange={(v) => update('cta_message', v)} rows={3} />
          <CtaCharacterField value={draft.cta_character} onChange={(v) => update('cta_character', v)} />

          <div style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>팔로우 카드</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>스폰지클럽 카드는 기본 로고가 적용돼요. 변경은 코드 수정 필요.</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>보조 팔로우 카드 (개인 계정)</div>
            <CheckboxField label="보조 팔로우 카드 표시" checked={draft.cta_subFollow.on} onChange={(v) => update('cta_subFollow', { ...draft.cta_subFollow, on: v })} />
            {draft.cta_subFollow.on && (
              <>
                <TextField label="이름" value={draft.cta_subFollow.name} onChange={(v) => update('cta_subFollow', { ...draft.cta_subFollow, name: v })} />
                <TextField label="핸들" value={draft.cta_subFollow.handle} onChange={(v) => update('cta_subFollow', { ...draft.cta_subFollow, handle: v })} placeholder="@handle" />
                <ImageField label="프로필 이미지" value={draft.cta_subFollow.image || null} onChange={(v) => update('cta_subFollow', { ...draft.cta_subFollow, image: v ?? '' })} />
              </>
            )}
          </div>
        </>
      );
    }
    return (
      <BodyEditor
        slide={activeEntry.body}
        updateBody={updateBody}
        addBodyImage={addBodyImage}
        updateBodyImage={updateBodyImage}
        removeBodyImage={removeBodyImage}
      />
    );
  }

  // 캐릭터 프롬프트 패널 파라미터
  const promptSlideType = activeEntry.kind === 'cover' ? 'cover' : activeEntry.kind === 'cta' ? 'cta' : 'body';

  return (
    <div className="studio-layout">
      {/* 오프스크린 풀사이즈 캡처 노드 */}
      <div aria-hidden style={{ position: 'fixed', left: -99999, top: 0, width: 1080, pointerEvents: 'none' }}>
        {slideOrder.map((entry, i) => (
          <div key={i} ref={(el) => { nodesRef.current[i] = el; }} style={{ width: 1080, height: 1350 }}>
            {renderStaticSlide(entry)}
          </div>
        ))}
      </div>

      {/* 좌측: 에디터 */}
      <div className="studio-editor">
        <div className="studio-topbar">
          <h1>🍍 스폰지타임즈 2기 캐러셀</h1>
          <div className="topbar-actions">
            <button className="btn-secondary" onClick={handleDownloadCurrent} disabled={exporting}>{exporting ? '...' : '📷 PNG'}</button>
            <button className="btn-video" onClick={handleDownloadVideo} disabled={exporting}>{exporting ? '...' : '🎬 MP4'}</button>
            <button className="btn-primary" onClick={handleDownloadAll} disabled={exporting}>{exporting ? '...' : `📦 ZIP (${slideOrder.length})`}</button>
          </div>
        </div>

        <div className="common-fields-section">
          <div className="common-fields-title">공통 설정</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <NumberField label="Week" value={draft.week} onChange={(v) => update('week', v)} min={1} max={TOTAL_WEEKS} />
            <NumberField label="Vol." value={draft.volume} onChange={(v) => update('volume', v)} min={1} />
            <NumberField label="Year" value={draft.year} onChange={(v) => update('year', v)} min={2024} max={2100} />
          </div>
          <ComboField label="콘텐츠 유형 (직접 입력 가능)" value={draft.contentType} onChange={(v) => update('contentType', v)} options={CONTENT_TYPES} placeholder="예: 인사이트, 현장 기록, 슬랙 모멘트…" />
          <SelectField label="발행자" value={draft.publisher} onChange={(v) => update('publisher', v as Publisher)} options={PUBLISHER_OPTIONS} />
        </div>

        <BodyListManager
          bodySlides={draft.bodySlides}
          activeBodyId={activeEntry.kind === 'body' ? activeEntry.body.id : null}
          onSelect={selectBody}
          addBody={handleAddBody}
          removeBody={removeBody}
          moveBody={moveBody}
        />

        <div className="tab-bar">
          {slideOrder.map((entry, i) => (
            <button
              key={i}
              className={`tab-item${safeTab === i ? ' active' : ''}`}
              onClick={() => { setActiveTab(i); setSelectedId(null); }}
            >
              {entryLabel(entry)}
            </button>
          ))}
        </div>

        <div className="editor-content">
          {renderEditor()}
          <CharacterPromptPanel
            publisher={draft.publisher}
            contentType={draft.contentType}
            slideType={promptSlideType}
            seed={draft.week}
          />
        </div>
      </div>

      {/* 우측: 미리보기 */}
      <div className="studio-preview" onClick={() => setSelectedId(null)}>
        <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          현재 슬라이드: {safeTab + 1} / {slideOrder.length} · {entryLabel(activeEntry)}
          {(activeEntry.kind === 'cover' || (activeEntry.kind === 'body' && activeEntry.body.images.length > 0)) && (
            <span style={{ marginLeft: 12, color: '#999' }}>· 이미지 클릭 후 드래그/리사이즈</span>
          )}
        </div>
        <div className="preview-frame">
          <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left', width: 1080, height: 1350 }}>
            {renderEditableSlide(activeEntry)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 캐릭터 AI 프롬프트 생성 패널 ── */
function CharacterPromptPanel({
  publisher, contentType, slideType, seed,
}: {
  publisher: Publisher;
  contentType: string;
  slideType: 'cover' | 'cta' | 'body';
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

  const slideLabel = slideType === 'cover' ? '표지' : slideType === 'cta' ? 'CTA' : '본문';

  return (
    <div style={{ marginTop: 20, padding: 14, background: '#1A1F36', borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FFE67A' }}>🤖 캐릭터 AI 프롬프트 ({publisher} · {slideLabel})</span>
        <button onClick={handleCopy} style={{ background: '#FFE67A', color: '#1A1F36', border: 'none', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 999, cursor: 'pointer' }}>
          {copied ? '✅ 복사됨' : '📋 복사'}
        </button>
      </div>
      <textarea readOnly value={prompt} rows={7} style={{ width: '100%', fontSize: 11, lineHeight: 1.5, color: '#E8EAF0', background: '#111528', border: '1px solid #2A3050', borderRadius: 6, padding: 10, resize: 'vertical', fontFamily: 'monospace' }} />
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
        Midjourney·DALL·E·나노바나나 등에 붙여넣어 캐릭터를 만든 뒤, 투명 PNG로 업로드하세요.
      </div>
    </div>
  );
}

/* ── CTA 캐릭터: 이미지/영상 택1 업로더 ── */
function CtaCharacterField({ value, onChange }: { value: ImageItem | null; onChange: (v: ImageItem | null) => void }) {
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'video' && file.size > 50 * 1024 * 1024) {
      alert('영상 파일은 50MB 이하만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (ev.target?.result) {
        const src = ev.target.result as string;
        const aspect = await measureAspect(src, type);
        onChange(createImageItem(src, type, aspect));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className="field-group">
      <label className="field-label">🧽 캐릭터 이미지/영상</label>
      <div className="upload-buttons">
        <button className="btn-add-media btn-add-image" type="button" onClick={() => imgRef.current?.click()}>📷 이미지</button>
        <button className="btn-add-media btn-add-video" type="button" onClick={() => vidRef.current?.click()}>🎥 영상</button>
        {value && <button className="btn-icon btn-remove" type="button" onClick={() => onChange(null)}>✕</button>}
      </div>
      <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e, 'image')} />
      <input ref={vidRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleFile(e, 'video')} />
      {value && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
          {value.type === 'video' ? '🎥 영상' : '📷 이미지'} 업로드됨
        </div>
      )}
    </div>
  );
}
