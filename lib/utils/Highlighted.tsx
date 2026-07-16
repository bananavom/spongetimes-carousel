import { COLORS } from '@/lib/tokens';
import { Fragment, ReactNode } from 'react';

// 오렌지 형광펜: 강조어 뒤에 absolute 색 막대를 깔아 하이라이트.
// 막대 크기는 fontSize에 비례해 표지/CTA 어디서든 자연스럽게 스케일.
function Mark({ children, fontSize, color }: { children: ReactNode; fontSize: number; color: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: -fontSize * 0.06,
          right: -fontSize * 0.06,
          bottom: fontSize * 0.08,
          height: fontSize * 0.36,
          background: color,
          borderRadius: 4,
          zIndex: 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
}

function renderLine(line: string, highlight: string, fontSize: number, color: string): ReactNode {
  if (!highlight || !line.includes(highlight)) return line || ' ';
  const idx = line.indexOf(highlight);
  const before = line.slice(0, idx);
  const after = line.slice(idx + highlight.length);
  return (
    <>
      {before}
      <Mark fontSize={fontSize} color={color}>{highlight}</Mark>
      {after}
    </>
  );
}

/**
 * 멀티라인 텍스트를 줄바꿈(\n) 단위로 렌더하며, highlight 문자열이 등장하는
 * 첫 위치에 오렌지 형광펜을 적용한다.
 */
export function Highlighted({
  text,
  highlight,
  fontSize,
  color = COLORS.highlighter,
}: {
  text: string;
  highlight: string;
  fontSize: number;
  color?: string;
}) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>{renderLine(line, highlight, fontSize, color)}</div>
      ))}
    </>
  );
}
