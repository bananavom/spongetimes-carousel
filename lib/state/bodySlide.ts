// 본문(Body) 슬라이드 데이터 모델 (DESIGN-BODY.md — README 요약 기반)

import type { BodyTemplate, CirclePosition, CircleSize, CircleShape, PillColor } from '@/lib/tokens';
import type { ImageItem } from '@/lib/state/useCarouselDraft';

export type Pill = { on: boolean; text: string; color: PillColor };
export type Subcaption = { on: boolean; text: string };
export type CircleDeco = { on: boolean; position: CirclePosition; size: CircleSize; shape: CircleShape };

export type QuoteItem = { on: boolean; text: string; source: string };
export type FlowItem = { on: boolean; person: string; line: string };
export type SideItem = { on: boolean; text: string };
export type GridCard = { on: boolean; tag: string; text: string };

export type BodySlide = {
  id: string;
  template: BodyTemplate;

  // 4코너 anchor
  category: string;          // 좌상단 #NN · CATEGORY
  cornerPill: Pill;          // 우상단
  star: boolean;             // 우하단 ★ (좌하단 NN/total 은 자동)

  // 헤딩 블록(공통)
  headingPill: Pill;         // 헤딩 위 알약
  heading: string;
  subcaption: Subcaption;

  // 배경 데코 + 이미지/영상 슬롯 (멀티)
  circle: CircleDeco;
  images: ImageItem[];
  pose: number; // 슬로우퀵 9포즈 인덱스 (프롬프트용)

  // 템플릿별 콘텐츠 (전부 존재, template 로 렌더 분기)
  heroBody: string;                       // HERO
  quote: { text: string; source: string; emphasis: { on: boolean; text: string } }; // QUOTE
  quoteMulti: QuoteItem[];                // QUOTE_MULTI (3~5)
  flow: FlowItem[];                       // FLOW (≤4)
  side: SideItem[];                       // SIDE_PROFILE
  grid: GridCard[];                       // GRID_HERO (4)
};

let __seq = 0;
function uid() {
  __seq += 1;
  return `body_${Date.now()}_${__seq}_${Math.random().toString(36).slice(2, 6)}`;
}

export function createBodySlide(template: BodyTemplate): BodySlide {
  return {
    id: uid(),
    template,
    category: 'MISSION',
    cornerPill: { on: true, text: 'Week 1', color: 'dark' },
    star: true,
    headingPill: { on: false, text: '라벨', color: 'dark' },
    heading: defaultHeading(template),
    subcaption: { on: true, text: '헤딩 아래 한 줄 부캡션' },
    circle: { on: template === 'HERO', position: 'top-right', size: 'md', shape: 'circle' },
    images: [],
    pose: 0,

    heroBody: '이 섹션에서 다룰 내용을\n짧게 소개하는 본문입니다.',
    quote: {
      text: '가장 인상 깊었던 건\n서로의 진짜 이야기였어요.',
      source: '— 멤버 이름',
      emphasis: { on: true, text: '진짜 이야기' },
    },
    quoteMulti: [
      { on: true, text: '첫 번째 멤버의 한 마디입니다.', source: '— 멤버 A' },
      { on: true, text: '두 번째 멤버의 한 마디입니다.', source: '— 멤버 B' },
      { on: true, text: '세 번째 멤버의 한 마디입니다.', source: '— 멤버 C' },
      { on: false, text: '네 번째 멤버의 한 마디입니다.', source: '— 멤버 D' },
      { on: false, text: '다섯 번째 멤버의 한 마디입니다.', source: '— 멤버 E' },
    ],
    flow: [
      { on: true, person: '1단계', line: '먼저 이렇게 시작해요.' },
      { on: true, person: '2단계', line: '그다음 이걸 해요.' },
      { on: true, person: '3단계', line: '마지막으로 마무리해요.' },
      { on: false, person: '4단계', line: '추가 단계입니다.' },
    ],
    side: [
      { on: true, text: '첫 번째 항목' },
      { on: true, text: '두 번째 항목' },
      { on: true, text: '세 번째 항목' },
      { on: false, text: '네 번째 항목' },
    ],
    grid: [
      { on: true, tag: 'TYPE A', text: '첫 번째 카드 설명' },
      { on: true, tag: 'TYPE B', text: '두 번째 카드 설명' },
      { on: true, tag: 'TYPE C', text: '세 번째 카드 설명' },
      { on: true, tag: 'TYPE D', text: '네 번째 카드 설명' },
    ],
  };
}

function defaultHeading(template: BodyTemplate): string {
  switch (template) {
    case 'HERO': return '이번 주\n핵심 이야기';
    case 'QUOTE': return '멤버의 한 마디';
    case 'QUOTE_MULTI': return '멤버들의 목소리';
    case 'FLOW': return '이렇게 진행했어요';
    case 'SIDE_PROFILE': return '이번 주 미션 리스트';
    case 'GRID_HERO': return '네 가지 순간';
    default: return '헤딩';
  }
}
