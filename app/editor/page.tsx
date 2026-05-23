'use client';

import { useState, useRef, useEffect } from 'react';
import { useCarouselDraft, CarouselDraft } from '@/lib/hooks/useCarouselDraft';
import html2canvas from 'html2canvas';

export default function EditorPage() {
  const { draft, updateField, isLoaded } = useCarouselDraft();
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  
  const slideRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  // 슬라이드별 에디터 UI
  const renderEditor = () => {
    switch (activeSlide) {
      case 1:
        return (
          <div className="space-y-4">
            <TextField
              label="메인 텍스트"
              value={draft.slide1_mainText}
              onChange={(v) => updateField('slide1_mainText', v)}
            />
            <TextField
              label="서브 텍스트"
              value={draft.slide1_subText}
              onChange={(v) => updateField('slide1_subText', v)}
            />
            <ImageField
              label="이미지"
              value={draft.slide1_imageUrl}
              onChange={(v) => updateField('slide1_imageUrl', v)}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <TextField
              label="제목 1"
              value={draft.slide2_title1}
              onChange={(v) => updateField('slide2_title1', v)}
            />
            <TextField
              label="제목 2"
              value={draft.slide2_title2}
              onChange={(v) => updateField('slide2_title2', v)}
            />
            <TextareaField
              label="설명"
              value={draft.slide2_description}
              onChange={(v) => updateField('slide2_description', v)}
            />
            <ImageField
              label="이미지"
              value={draft.slide2_imageUrl}
              onChange={(v) => updateField('slide2_imageUrl', v)}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <TextField
              label="제목 1"
              value={draft.slide3_title1}
              onChange={(v) => updateField('slide3_title1', v)}
            />
            <TextField
              label="제목 2"
              value={draft.slide3_title2}
              onChange={(v) => updateField('slide3_title2', v)}
            />
            <TextField
              label="제목 3"
              value={draft.slide3_title3}
              onChange={(v) => updateField('slide3_title3', v)}
            />
            <TextareaField
              label="부제목"
              value={draft.slide3_subTitle}
              onChange={(v) => updateField('slide3_subTitle', v)}
            />
            <ImageField
              label="이미지"
              value={draft.slide3_imageUrl}
              onChange={(v) => updateField('slide3_imageUrl', v)}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <TextField
              label="제목 1"
              value={draft.slide4_title1}
              onChange={(v) => updateField('slide4_title1', v)}
            />
            <TextField
              label="제목 2"
              value={draft.slide4_title2}
              onChange={(v) => updateField('slide4_title2', v)}
            />
            <TextField
              label="강조 텍스트"
              value={draft.slide4_emphasis}
              onChange={(v) => updateField('slide4_emphasis', v)}
            />
            <TextField
              label="본문 1"
              value={draft.slide4_body1}
              onChange={(v) => updateField('slide4_body1', v)}
            />
            <TextField
              label="본문 2"
              value={draft.slide4_body2}
              onChange={(v) => updateField('slide4_body2', v)}
            />
            <ImageField
              label="이미지"
              value={draft.slide4_imageUrl}
              onChange={(v) => updateField('slide4_imageUrl', v)}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <TextField
              label="제목"
              value={draft.slide5_title}
              onChange={(v) => updateField('slide5_title', v)}
            />
            <ImageField
              label="이미지"
              value={draft.slide5_imageUrl}
              onChange={(v) => updateField('slide5_imageUrl', v)}
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <TextField
              label="메인 텍스트"
              value={draft.slide6_mainText}
              onChange={(v) => updateField('slide6_mainText', v)}
            />
            <TextField
              label="본문 1"
              value={draft.slide6_body1}
              onChange={(v) => updateField('slide6_body1', v)}
            />
            <TextField
              label="본문 2"
              value={draft.slide6_body2}
              onChange={(v) => updateField('slide6_body2', v)}
            />
            <TextField
              label="본문 3"
              value={draft.slide6_body3}
              onChange={(v) => updateField('slide6_body3', v)}
            />
            <TextField
              label="본문 4"
              value={draft.slide6_body4}
              onChange={(v) => updateField('slide6_body4', v)}
            />
            <TextField
              label="본문 5"
              value={draft.slide6_body5}
              onChange={(v) => updateField('slide6_body5', v)}
            />
            <ImageField
              label="이미지"
              value={draft.slide6_imageUrl}
              onChange={(v) => updateField('slide6_imageUrl', v)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // 슬라이드 렌더링
  const renderSlide = () => {
    const slideNum = activeSlide;
    const bgColor = slideNum === 1 ? '#FEE67A' : '#FDFCEA';
    
    return (
      <div
        ref={(el) => {
          if (el) slideRefs.current[slideNum] = el;
        }}
        style={{
          width: '1080px',
          height: '1350px',
          backgroundColor: bgColor,
          overflow: 'hidden',
          position: 'relative',
          fontFamily: 'PRETENDARD, sans-serif',
        }}
      >
        {slideNum === 1 && <Slide1 draft={draft} />}
        {slideNum === 2 && <Slide2 draft={draft} />}
        {slideNum === 3 && <Slide3 draft={draft} />}
        {slideNum === 4 && <Slide4 draft={draft} />}
        {slideNum === 5 && <Slide5 draft={draft} />}
        {slideNum === 6 && <Slide6 draft={draft} />}
      </div>
    );
  };

  // PNG 다운로드
  const downloadPNG = async () => {
    setIsExporting(true);
    try {
      const element = slideRefs.current[activeSlide];
      if (!element) return;

      const canvas = await html2canvas(element, {
        width: 1080,
        height: 1350,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `degulgul-slide${activeSlide}-w${draft.week}.png`;
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🍍 데굴데굴 캐러셀 v2</h1>

        <div className="grid grid-cols-4 gap-8">
          {/* 좌측: 에디터 */}
          <div className="col-span-1 bg-white rounded-lg p-6 shadow">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">주차</label>
              <input
                type="range"
                min="1"
                max="7"
                value={draft.week}
                onChange={(e) => updateField('week', Number(e.target.value))}
                className="w-full"
              />
              <p className="text-2xl font-bold text-pink-600 text-center mt-2">W{draft.week}</p>
            </div>

            {/* 슬라이드 탭 */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveSlide(num)}
                  className={`py-2 px-3 rounded font-medium transition ${
                    activeSlide === num
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  슬라이드 {num}
                </button>
              ))}
            </div>

            {/* 슬라이드별 에디터 */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {renderEditor()}
            </div>

            {/* 다운로드 버튼 */}
            <button
              onClick={downloadPNG}
              disabled={isExporting}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition"
            >
              {isExporting ? '내보내는 중...' : '📥 PNG 다운로드'}
            </button>
          </div>

          {/* 우측: 미리보기 */}
          <div className="col-span-3 bg-white rounded-lg p-6 shadow flex items-center justify-center">
            <div style={{ transform: 'scale(0.35)', transformOrigin: 'top left' }}>
              {renderSlide()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 입력 컴포넌트들
function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="이미지 URL 입력"
        className="w-full px-3 py-2 border rounded-lg text-sm"
      />
    </div>
  );
}

// 슬라이드 컴포넌트들
function Slide1({ draft }: { draft: CarouselDraft }) {
  const lines = draft.slide1_mainText.split('\n');
  return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#333' }}>
      {lines.map((line, i) => (
        <div key={i} style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
          {line}
        </div>
      ))}
      {draft.slide1_imageUrl && (
        <img
          src={draft.slide1_imageUrl}
          alt="slide1"
          style={{
            width: '300px',
            height: '300px',
            margin: '40px auto',
            objectFit: 'contain',
          }}
        />
      )}
      <div style={{ fontSize: '20px', marginTop: '40px' }}>{draft.slide1_subText}</div>
    </div>
  );
}

function Slide2({ draft }: { draft: CarouselDraft }) {
  return (
    <div style={{ padding: '60px', color: '#333' }}>
      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        {draft.slide2_title1}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px' }}>
        {draft.slide2_title2}
      </div>
      {draft.slide2_imageUrl && (
        <img
          src={draft.slide2_imageUrl}
          alt="slide2"
          style={{ width: '100%', height: '300px', objectFit: 'contain', marginBottom: '40px' }}
        />
      )}
      <div style={{ fontSize: '20px', lineHeight: '1.6' }}>{draft.slide2_description}</div>
    </div>
  );
}

function Slide3({ draft }: { draft: CarouselDraft }) {
  return (
    <div style={{ padding: '60px', color: '#333' }}>
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
        {draft.slide3_title1}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
        {draft.slide3_title2}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '40px' }}>
        {draft.slide3_title3}
      </div>
      {draft.slide3_imageUrl && (
        <img
          src={draft.slide3_imageUrl}
          alt="slide3"
          style={{ width: '100%', height: '300px', objectFit: 'contain', marginBottom: '40px' }}
        />
      )}
      <div style={{ fontSize: '18px', lineHeight: '1.6' }}>{draft.slide3_subTitle}</div>
    </div>
  );
}

function Slide4({ draft }: { draft: CarouselDraft }) {
  return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#333' }}>
      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        {draft.slide4_title1}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        {draft.slide4_title2}
      </div>
      <div
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#E24B4A',
          backgroundColor: '#FFE5E5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '40px',
        }}
      >
        {draft.slide4_emphasis}
      </div>
      {draft.slide4_imageUrl && (
        <img
          src={draft.slide4_imageUrl}
          alt="slide4"
          style={{ width: '300px', height: '300px', margin: '40px auto', objectFit: 'contain' }}
        />
      )}
      <div style={{ fontSize: '20px', marginTop: '40px' }}>
        <p>{draft.slide4_body1}</p>
        <p>{draft.slide4_body2}</p>
      </div>
    </div>
  );
}

function Slide5({ draft }: { draft: CarouselDraft }) {
  return (
    <div style={{ padding: '60px', color: '#333' }}>
      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px' }}>
        {draft.slide5_title}
      </div>
      {draft.slide5_imageUrl && (
        <img
          src={draft.slide5_imageUrl}
          alt="slide5"
          style={{ width: '100%', height: '600px', objectFit: 'contain' }}
        />
      )}
    </div>
  );
}

function Slide6({ draft }: { draft: CarouselDraft }) {
  return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#333' }}>
      <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '40px', color: '#3C3489' }}>
        {draft.slide6_mainText}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
        {draft.slide6_body1}
      </div>
      <div style={{ fontSize: '18px', marginBottom: '40px' }}>
        {draft.slide6_body2}
      </div>
      {draft.slide6_imageUrl && (
        <img
          src={draft.slide6_imageUrl}
          alt="slide6"
          style={{ width: '300px', height: '300px', margin: '40px auto', objectFit: 'contain' }}
        />
      )}
      <div style={{ fontSize: '16px', marginTop: '40px', lineHeight: '1.8' }}>
        <p>{draft.slide6_body3}</p>
        <p>{draft.slide6_body4}</p>
        <p>{draft.slide6_body5}</p>
      </div>
    </div>
  );
}
