'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AnimationType, Publisher, BodyTemplate } from '@/lib/tokens';
import { createBodySlide, type BodySlide } from '@/lib/state/bodySlide';

// 미디어 아이템 타입 (캐릭터 이미지 또는 영상)
export type ImageItem = {
  id: string;
  src: string;
  type: 'image' | 'video';
  x: number;
  y: number;
  size: number;      // 박스 너비(px). 높이는 size / aspect 로 파생
  aspect: number;    // 자연 가로세로 비율(=W/H). 1 = 정사각
  animation: AnimationType;
  duration: number;
};

export function createImageItem(src: string, type: 'image' | 'video' = 'image', aspect = 1): ImageItem {
  return {
    id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    src,
    type,
    x: 720,
    y: 950,
    size: 440,
    aspect: aspect || 1,
    animation: 'none',
    duration: 3,
  };
}

const DEFAULT_DRAFT = {
  // 공통 설정
  week: 1,
  year: 2026,
  volume: 1,
  contentType: '인사이트' as string, // 프리셋 또는 자유 입력
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
  cta_character: null as ImageItem | null, // 고정 슬롯: 이미지/영상 택1

  // 본문 슬라이드 (표지 → 본문 1..N → CTA)
  bodySlides: [] as BodySlide[],
};

export type CarouselDraft = typeof DEFAULT_DRAFT;
export type ImageSlideKey = 'cover'; // 다중 이미지(드래그) 슬라이드는 표지 캐릭터뿐

export const MAX_IMAGES_PER_SLIDE = 6;

const STORAGE_KEY = 'spongetimes-2gi-draft:v4';

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

  const addImage = useCallback((slideKey: ImageSlideKey, src: string, type: 'image' | 'video' = 'image', aspect = 1) => {
    setDraft((prev) => {
      const key = `${slideKey}_images` as keyof CarouselDraft;
      const current = prev[key] as ImageItem[];
      if (current.length >= MAX_IMAGES_PER_SLIDE) return prev;
      return {
        ...prev,
        [key]: [...current, createImageItem(src, type, aspect)],
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

  /* ── 본문 슬라이드 CRUD ── */
  const addBody = useCallback((template: BodyTemplate) => {
    setDraft((prev) => ({ ...prev, bodySlides: [...prev.bodySlides, createBodySlide(template)] }));
  }, []);

  const updateBody = useCallback((id: string, patch: Partial<BodySlide>) => {
    setDraft((prev) => ({
      ...prev,
      bodySlides: prev.bodySlides.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  }, []);

  const removeBody = useCallback((id: string) => {
    setDraft((prev) => ({ ...prev, bodySlides: prev.bodySlides.filter((b) => b.id !== id) }));
  }, []);

  const moveBody = useCallback((id: string, dir: -1 | 1) => {
    setDraft((prev) => {
      const arr = [...prev.bodySlides];
      const i = arr.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...prev, bodySlides: arr };
    });
  }, []);

  const addBodyImage = useCallback((id: string, src: string, type: 'image' | 'video' = 'image', aspect = 1) => {
    setDraft((prev) => ({
      ...prev,
      bodySlides: prev.bodySlides.map((b) =>
        b.id === id && b.images.length < MAX_IMAGES_PER_SLIDE
          ? { ...b, images: [...b.images, createImageItem(src, type, aspect)] }
          : b
      ),
    }));
  }, []);

  const updateBodyImage = useCallback((id: string, imgId: string, patch: Partial<ImageItem>) => {
    setDraft((prev) => ({
      ...prev,
      bodySlides: prev.bodySlides.map((b) =>
        b.id === id ? { ...b, images: b.images.map((im) => (im.id === imgId ? { ...im, ...patch } : im)) } : b
      ),
    }));
  }, []);

  const removeBodyImage = useCallback((id: string, imgId: string) => {
    setDraft((prev) => ({
      ...prev,
      bodySlides: prev.bodySlides.map((b) =>
        b.id === id ? { ...b, images: b.images.filter((im) => im.id !== imgId) } : b
      ),
    }));
  }, []);

  const reset = useCallback(() => {
    setDraft(DEFAULT_DRAFT);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    draft, update, addImage, updateImage, removeImage, reset, isLoaded,
    addBody, updateBody, removeBody, moveBody, addBodyImage, updateBodyImage, removeBodyImage,
  };
}
