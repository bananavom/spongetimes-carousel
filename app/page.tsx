'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_SLIDES, DegulgulSlide } from '@/lib/types/degulgul';

export default function Home() {
  const [week, setWeek] = useState(2);
  const [slides, setSlides] = useState<DegulgulSlide[]>([]);
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(false);

  // 초기 로드
  useEffect(() => {
    const defaultSlides = DEFAULT_SLIDES();
    setSlides(defaultSlides);
    generateSVG(defaultSlides, week);
  }, []);

  // SVG 생성 함수
  const generateSVG = async (slidesToUse: DegulgulSlide[], weekNum: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'degulgul',
          week: weekNum,
          slides: slidesToUse.map(s => ({ id: s.id, content: s.content }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setSvgContent(data.svg);
      }
    } catch (error) {
      console.error('SVG 생성 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 주차 변경 시
  const handleWeekChange = (newWeek: number) => {
    setWeek(newWeek);
    const updatedSlides = [...slides];
    if (updatedSlides[4]?.content) {
      updatedSlides[4].content.currentWeek = newWeek;
    }
    generateSVG(updatedSlides, newWeek);
  };

  // 슬라이드 내용 변경
  const handleSlideChange = (slideIdx: number, field: string, value: string) => {
    const updatedSlides = [...slides];
    if (updatedSlides[slideIdx]) {
      updatedSlides[slideIdx].content[field] = value;
      setSlides(updatedSlides);
      generateSVG(updatedSlides, week);
    }
  };

  // SVG 다운로드
  const downloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `degulgul-week${week}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍍 데굴데굴 캐러셀</h1>
          <p className="text-gray-600">스폰지클럽 1기 인스타그램 캐러셀 자동 생성기</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 에디터 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">⚙️ 에디터</h2>

            {/* 주차 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 주차 (1-7주)
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={week}
                onChange={(e) => handleWeekChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-center text-2xl font-bold text-pink-600 mt-2">W{week}</p>
            </div>

            {/* 슬라이드 1: 히어로 */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-700 mb-3">슬라이드 1: 히어로</h3>
              <textarea
                value={slides[0]?.content?.mainText || ''}
                onChange={(e) => handleSlideChange(0, 'mainText', e.target.value)}
                placeholder="주 제목"
                className="w-full p-2 border rounded mb-3 text-sm"
                rows={3}
              />
              <textarea
                value={slides[0]?.content?.subText || ''}
                onChange={(e) => handleSlideChange(0, 'subText', e.target.value)}
                placeholder="부제목"
                className="w-full p-2 border rounded text-sm"
                rows={2}
              />
            </div>

            {/* 슬라이드 4: 컨셉 */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-700 mb-3">슬라이드 4: 컨셉</h3>
              <textarea
                value={slides[3]?.content?.emphasis || ''}
                onChange={(e) => handleSlideChange(3, 'emphasis', e.target.value)}
                placeholder="강조 텍스트"
                className="w-full p-2 border rounded mb-3 text-sm"
                rows={2}
              />
            </div>

            {/* 다운로드 버튼 */}
            <button
              onClick={downloadSVG}
              disabled={loading || !svgContent}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '생성 중...' : '📥 SVG 다운로드'}
            </button>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">👀 미리보기</h2>

            {loading && (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <p>캐러셀 생성 중...</p>
              </div>
            )}

            {!loading && svgContent && (
              <div className="overflow-x-auto bg-gray-100 rounded-lg p-4">
                <div
                  className="inline-block"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  style={{ minWidth: '680px' }}
                />
              </div>
            )}

            {!loading && !svgContent && (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <p>캐러셀을 생성하는 중입니다...</p>
              </div>
            )}
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📖 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-pink-600 mb-2">🎯 구성</h3>
              <p className="text-sm text-gray-600">
                6장의 슬라이드로 구성된 인스타그램 캐러셀입니다. 각 주차별로 자동 업데이트됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-blue-600 mb-2">🔄 자동화</h3>
              <p className="text-sm text-gray-600">
                Make 웹훅으로 구글시트와 연동하면 매주 자동 생성 가능합니다.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-purple-600 mb-2">📱 공유</h3>
              <p className="text-sm text-gray-600">
                SVG를 다운로드한 후 인스타그램에 업로드하면 됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
