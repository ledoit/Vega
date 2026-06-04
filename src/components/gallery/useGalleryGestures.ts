"use client";

import { useCallback, useRef } from "react";

type GestureOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
};

export function useGalleryGestures({
  onSwipeLeft,
  onSwipeRight,
  threshold = 48,
}: GestureOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    tracking.current = true;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!tracking.current) return;
    const touch = e.touches[0];
    if (!touch) return;

    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
      e.preventDefault();
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!tracking.current) return;
      tracking.current = false;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;

      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
    [onSwipeLeft, onSwipeRight, threshold],
  );

  return { onTouchStart, onTouchMove, onTouchEnd };
}
