// 스폰지타임즈 2기 디자인 시스템 (00-design-system.md 기반)

export const CANVAS = { W: 1080, H: 1350 } as const;

// 디자인 시스템 px는 축소 모킹업(기준폭 ≈ 432px) 기준.
// 실제 1080 캔버스로 렌더할 때 이 배율을 곱한다.
export const SCALE = 2.5;
/** 모킹업 px → 캔버스 px */
export const px = (n: number) => Math.round(n * SCALE);

export const COLORS = {
  // 배경
  coverBg: '#FFE67A',
  bodyBg: '#FFFBED',
  ctaBg: '#FFFBED',
  // 카드
  cardWhite: '#FFFFFF',
  cardYellow: '#FFE67A',
  cardDark: '#1A1F36',
  // 텍스트
  textPrimary: '#1A1F36',
  textOnDark: '#FFE67A',
  mutedLow: 'rgba(26, 31, 54, 0.35)',
  mutedMid: 'rgba(26, 31, 54, 0.55)',
  mutedHigh: 'rgba(26, 31, 54, 0.7)',
  // 강조
  highlighter: 'rgba(255, 152, 0, 0.55)',
} as const;

export const RADIUS = {
  card: px(12),
  smallCard: px(8),
  follow: px(16),
  pill: 999,
} as const;

export const FONT_FAMILY = "'Pretendard', 'Noto Sans KR', sans-serif";

export const PREVIEW_SCALE = 0.37;

// 워크샵 기간 (2기 = 6주)
export const TOTAL_WEEKS = 6;

// 콘텐츠 유형 4종 (02-body.md 유형과 동일)
export const CONTENT_TYPES = [
  '현장 기록',
  '슬랙 모멘트',
  '참가자 스포트라이트',
  '인사이트',
] as const;
export type ContentType = typeof CONTENT_TYPES[number];

// CTA 라벨 프리셋
export const CTA_LABELS = [
  '💬 댓글로 이야기해요',
  '🙌 함께 이야기해봐요',
  '✍️ 의견을 들려주세요',
] as const;

// 발행자 (이름 + 캐릭터 프롬프트용 색상 정보, 04-character-prompt.md 기준)
// 슬로우퀵: 본문(Body) OS 채널 발행자 (9포즈 캐릭터 시스템)
export const PUBLISHERS = ['봄', '위버', '포비', '필리줄리', '슬로우퀵'] as const;
export type Publisher = typeof PUBLISHERS[number];

export const PUBLISHER_META: Record<Publisher, { colorName: string; colorHex: string }> = {
  '봄': { colorName: 'blue', colorHex: '#55C0EF' },
  '위버': { colorName: 'burgundy red', colorHex: '#7A1F3D' },
  '포비': { colorName: 'pink', colorHex: '#F59AC1' },
  '필리줄리': { colorName: 'tiffany blue', colorHex: '#77DCD5' },
  '슬로우퀵': { colorName: 'teal green', colorHex: '#3BB273' },
};

// 슬로우퀵 9포즈 캐릭터 시스템 (DESIGN-BODY.md — README 요약 기반)
// #01 대표/손 흔들기 ~ #09 화이트보드. 라벨은 추후 원본 OS로 미세조정 가능.
export const SLOWQUICK_9_POSES = [
  { label: '#01 대표 · 손 흔들기', prompt: 'a friendly representative hero pose, waving hello with a big smile' },
  { label: '#02 노트 필기', prompt: 'writing in a notebook, focused expression' },
  { label: '#03 카메라 촬영', prompt: 'holding a camera, taking a photo of a scene' },
  { label: '#04 생각 · 전구', prompt: 'a thinking pose with a light bulb floating above the head' },
  { label: '#05 발표 · 손짓', prompt: 'presenting with an open-hand gesture, explaining' },
  { label: '#06 노트북 작업', prompt: 'typing on a laptop, working diligently' },
  { label: '#07 하트 · 응원', prompt: 'making a heart with both hands, cheering warmly' },
  { label: '#08 박수', prompt: 'clapping hands with an excited, joyful expression' },
  { label: '#09 화이트보드', prompt: 'pointing at a whiteboard, explaining an idea' },
] as const;

// 본문(Body) 템플릿 6종 (DESIGN-BODY.md §2 — README 요약 기반)
export const BODY_TEMPLATES = [
  { value: 'HERO',        label: 'HERO · 미션 진입/섹션 헤더' },
  { value: 'QUOTE',       label: 'QUOTE · 멤버 어록 강조' },
  { value: 'QUOTE_MULTI', label: 'QUOTE MULTI · 어록 묶음 (3~5)' },
  { value: 'FLOW',        label: 'FLOW · 단계/노하우 (1→2→3)' },
  { value: 'SIDE_PROFILE',label: 'SIDE PROFILE · 리스트 + 이미지' },
  { value: 'GRID_HERO',   label: 'GRID HERO · 2×2 비교' },
] as const;
export type BodyTemplate = typeof BODY_TEMPLATES[number]['value'];

// 노란 원 배경 데코 옵션
export const CIRCLE_POSITIONS = [
  { value: 'top-left', label: '좌상단' },
  { value: 'top-right', label: '우상단' },
  { value: 'center-left', label: '중앙 좌' },
  { value: 'center-right', label: '중앙 우' },
  { value: 'bottom-left', label: '좌하단' },
  { value: 'bottom-right', label: '우하단' },
] as const;
export type CirclePosition = typeof CIRCLE_POSITIONS[number]['value'];

export const CIRCLE_SIZES = [
  { value: 'sm', label: '소' },
  { value: 'md', label: '중' },
  { value: 'lg', label: '대' },
] as const;
export type CircleSize = typeof CIRCLE_SIZES[number]['value'];

export const CIRCLE_SHAPES = [
  { value: 'circle', label: '원' },
  { value: 'half', label: '반원' },
  { value: 'dot', label: '도트' },
  { value: 'curve', label: '곡선' },
] as const;
export type CircleShape = typeof CIRCLE_SHAPES[number]['value'];

export const PILL_COLORS = [
  { value: 'dark', label: '다크' },
  { value: 'yellow', label: '옐로우' },
] as const;
export type PillColor = typeof PILL_COLORS[number]['value'];

// 미디어(캐릭터) 애니메이션 옵션 — MultiImageEditor에서 사용
export const ANIMATION_OPTIONS = [
  { value: 'none',     label: '없음' },
  { value: 'float',    label: 'Float (위아래 부유)' },
  { value: 'bounce',   label: 'Bounce (통통 튀기)' },
  { value: 'shake',    label: 'Shake (좌우 흔들기)' },
  { value: 'pulse',    label: 'Pulse (맥동)' },
  { value: 'slide-lr', label: 'Slide (좌우 이동)' },
] as const;

export type AnimationType = typeof ANIMATION_OPTIONS[number]['value'];
