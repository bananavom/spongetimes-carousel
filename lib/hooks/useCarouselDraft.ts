import { useState, useCallback, useEffect } from 'react';

// 기본 상태값
const DEFAULT_DRAFT = {
  // 공통 필드
  week: 2,
  topic: '데굴데굴',
  
  // 슬라이드 1: 히어로
  slide1_mainText: '스폰지밥들이\n직접 집을 짓고 있다',
  slide1_subText: '스폰지클럽을 잘 굴러가게 하는\n유닛이 있다?!',
  slide1_imageUrl: '',
  
  // 슬라이드 2: 팀
  slide2_title1: '스폰지클럽엔',
  slide2_title2: '"데굴데굴" 이라는 유닛이 있다',
  slide2_description: '70명이 7주를 같이 굴러가는 동안\n그 굴러간 흔적을 정리하고\n보여주는 스폰지들',
  slide2_imageUrl: '',
  
  // 슬라이드 3: 웹사이트
  slide3_title1: '이 유닛이 만들고 있는 건',
  slide3_title2: '"스폰지클럽 7주 여정"',
  slide3_title3: '을 보여주는 웹사이트.',
  slide3_subTitle: '안에서 일어나는 일을\n밖에서도 볼 수 있게.',
  slide3_imageUrl: '',
  
  // 슬라이드 4: 컨셉
  slide4_title1: '그런데 그냥',
  slide4_title2: '사이트가 아니라',
  slide4_emphasis: '게임이다.',
  slide4_body1: '80명이 7주에 걸쳐',
  slide4_body2: '파인애플 집 한 채를 같이 짓는다.',
  slide4_imageUrl: '',
  
  // 슬라이드 5: 타임라인
  slide5_title: '한 주가 지날 때마다',
  slide5_imageUrl: '',
  
  // 슬라이드 6: 마무리
  slide6_mainText: '잘 굴러가고 있나요?',
  slide6_body1: '데굴데굴.',
  slide6_body2: '80명이 같이 굴러가는 7주.',
  slide6_body3: '다음 주엔 어디까지',
  slide6_body4: '자랐을지,',
  slide6_body5: '또 보러 와요.',
  slide6_imageUrl: '',
};

export type CarouselDraft = typeof DEFAULT_DRAFT;

const STORAGE_KEY = 'carousel-draft:v1';

export function useCarouselDraft() {
  const [draft, setDraft] = useState<CarouselDraft>(DEFAULT_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage에서 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 하위 호환: 새로운 필드가 추가되어도 기존 데이터 유지
        setDraft({ ...DEFAULT_DRAFT, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    setIsLoaded(true);
  }, []);

  // 상태 변경 시 localStorage에 자동 저장
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [draft, isLoaded]);

  // 필드 업데이트
  const updateField = useCallback((key: keyof CarouselDraft, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // 초기화
  const reset = useCallback(() => {
    setDraft(DEFAULT_DRAFT);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    draft,
    updateField,
    reset,
    isLoaded,
  };
}
