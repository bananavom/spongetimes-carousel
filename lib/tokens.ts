export const COLORS = {
  coverBg: '#FFF8E1',
  bodyBg: '#FFFEF7',
  text: '#2C2C2C',
  highlight: '#FFD54F',
  textSub: '#666666',
  border: '#E0DDD0',
  accent: '#FF6B9D',
} as const;

export const CANVAS = { W: 1080, H: 1350 } as const;

export const PREVIEW_SCALE = 0.37;

export const SLIDE_LABELS = [
  '히어로',
  '팀',
  '웹사이트',
  '컨셉',
  '타임라인',
  '마무리',
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

// 데굴데굴 5인방 색상
export const TEAM_COLORS = {
  dada: '#FF6B9D',
  yulia: '#4ECDC4',
  galia: '#95E1D3',
  chico: '#F7DC6F',
  coni: '#BB8FCE',
} as const;
