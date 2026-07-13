'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AnimationType, ContentType, Publisher } from '@/lib/tokens';

// 미디어 아이템 타입 (캐릭터 이미지 또는 영상)
export type ImageItem = {
  id: string;
  src: string;
  type: 'image' | 'video';
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
    x: 720,
    y: 950,
    size: 440,
    animation: 'none',
    duration: 3,
  };
}

const DEFAULT_DRAFT = {
  // 공통 설정
  week: 1,
  year: 2026,
  volume: 1,
  contentType: '인사이트' as ContentType,
  publisher: '봄' as Publisher,

  // 표지 (Cover) — 01-cover.md
  cover_mainTitle: '노션 캘린더\n자동화 스킬\n직접 써봤습니다',
  cover_highlight: '자동화 스킬',
  cover_images: [] as ImageItem[],

  // CTA — 03-cta.md
  cta_label: '💬 댓글로 이야기해요',
  cta_question: '이번 주 워크샵에서\n가장 기억에 남는\n장면은 뭐였나요? 💭',
  cta_questionHighlight: '가장 기억에 남는',
  cta_message: '봄이 던지는 질문이에요 ✨\n댓글로 이야기 들려주세요',
  cta_character: '' as string, // 데이터 URL (고정 슬롯, 드래그 없음)
};

export type CarouselDraft = typeof DEFAULT_DRAFT;
export type ImageSlideKey = 'cover'; // 다중 이미지(드래그) 슬라이드는 표지 캐릭터뿐

export const MAX_IMAGES_PER_SLIDE = 4;

const STORAGE_KEY = 'spongetimes-2gi-draft:v2';

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
