'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AnimationType } from '@/lib/tokens';

// 미디어 아이템 타입 (이미지 또는 영상)
export type ImageItem = {
  id: string;
  src: string;
  type: 'image' | 'video';  // 미디어 타입
  x: number;
  y: number;
  size: number;
  animation: AnimationType;
  duration: number;
};

export function createImageItem(src: string, type: 'image' | 'video' = 'image'): ImageItem {
  return {
    id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    src,
    type,
    x: 540,
    y: 700,
    size: 400,
    animation: 'none',
    duration: 3,
  };
}

const DEFAULT_DRAFT = {
  week: 2,
  topic: '데굴데굴',
  authorHandle: '@spongeclub',
  
  // 슬라이드 이름 (탭바, 파일명, 슬라이드 헤더에 모두 사용)
  hero_name: '히어로',
  team_name: '팀',
  website_name: '웹사이트',
  concept_name: '컨셉',
  timeline_name: '타임라인',
  outro_name: '마무리',
  
  hero_mainText: '스폰지밥들이\n직접 집을 짓고 있다',
  hero_subText: '스폰지클럽을 잘 굴러가게 하는\n유닛이 있다?!',
  hero_images: [] as ImageItem[],
  
  team_title1: '스폰지클럽엔',
  team_title2: '"데굴데굴" 이라는 유닛이 있다',
  team_description: '70명이 7주를 같이 굴러가는 동안\n그 굴러간 흔적을 정리하고\n보여주는 스폰지들',
  team_images: [] as ImageItem[],
  
  website_title1: '이 유닛이 만들고 있는 건',
  website_title2: '"스폰지클럽 7주 여정"',
  website_title3: '을 보여주는 웹사이트.',
  website_subTitle: '안에서 일어나는 일을\n밖에서도 볼 수 있게.',
  website_images: [] as ImageItem[],
  
  concept_title1: '그런데 그냥',
  concept_title2: '사이트가 아니라',
  concept_emphasis: '게임이다.',
  concept_body1: '80명이 7주에 걸쳐',
  concept_body2: '파인애플 집 한 채를 같이 짓는다.',
  concept_images: [] as ImageItem[],
  
  timeline_title: '한 주가 지날 때마다',
  timeline_subtitle: '지금은 2주차',
  timeline_description: '모래밭에 산호초가 막 돋는 중',
  timeline_images: [] as ImageItem[],
  
  outro_mainText: '잘 굴러가고 있나요?',
  outro_body1: '데굴데굴.',
  outro_body2: '80명이 같이 굴러가는 7주.',
  outro_body3: '다음 주엔 어디까지\n자랐을지, 또 보러 와요.',
  outro_images: [] as ImageItem[],
};

export type CarouselDraft = typeof DEFAULT_DRAFT;
export type ImageSlideKey = 'hero' | 'team' | 'website' | 'concept' | 'timeline' | 'outro';

export const MAX_IMAGES_PER_SLIDE = 7;

const STORAGE_KEY = 'degulgul-draft:v4';

export function useCarouselDraft() {
  const [draft, setDraft] = useState<CarouselDraft>(DEFAULT_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const addImage = useCallback((slideKey: ImageSlideKey, src: string, type: 'image' | 'video' = 'image') => {
    setDraft((prev) => {
      const key = `${slideKey}_images` as keyof CarouselDraft;
      const current = prev[key] as ImageItem[];
      if (current.length >= MAX_IMAGES_PER_SLIDE) return prev;
      return {
        ...prev,
        [key]: [...current, createImageItem(src, type)],
      };
    });
  }, []);

  const updateImage = useCallback((
    slideKey: ImageSlideKey,
    imageId: string,
    updates: Partial<ImageItem>
  ) => {
    setDraft((prev) => {
      const key = `${slideKey}_images` as keyof CarouselDraft;
      const current = prev[key] as ImageItem[];
      return {
        ...prev,
        [key]: current.map((img) => img.id === imageId ? { ...img, ...updates } : img),
      };
    });
  }, []);

  const removeImage = useCallback((slideKey: ImageSlideKey, imageId: string) => {
    setDraft((prev) => {
      const key = `${slideKey}_images` as keyof CarouselDraft;
      const current = prev[key] as ImageItem[];
      return {
        ...prev,
        [key]: current.filter((img) => img.id !== imageId),
      };
    });
  }, []);

  const reset = useCallback(() => {
    setDraft(DEFAULT_DRAFT);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { draft, update, addImage, updateImage, removeImage, reset, isLoaded };
}
