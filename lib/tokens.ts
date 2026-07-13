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

// 발행자 4인 (이름 + 캐릭터 프롬프트용 색상 정보, 04-character-prompt.md 기준)
export const PUBLISHERS = ['봄', '위버', '포비', '필리줄리'] as const;
export type Publisher = typeof PUBLISHERS[number];

export const PUBLISHER_META: Record<Publisher, { colorName: string; colorHex: string }> = {
  '봄': { colorName: 'blue', colorHex: '#55C0EF' },
  '위버': { colorName: 'burgundy red', colorHex: '#7A1F3D' },
  '포비': { colorName: 'pink', colorHex: '#F59AC1' },
  '필리줄리': { colorName: 'tiffany blue', colorHex: '#77DCD5' },
};

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
