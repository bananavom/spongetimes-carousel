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
  week: 1,
  topic: '스폰지타임즈 2기',
  authorHandle: '@spongeclub',

  // 슬라이드 이름 (탭바, 파일명, 슬라이드 헤더에 모두 사용)
  hero_name: '표지',
  team_name: '편집팀',
  website_name: '매거진 소개',
  concept_name: '컨셉',
  timeline_name: '타임라인',
  outro_name: 'CTA',

  hero_mainText: '스폰지타임즈\n2기, 오늘 창간',
  hero_subText: '스폰지클럽 안에서 일어나는 일을\n매주 전하는 매거진',
  hero_images: [] as ImageItem[],

  team_title1: '스폰지타임즈를 만드는',
  team_title2: '4명의 편집팀',
  team_description: '봄 · 위버 · 포비 · 필리줄리\n6주 동안 주 2~3회,\n스폰지클럽의 이야기를 기록합니다',
  team_images: [] as ImageItem[],

  website_title1: '스폰지타임즈는',
  website_title2: '"스폰지클럽 6주 여정"',
  website_title3: '을 담는 매거진.',
  website_subTitle: '안에서 일어나는 일을\n밖에서도 볼 수 있게.',
  website_images: [] as ImageItem[],

  concept_title1: '그런데 그냥',
  concept_title2: '소식지가 아니라',
  concept_emphasis: '매거진이다.',
  concept_emphasis_x: 540,
  concept_emphasis_y: 600,
  concept_emphasis_width: 460,
  concept_emphasis_height: 150,
  concept_emphasis_fontSize: 80,
  concept_body1: '스폰지클럽의 6주를',
  concept_body2: '매주 이야기로 엮는다.',
  concept_images: [] as ImageItem[],

  timeline_title: '한 주가 지날 때마다',
  timeline_subtitle: '지금은 1주차',
  timeline_description: '스폰지클럽 2기가 막 시작됐다',
  timeline_images: [] as ImageItem[],

  outro_mainText: '이번 주도 잘 굴러가고 있나요?',
  outro_body1: '스폰지타임즈.',
  outro_body2: '스폰지클럽의 6주를 함께.',
  outro_body3: '주 2~3회, 새로운 소식으로\n또 찾아올게요.',
  outro_images: [] as ImageItem[],
};

export type CarouselDraft = typeof DEFAULT_DRAFT;
export type ImageSlideKey = 'hero' | 'team' | 'website' | 'concept' | 'timeline' | 'outro';

export const MAX_IMAGES_PER_SLIDE = 7;

const STORAGE_KEY = 'spongetimes-2gi-draft:v1';

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
