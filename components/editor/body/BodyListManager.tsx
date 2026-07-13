'use client';

import { useState } from 'react';
import { BODY_TEMPLATES, BodyTemplate } from '@/lib/tokens';
import type { BodySlide } from '@/lib/state/bodySlide';

function templateLabel(t: BodyTemplate) {
  return BODY_TEMPLATES.find((x) => x.value === t)?.value ?? t;
}

// 본문 추가/삭제/순서변경 + 선택
export function BodyListManager({
  bodySlides,
  activeBodyId,
  onSelect,
  addBody,
  removeBody,
  moveBody,
}: {
  bodySlides: BodySlide[];
  activeBodyId: string | null;
  onSelect: (id: string) => void;
  addBody: (template: BodyTemplate) => void;
  removeBody: (id: string) => void;
  moveBody: (id: string, dir: -1 | 1) => void;
}) {
  const [template, setTemplate] = useState<BodyTemplate>('HERO');

  return (
    <div className="common-fields-section">
      <div className="common-fields-title">본문 슬라이드 ({bodySlides.length})</div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <select
          className="field-input"
          value={template}
          onChange={(e) => setTemplate(e.target.value as BodyTemplate)}
          style={{ flex: 1, cursor: 'pointer' }}
        >
          {BODY_TEMPLATES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button className="btn-primary" type="button" onClick={() => addBody(template)} style={{ whiteSpace: 'nowrap' }}>
          + 본문 추가
        </button>
      </div>

      {bodySlides.length === 0 && (
        <div style={{ fontSize: 12, color: '#9ca3af' }}>본문이 없습니다. 템플릿을 골라 추가하세요. (순서: 표지 → 본문 → CTA)</div>
      )}

      {bodySlides.map((b, i) => (
        <div
          key={b.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', marginBottom: 4,
            borderRadius: 6, cursor: 'pointer',
            background: activeBodyId === b.id ? '#FFF3BF' : '#f9fafb',
            border: activeBodyId === b.id ? '1px solid #F0C000' : '1px solid #eee',
          }}
          onClick={() => onSelect(b.id)}
        >
          <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>
            본문 {i + 1} · {templateLabel(b.template)}
          </span>
          <button className="btn-icon" type="button" title="위로" onClick={(e) => { e.stopPropagation(); moveBody(b.id, -1); }}>▲</button>
          <button className="btn-icon" type="button" title="아래로" onClick={(e) => { e.stopPropagation(); moveBody(b.id, 1); }}>▼</button>
          <button className="btn-icon btn-remove" type="button" title="삭제" onClick={(e) => { e.stopPropagation(); removeBody(b.id); }}>✕</button>
        </div>
      ))}
    </div>
  );
}
