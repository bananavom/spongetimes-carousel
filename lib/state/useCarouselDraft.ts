'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AnimationType } from '@/lib/tokens';

// 기본 상태값 (데굴데굴 캐러셀)
const DEFAULT_DRAFT = {
  // 공통 필드
  week: 2,
  topic: '데굴데굴',
  authorHandle: '@spongeclub',
  
  // ─── 슬라이드 1: 히어로 ───
  hero_mainText: '스폰지밥들이\n직접 집을 짓고 있다',
  hero_subText: '스폰지클럽을 잘 굴러가게 하는\n유닛이 있다?!',
  hero_image: null as string | null,
  hero_imageX: 540,
  hero_imageY: 700,
  hero_imageSize: 400,
  hero_imageAnimation: 'float' as AnimationType,
  hero_imageDuration: 3,
  
  // ─── 슬라이드 2: 팀 ───
  team_title1: '스폰지클럽엔',
  team_title2: '"데굴데굴" 이라는 유닛이 있다',
  team_description: '70명이 7주를 같이 굴러가는 동안\n그 굴러간 흔적을 정리하고\n보여주는 스폰지들',
  team_image: null as string | null,
  team_imageX: 540,
  team_imageY: 950,
  team_imageSize: 500,
  team_imageAnimation: 'none' as AnimationType,
  team_imageDuration: 3,
  
  // ─── 슬라이드 3: 웹사이트 ───
  website_title1: '이 유닛이 만들고 있는 건',
  website_title2: '"스폰지클럽 7주 여정"',
  website_title3: '을 보여주는 웹사이트.',
  website_subTitle: '안에서 일어나는 일을\n밖에서도 볼 수 있게.',
  website_image: null as string | null,
  website_imageX: 540,
  website_imageY: 950,
  website_imageSize: 450,
  website_imageAnimation: 'none' as AnimationType,
  website_imageDuration: 3,
  
  // ─── 슬라이드 4: 컨셉 ───
  concept_title1: '그런데 그냥',
  concept_title2: '사이트가 아니라',
  concept_emphasis: '게임이다.',
  concept_body1: '80명이 7주에 걸쳐',
  concept_body2: '파인애플 집 한 채를 같이 짓는다.',
  concept_image: null as string | null,
  concept_imageX: 540,
  concept_imageY: 1050,
  concept_imageSize: 350,
  concept_imageAnimation: 'bounce' as AnimationType,
  concept_imageDuration: 2,
  
  // ─── 슬라이드 5: 타임라인 ───
  timeline_title: '한 주가 지날 때마다',
  timeline_subtitle: '지금은 2주차',
  timeline_description: '모래밭에 산호초가 막 돋는 중',
  timeline_image: null as string | null,
  timeline_imageX: 540,
  timeline_imageY: 850,
  timeline_imageSize: 600,
  timeline_imageAnimation: 'none' as AnimationType,
  timeline_imageDuration: 3,
  
  // ─── 슬라이드 6: 마무리 ───
  outro_mainText: '잘 굴러가고 있나요?',
  outro_body1: '데굴데굴.',
  outro_body2: '80명이 같이 굴러가는 7주.',
  outro_body3: '다음 주엔 어디까지\n자랐을지, 또 보러 와요.',
  outro_image: null as string | null,
  outro_imageX: 540,
  outro_imageY: 900,
  outro_imageSize: 400,
  outro_imageAnimation: 'pulse' as AnimationType,
  outro_imageDuration: 3,
};

export type CarouselDraft = typeof DEFAULT_DRAFT;

const STORAGE_KEY = 'degulgul-draft:v3';

export function useCarouselDraft() {
  const [draft, setDraft] = useState<CarouselDraft>(DEFAULT_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage에서 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDraft({ ...DEFAULT_DRAFT, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    setIsLoaded(true);
  }, []);

  // 자동 저장
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }
  }, [draft, isLoaded]);

  const update = useCallback(<K extends keyof CarouselDraft>(
    key: K,
    value: CarouselDraft[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setDraft(DEFAULT_DRAFT);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { draft, update, reset, isLoaded };
}
