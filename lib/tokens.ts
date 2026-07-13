export const COLORS = {
  coverBg: '#FEE67A',
  bodyBg: '#FDFCEA',
  text: '#000000',
  highlight: '#87CEEB',
  textSub: '#555555',
  border: '#E0DDD0',
  accent: '#FF6B9D',
} as const;

export const CANVAS = { W: 1080, H: 1350 } as const;

export const PREVIEW_SCALE = 0.37;

// 스폰지타임즈 2기 워크숍 기간 (6주)
export const TOTAL_WEEKS = 6;

export const SLIDE_LABELS = [
  '표지',
  '편집팀',
  '매거진 소개',
  '컨셉',
  '타임라인',
  'CTA',
] as const;

export const ANIMATION_OPTIONS = [
  { value: 'none',     label: '없음' },
  { value: 'float',    label: 'Float (위아래 부유)' },
  { value: 'bounce',   label: 'Bounce (통통 튀기)' },
  { value: 'shake',    label: 'Shake (좌우 흔들기)' },
  { value: 'pulse',    label: 'Pulse (맥동)' },
  { value: 'slide-lr', label: 'Slide (좌우 이동)' },
] as const;

export type AnimationType = typeof ANIMATION_OPTIONS[number]['value'];

// 스폰지타임즈 2기 편집팀 (퍼블리셔)
export const PUBLISHERS = ['봄', '위버', '포비', '필리줄리'] as const;

// 편집팀 시그니처 색상
export const TEAM_COLORS = {
  bom: '#FF6B9D',
  weaver: '#4ECDC4',
  foby: '#F7DC6F',
  philijuli: '#BB8FCE',
} as const;
