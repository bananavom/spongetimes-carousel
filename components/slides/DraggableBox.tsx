'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

type Position = { x: number; y: number };
type Size = { width: number; height: number };

type DraggableBoxProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  onChange: (updates: { x?: number; y?: number; width?: number; height?: number }) => void;
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  containerWidth: number;
  containerHeight: number;
  containerScale: number;
  minSize?: number;
  maxSize?: number;
  aspectRatio?: number; // 정사각형 등 고정 비율
};

export function DraggableBox({
  x,
  y,
  width,
  height,
  onChange,
  selected,
  onSelect,
  children,
  containerWidth,
  containerHeight,
  containerScale,
  minSize = 50,
  maxSize = 900,
  aspectRatio,
}: DraggableBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [startBox, setStartBox] = useState({ x, y, width, height });

  // 마우스 다운 - 드래그 시작
  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartBox({ x, y, width, height });
  }

  // 리사이즈 핸들 마우스 다운
  function handleResizeStart(e: React.MouseEvent, corner: string) {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setIsResizing(corner);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartBox({ x, y, width, height });
  }

  // 전역 마우스 이동/업
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    function handleMouseMove(e: MouseEvent) {
      const deltaX = (e.clientX - startPos.x) / containerScale;
      const deltaY = (e.clientY - startPos.y) / containerScale;

      if (isDragging) {
        // 위치 이동
        let newX = startBox.x + deltaX;
        let newY = startBox.y + deltaY;
        
        // 경계 체크
        const halfW = width / 2;
        const halfH = height / 2;
        newX = Math.max(halfW, Math.min(containerWidth - halfW, newX));
        newY = Math.max(halfH, Math.min(containerHeight - halfH, newY));
        
        onChange({ x: newX, y: newY });
      } else if (isResizing) {
        // 크기 조절
        let newWidth = startBox.width;
        let newHeight = startBox.height;
        let newX = startBox.x;
        let newY = startBox.y;

        if (aspectRatio) {
          // 정사각형/고정 비율
          const change = isResizing.includes('right') || isResizing.includes('bottom') 
            ? Math.max(deltaX, deltaY) 
            : Math.max(-deltaX, -deltaY);
          newWidth = Math.max(minSize, Math.min(maxSize, startBox.width + change * 2));
          newHeight = newWidth / aspectRatio;
        } else {
          // 자유 크기 (좌우/상하 독립)
          if (isResizing.includes('right')) {
            newWidth = Math.max(minSize, Math.min(maxSize, startBox.width + deltaX * 2));
          }
          if (isResizing.includes('left')) {
            newWidth = Math.max(minSize, Math.min(maxSize, startBox.width - deltaX * 2));
          }
          if (isResizing.includes('bottom')) {
            newHeight = Math.max(minSize, Math.min(maxSize, startBox.height + deltaY * 2));
          }
          if (isResizing.includes('top')) {
            newHeight = Math.max(minSize, Math.min(maxSize, startBox.height - deltaY * 2));
          }
        }

        onChange({ 
          x: newX, 
          y: newY, 
          width: newWidth, 
          height: newHeight 
        });
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
      setIsResizing(null);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startPos, startBox, containerWidth, containerHeight, containerScale, width, height, onChange, aspectRatio, minSize, maxSize]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        outline: selected ? '2px solid #FF6B9D' : 'none',
        outlineOffset: 4,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      {children}

      {/* 리사이즈 핸들 (선택됐을 때만) */}
      {selected && (
        <>
          {/* 4개 모서리 핸들 */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
            <div
              key={corner}
              className={`resize-handle resize-${corner}`}
              onMouseDown={(e) => handleResizeStart(e, corner)}
              style={{
                position: 'absolute',
                width: 20,
                height: 20,
                background: '#FF6B9D',
                border: '3px solid #fff',
                borderRadius: '50%',
                cursor: corner === 'top-left' || corner === 'bottom-right' ? 'nwse-resize' : 'nesw-resize',
                ...(corner.includes('top') ? { top: -10 } : { bottom: -10 }),
                ...(corner.includes('left') ? { left: -10 } : { right: -10 }),
                zIndex: 10,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
