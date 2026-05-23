import { NextRequest, NextResponse } from 'next/server';
import { generateDegulgulCarousel } from '@/lib/templates/degulgul';
import { DEFAULT_SLIDES } from '@/lib/types/degulgul';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 기본 설정
    const week = body.week || 2;
    const baseSlides = DEFAULT_SLIDES();
    
    // 사용자 입력으로 슬라이드 업데이트
    const slides = baseSlides.map((slide, idx) => {
      if (body.slides && body.slides[idx]) {
        return {
          ...slide,
          content: {
            ...slide.content,
            ...body.slides[idx].content
          }
        };
      }
      return slide;
    });
    
    // 현재 주차 업데이트
    const slidesCopy = [...slides];
    if (slidesCopy[4] && slidesCopy[4].content) {
      slidesCopy[4].content.currentWeek = week;
    }
    
    // SVG 생성
    const svg = generateDegulgulCarousel(slidesCopy);
    
    // 응답
    return NextResponse.json({
      success: true,
      svg,
      downloadUrl: `/api/carousel/download?format=svg&time=${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Error]', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 간단한 GET 테스트
export async function GET() {
  const slides = DEFAULT_SLIDES();
  const svg = generateDegulgulCarousel(slides);
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}
