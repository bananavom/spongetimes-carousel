'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">🍍 데굴데굴 캐러셀 v2</h1>
        <p className="text-xl text-gray-600 mb-8">스폰지클럽 1기 인스타그램 캐러셀 자동 생성 도구</p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">새로운 기능</h2>
          <ul className="text-left space-y-3 text-lg mb-8">
            <li>✅ 모든 슬라이드(1~6) 자유롭게 수정 가능</li>
            <li>✅ 각 슬라이드별 텍스트 + 이미지 업로드</li>
            <li>✅ 주차 자동 업데이트 (W1~W7)</li>
            <li>✅ PNG 다운로드</li>
            <li>✅ localStorage 자동 저장</li>
            <li>✅ 애니메이션 지원</li>
          </ul>
          
          <a
            href="/editor"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 px-8 rounded-lg hover:from-pink-600 hover:to-purple-600 transition text-xl"
          >
            🚀 에디터로 시작하기
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2">자유로운 편집</h3>
            <p className="text-gray-600">모든 텍스트와 이미지를 커스터마이징</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="font-bold text-lg mb-2">자동 저장</h3>
            <p className="text-gray-600">localStorage에 자동으로 데이터 저장</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-4xl mb-3">📥</div>
            <h3 className="font-bold text-lg mb-2">빠른 내보내기</h3>
            <p className="text-gray-600">PNG로 쉽게 다운로드</p>
          </div>
        </div>
      </div>
    </div>
  );
}
