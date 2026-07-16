'use client';

import {
  BODY_TEMPLATES, CIRCLE_POSITIONS, CIRCLE_SIZES, CIRCLE_SHAPES, PILL_COLORS,
  SLOWQUICK_9_POSES, Publisher,
} from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';
import type { ImageItem } from '@/lib/state/useCarouselDraft';
import { TextField, TextareaField, SelectField, CheckboxField } from '../Fields';
import { MultiImageEditor } from '../MultiImageEditor';

const COLOR_OPTIONS = PILL_COLORS.map((c) => ({ value: c.value, label: c.label }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

export function BodyEditor({
  slide,
  publisher,
  updateBody,
  addBodyImage,
  updateBodyImage,
  removeBodyImage,
}: {
  slide: BodySlide;
  publisher: Publisher;
  updateBody: (id: string, patch: Partial<BodySlide>) => void;
  addBodyImage: (id: string, src: string, type: 'image' | 'video', aspect: number) => void;
  updateBodyImage: (id: string, imgId: string, patch: Partial<ImageItem>) => void;
  removeBodyImage: (id: string, imgId: string) => void;
}) {
  const set = (patch: Partial<BodySlide>) => updateBody(slide.id, patch);

  return (
    <>
      <SelectField
        label="템플릿"
        value={slide.template}
        onChange={(v) => set({ template: v as BodySlide['template'] })}
        options={BODY_TEMPLATES.map((t) => ({ value: t.value, label: t.label }))}
      />

      <Section title="4코너 & 헤딩">
        <TextField label="카테고리 (좌상단 #NN · CATEGORY)" value={slide.category} onChange={(v) => set({ category: v })} />
        <CheckboxField label="우상단 알약 표시" checked={slide.cornerPill.on} onChange={(v) => set({ cornerPill: { ...slide.cornerPill, on: v } })} />
        {slide.cornerPill.on && (
          <>
            <TextField label="알약 텍스트" value={slide.cornerPill.text} onChange={(v) => set({ cornerPill: { ...slide.cornerPill, text: v } })} />
            <SelectField label="알약 색" value={slide.cornerPill.color} onChange={(v) => set({ cornerPill: { ...slide.cornerPill, color: v as 'dark' | 'yellow' } })} options={COLOR_OPTIONS} />
          </>
        )}
        <CheckboxField label="우하단 ★ 표시" checked={slide.star} onChange={(v) => set({ star: v })} />
        <div style={{ height: 8 }} />
        <CheckboxField label="헤딩 위 알약" checked={slide.headingPill.on} onChange={(v) => set({ headingPill: { ...slide.headingPill, on: v } })} />
        {slide.headingPill.on && (
          <>
            <TextField label="헤딩 알약 텍스트" value={slide.headingPill.text} onChange={(v) => set({ headingPill: { ...slide.headingPill, text: v } })} />
            <SelectField label="헤딩 알약 색" value={slide.headingPill.color} onChange={(v) => set({ headingPill: { ...slide.headingPill, color: v as 'dark' | 'yellow' } })} options={COLOR_OPTIONS} />
          </>
        )}
        <TextareaField label="헤딩 (줄바꿈 지원)" value={slide.heading} onChange={(v) => set({ heading: v })} rows={2} />
        <CheckboxField label="부캡션 표시" checked={slide.subcaption.on} onChange={(v) => set({ subcaption: { ...slide.subcaption, on: v } })} />
        {slide.subcaption.on && (
          <TextField label="부캡션" value={slide.subcaption.text} onChange={(v) => set({ subcaption: { ...slide.subcaption, text: v } })} />
        )}
      </Section>

      <Section title="배경 데코 (노란 원)">
        <CheckboxField label="노란 원 데코 표시" checked={slide.circle.on} onChange={(v) => set({ circle: { ...slide.circle, on: v } })} />
        {slide.circle.on && (
          <>
            <SelectField label="위치" value={slide.circle.position} onChange={(v) => set({ circle: { ...slide.circle, position: v as BodySlide['circle']['position'] } })} options={CIRCLE_POSITIONS.map((o) => ({ value: o.value, label: o.label }))} />
            <SelectField label="크기" value={slide.circle.size} onChange={(v) => set({ circle: { ...slide.circle, size: v as BodySlide['circle']['size'] } })} options={CIRCLE_SIZES.map((o) => ({ value: o.value, label: o.label }))} />
            <SelectField label="모양" value={slide.circle.shape} onChange={(v) => set({ circle: { ...slide.circle, shape: v as BodySlide['circle']['shape'] } })} options={CIRCLE_SHAPES.map((o) => ({ value: o.value, label: o.label }))} />
          </>
        )}
      </Section>

      <Section title="이미지 / 영상 슬롯">
        <MultiImageEditor
          images={slide.images}
          onAdd={(src, type, aspect) => addBodyImage(slide.id, src, type, aspect)}
          onUpdate={(imgId, patch) => updateBodyImage(slide.id, imgId, patch)}
          onRemove={(imgId) => removeBodyImage(slide.id, imgId)}
        />
        {slide.template === 'SIDE_PROFILE' && (
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>💡 첫 번째 이미지는 우측 슬롯에 표시됩니다.</div>
        )}
        {publisher === '슬로우퀵' && (
          <SelectField
            label="🧽 슬로우퀵 9포즈 (프롬프트용)"
            value={String(slide.pose)}
            onChange={(v) => set({ pose: Number(v) })}
            options={SLOWQUICK_9_POSES.map((p, i) => ({ value: String(i), label: p.label }))}
          />
        )}
      </Section>

      <Section title="콘텐츠">
        <TemplateFields slide={slide} set={set} />
      </Section>
    </>
  );
}

function TemplateFields({ slide, set }: { slide: BodySlide; set: (patch: Partial<BodySlide>) => void }) {
  switch (slide.template) {
    case 'HERO':
      return <TextareaField label="본문" value={slide.heroBody} onChange={(v) => set({ heroBody: v })} rows={3} />;
    case 'QUOTE':
      return (
        <>
          <TextareaField label="인용문" value={slide.quote.text} onChange={(v) => set({ quote: { ...slide.quote, text: v } })} rows={3} />
          <TextField label="출처" value={slide.quote.source} onChange={(v) => set({ quote: { ...slide.quote, source: v } })} />
          <CheckboxField label="형광펜 강조" checked={slide.quote.emphasis.on} onChange={(v) => set({ quote: { ...slide.quote, emphasis: { ...slide.quote.emphasis, on: v } } })} />
          {slide.quote.emphasis.on && (
            <TextField label="강조 단어" value={slide.quote.emphasis.text} onChange={(v) => set({ quote: { ...slide.quote, emphasis: { ...slide.quote.emphasis, text: v } } })} />
          )}
        </>
      );
    case 'QUOTE_MULTI':
      return (
        <>
          {slide.quoteMulti.map((q, i) => (
            <div key={i} style={{ border: '1px solid #eee', borderRadius: 6, padding: 8, marginBottom: 8 }}>
              <CheckboxField label={`인용 ${i + 1} 표시`} checked={q.on} onChange={(v) => set({ quoteMulti: slide.quoteMulti.map((x, j) => (j === i ? { ...x, on: v } : x)) })} />
              {q.on && (
                <>
                  <TextareaField label="인용" value={q.text} onChange={(v) => set({ quoteMulti: slide.quoteMulti.map((x, j) => (j === i ? { ...x, text: v } : x)) })} rows={2} />
                  <TextField label="출처" value={q.source} onChange={(v) => set({ quoteMulti: slide.quoteMulti.map((x, j) => (j === i ? { ...x, source: v } : x)) })} />
                </>
              )}
            </div>
          ))}
        </>
      );
    case 'FLOW':
      return (
        <>
          {slide.flow.map((f, i) => (
            <div key={i} style={{ border: '1px solid #eee', borderRadius: 6, padding: 8, marginBottom: 8 }}>
              <CheckboxField label={`단계 ${i + 1} 표시`} checked={f.on} onChange={(v) => set({ flow: slide.flow.map((x, j) => (j === i ? { ...x, on: v } : x)) })} />
              {f.on && (
                <>
                  <TextField label="제목/인물" value={f.person} onChange={(v) => set({ flow: slide.flow.map((x, j) => (j === i ? { ...x, person: v } : x)) })} />
                  <TextField label="한 마디" value={f.line} onChange={(v) => set({ flow: slide.flow.map((x, j) => (j === i ? { ...x, line: v } : x)) })} />
                </>
              )}
            </div>
          ))}
        </>
      );
    case 'SIDE_PROFILE':
      return (
        <>
          {slide.side.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <input type="checkbox" checked={s.on} onChange={(e) => set({ side: slide.side.map((x, j) => (j === i ? { ...x, on: e.target.checked } : x)) })} style={{ accentColor: '#1A1F36' }} />
              <input className="field-input" value={s.text} onChange={(e) => set({ side: slide.side.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} style={{ flex: 1 }} />
            </div>
          ))}
          <div style={{ fontSize: 11, color: '#6b7280' }}>💡 우측 이미지는 &ldquo;이미지 슬롯&rdquo;에서 업로드하세요.</div>
        </>
      );
    case 'GRID_HERO':
      return (
        <>
          {slide.grid.map((c, i) => (
            <div key={i} style={{ border: '1px solid #eee', borderRadius: 6, padding: 8, marginBottom: 8 }}>
              <CheckboxField label={`카드 ${i + 1} 표시`} checked={c.on} onChange={(v) => set({ grid: slide.grid.map((x, j) => (j === i ? { ...x, on: v } : x)) })} />
              <TextField label="태그" value={c.tag} onChange={(v) => set({ grid: slide.grid.map((x, j) => (j === i ? { ...x, tag: v } : x)) })} />
              <TextField label="설명" value={c.text} onChange={(v) => set({ grid: slide.grid.map((x, j) => (j === i ? { ...x, text: v } : x)) })} />
            </div>
          ))}
        </>
      );
    default:
      return null;
  }
}
