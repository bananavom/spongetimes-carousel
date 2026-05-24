'use client';

import { COLORS } from '@/lib/tokens';
import type { CarouselDraft, ImageItem } from '@/lib/state/useCarouselDraft';
import { MultiImages, DraggableMultiImages } from './AnimatedImage';
import { DraggableBox } from './DraggableBox';
import { useSelection } from '@/lib/state/SelectionContext';

const EMPHASIS_ID = 'concept_emphasis_box';

export function ConceptSlide({ 
  draft, 
  editable = false,
  onImageUpdate,
  onEmphasisUpdate,
  containerScale,
}: { 
  draft: CarouselDraft;
  editable?: boolean;
  onImageUpdate?: (id: string, updates: Partial<ImageItem>) => void;
  onEmphasisUpdate?: (updates: { x?: number; y?: number; width?: number; height?: number }) => void;
  containerScale?: number;
}) {
  return (
    <div style={{ width: 1080, height: 1350, background: COLORS.bodyBg, position: 'relative', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      <div style={{ position: 'absolute', top: 60, left: 60, fontSize: 28, fontWeight: 600, color: COLORS.textSub }}>
        🍍 Week {String(draft.week).padStart(2, '0')} · {draft.concept_name}
      </div>
      <div style={{ position: 'absolute', top: 180, left: 60, right: 60, fontSize: 54, fontWeight: 700, lineHeight: 1.3, color: COLORS.text }}>
        {draft.concept_title1}
      </div>
      <div style={{ position: 'absolute', top: 280, left: 60, right: 60, fontSize: 54, fontWeight: 700, lineHeight: 1.3, color: COLORS.text }}>
        {draft.concept_title2}
      </div>
      
      {/* 강조 박스 (드래그 가능) */}
      {editable && onEmphasisUpdate ? (
        <EmphasisBox draft={draft} onUpdate={onEmphasisUpdate} containerScale={containerScale ?? 0.37} />
      ) : (
        <div style={{ 
          position: 'absolute', 
          left: draft.concept_emphasis_x, 
          top: draft.concept_emphasis_y, 
          width: draft.concept_emphasis_width,
          height: draft.concept_emphasis_height,
          transform: 'translate(-50%, -50%)',
          background: COLORS.accent, 
          color: '#fff', 
          borderRadius: 24, 
          fontSize: draft.concept_emphasis_fontSize, 
          fontWeight: 800, 
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {draft.concept_emphasis}
        </div>
      )}
      
      {editable && onImageUpdate ? (
        <DraggableMultiImages images={draft.concept_images} onUpdate={onImageUpdate} containerScale={containerScale} />
      ) : (
        <MultiImages images={draft.concept_images} />
      )}
      <div style={{ position: 'absolute', bottom: 200, left: 60, right: 60, fontSize: 40, fontWeight: 600, color: COLORS.text, textAlign: 'center', lineHeight: 1.5 }}>
        <p>{draft.concept_body1}</p>
        <p>{draft.concept_body2}</p>
      </div>
      <div style={{ position: 'absolute', bottom: 60, left: 60, fontSize: 24, color: COLORS.textSub }}>
        {draft.authorHandle}
      </div>
    </div>
  );
}

function EmphasisBox({ 
  draft, 
  onUpdate, 
  containerScale 
}: { 
  draft: CarouselDraft;
  onUpdate: (updates: { x?: number; y?: number; width?: number; height?: number }) => void;
  containerScale: number;
}) {
  const { selectedId, setSelectedId } = useSelection();
  const selected = selectedId === EMPHASIS_ID;

  return (
    <DraggableBox
      x={draft.concept_emphasis_x}
      y={draft.concept_emphasis_y}
      width={draft.concept_emphasis_width}
      height={draft.concept_emphasis_height}
      containerWidth={1080}
      containerHeight={1350}
      containerScale={containerScale}
      selected={selected}
      onSelect={() => setSelectedId(EMPHASIS_ID)}
      onChange={onUpdate}
      minSize={80}
      maxSize={1000}
    >
      <div style={{
        width: '100%',
        height: '100%',
        background: COLORS.accent,
        color: '#fff',
        borderRadius: 24,
        fontSize: draft.concept_emphasis_fontSize,
        fontWeight: 800,
        letterSpacing: '-0.02em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        textAlign: 'center',
        padding: 10,
      }}>
        {draft.concept_emphasis}
      </div>
    </DraggableBox>
  );
}
