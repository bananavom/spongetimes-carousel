// 데굴데굴 캐러셀 타입 정의

export type DegulgulSlideType = 'hero' | 'team' | 'website' | 'concept' | 'timeline' | 'closing';

export interface DegulgulMember {
  name: string;
  role: string;
  color: string;
}

export interface DegulgulWeek {
  week: number;
  desc: string;
  color: string;
  stroke: string;
}

export interface DegulgulSlideContent {
  [key: string]: any;
}

export interface DegulgulSlide {
  id: string;
  type: DegulgulSlideType;
  content: DegulgulSlideContent;
}

export interface DegulgulCarouselRequest {
  template: 'degulgul';
  week?: number;
  slides?: Partial<DegulgulSlide>[];
  metadata?: {
    source?: 'sheet' | 'webhook' | 'slack' | 'form';
    createdBy?: string;
    createdAt?: string;
  };
}

export interface DegulgulCarouselResponse {
  success: boolean;
  svg?: string;
  pngUrl?: string;
  downloadUrl?: string;
  error?: string;
  timestamp: string;
}

export const DEFAULT_SLIDES = (): DegulgulSlide[] => [
  {
    id: 'slide-1',
    type: 'hero',
    content: {
      mainText: '스폰지밥들이\n직접 집을 짓고 있다',
      subText: '스폰지클럽을 잘 굴러가게 하는\n유닛이 있다?!'
    }
  },
  {
    id: 'slide-2',
    type: 'team',
    content: {
      title1: '스폰지클럽엔',
      title2: '"데굴데굴" 이라는 유닛이 있다',
      members: [
        { name: '다다', role: '굴리는 사람', color: '#FF6B9D' },
        { name: '윤리아', role: '짓는 사람', color: '#4ECDC4' },
        { name: '갈리아', role: '띄우는 사람', color: '#95E1D3' },
        { name: '치코', role: '그리는 사람', color: '#F7DC6F' },
        { name: '코니', role: '채우는 사람', color: '#BB8FCE' }
      ],
      description: '70명이 7주를 같이 굴러가는 동안\n그 굴러간 흔적을 정리하고\n보여주는 스폰지들'
    }
  },
  {
    id: 'slide-3',
    type: 'website',
    content: {
      title1: '이 유닛이 만들고 있는 건',
      title2: '"스폰지클럽 7주 여정"',
      title3: '을 보여주는 웹사이트.',
      subTitle: '안에서 일어나는 일을\n밖에서도 볼 수 있게.'
    }
  },
  {
    id: 'slide-4',
    type: 'concept',
    content: {
      title1: '그런데 그냥',
      title2: '사이트가 아니라',
      emphasis: '게임이다.',
      body1: '80명이 7주에 걸쳐',
      body2: '파인애플 집 한 채를 같이 짓는다.'
    }
  },
  {
    id: 'slide-5',
    type: 'timeline',
    content: {
      title: '한 주가 지날 때마다',
      currentWeek: 2,
      weeks: [
        { week: 1, desc: '파란 배경 + 모래', color: '#E6F1FB', stroke: '#185FA5' },
        { week: 2, desc: '회색 길 + 산호초 🌊', color: '#D3D1C7', stroke: '#5F5E5A' },
        { week: 3, desc: '파인애플 몸통', color: '#FFD700', stroke: '#BA7517' },
        { week: 4, desc: '몸통에 줄긋기', color: '#FFE4B5', stroke: '#BA7517' },
        { week: 5, desc: '창문 달기 🪟', color: '#87CEEB', stroke: '#0C447C' },
        { week: 6, desc: '문 달기 🚪', color: '#8B7355', stroke: '#4A1B0C' },
        { week: 7, desc: '파인애플 뿌리 완성 🍍', color: '#90EE90', stroke: '#27500A' }
      ]
    }
  },
  {
    id: 'slide-6',
    type: 'closing',
    content: {
      mainText: '잘 굴러가고 있나요?',
      body1: '데굴데굴.',
      body2: '80명이 같이 굴러가는 7주.',
      body3: '다음 주엔 어디까지',
      body4: '자랐을지,',
      body5: '또 보러 와요.',
      credit: '스폰지타임즈'
    }
  }
];
