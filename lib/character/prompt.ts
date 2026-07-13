// 캐릭터 AI 프롬프트 생성 (04-character-prompt.md 기반)
// 발행자/콘텐츠 유형/슬라이드 타입 → 외부 AI 도구(Midjourney·DALL-E 등)용 영문 프롬프트

import { PUBLISHER_META, Publisher, ContentType } from '@/lib/tokens';

type SlideType = 'cover' | 'cta';

// 콘텐츠 유형별 포즈 풀 (표지/본문용)
const CONTENT_POSES: Record<ContentType, string[]> = {
  '현장 기록': [
    'looking through binoculars as an observer',
    'holding a camera, documenting a workshop scene',
    'writing in a notebook',
    'waving hello with a curious expression',
  ],
  '슬랙 모멘트': [
    'typing on a laptop',
    'holding a phone with a chat bubble',
    'giving a thumbs up reaction',
    'looking at floating chat bubbles',
  ],
  '참가자 스포트라이트': [
    'holding a trophy',
    'clapping hands',
    'a welcoming spotlight pose with both arms raised',
    'pointing at something with excitement',
  ],
  '인사이트': [
    'thinking pose with a light bulb floating above the head',
    'showing a tool or gadget',
    'demonstrating something with both hands',
    'an "aha!" eureka moment expression',
  ],
};

// CTA 슬라이드 전용 포즈 풀
const CTA_POSES = [
  'friendly waving pose, looking at the viewer',
  'pointing at the viewer as if asking a question',
  'holding a question mark',
  'leaning forward with an inviting expression',
];

// 결정적 선택 (랜덤 대신 인덱스 기반) — week가 바뀌면 포즈도 순환
function pick<T>(pool: T[], seed: number): T {
  return pool[((seed % pool.length) + pool.length) % pool.length];
}

export function generateCharacterPrompt({
  publisher,
  contentType,
  slideType,
  seed = 0,
  customPose = '',
}: {
  publisher: Publisher;
  contentType: ContentType;
  slideType: SlideType;
  seed?: number;
  customPose?: string;
}): string {
  const colorName = PUBLISHER_META[publisher].colorName;

  const base =
    `A pixel art chibi character: a yellow sponge-shaped mascot with small holes ` +
    `on the surface, wearing a ${colorName} baseball cap and ${colorName} overalls ` +
    `over a white t-shirt. The cap and overalls have a small newspaper logo with a ` +
    `sparkle. Simple pixel smile face (two dot eyes, curve mouth). 32px tall, retro ` +
    `game style.`;

  let pose: string;
  if (customPose.trim()) {
    pose = customPose.trim();
  } else if (slideType === 'cta') {
    pose = pick(CTA_POSES, seed);
  } else {
    pose = pick(CONTENT_POSES[contentType], seed);
  }

  return `${base}\n\n${pose}.\n\nPlain transparent background. Centered composition.`;
}
