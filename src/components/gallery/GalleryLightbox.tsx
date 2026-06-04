"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { lightboxBackdrop, lightboxImage } from "@/lib/motion";
import type { GalleryImage } from "@/types/gallery";
import { useFocusTrap } from "./useFocusTrap";
import { useGalleryGestures } from "./useGalleryGestures";

type GalleryLightboxProps = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const reduceMotion = useReducedMotion();
  const open = index !== null;
  const current = open ? images[index] : null;
  const hasPrev = open && index > 0;
  const hasNext = open && index < images.length - 1;
  const trapRef = useFocusTrap(open);

  const goPrev = useCallback(() => {
    if (hasPrev && index !== null) onNavigate(index - 1);
  }, [hasPrev, index, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext && index !== null) onNavigate(index + 1);
  }, [hasNext, index, onNavigate]);

  const gestures = useGalleryGestures({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          key="lightbox"
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${current.alt}`}
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={
            reduceMotion
              ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
              : lightboxBackdrop
          }
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[var(--vega-overlay)]"
            aria-label="Close gallery"
            onClick={onClose}
            tabIndex={-1}
          />

          <motion.figure
            className="relative z-10 mx-auto flex h-full max-h-[92svh] w-full max-w-[min(96vw,1400px)] flex-col items-center justify-center px-4 py-16 sm:px-8"
            variants={reduceMotion ? undefined : lightboxImage}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            exit={reduceMotion ? undefined : "exit"}
            style={{ touchAction: "none" }}
            onTouchStart={gestures.onTouchStart}
            onTouchMove={gestures.onTouchMove}
            onTouchEnd={gestures.onTouchEnd}
          >
            <div className="relative flex h-full min-h-[40svh] w-full items-center justify-center">
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                className="mx-auto h-auto max-h-[78svh] w-auto max-w-full object-contain"
                sizes="96vw"
                priority
              />
            </div>
            <figcaption className="mt-6 text-center text-sm tracking-wide text-[var(--vega-paper-elevated)]/60">
              <span className="text-[var(--vega-paper-elevated)]/85">
                {(index ?? 0) + 1}
              </span>
              <span className="mx-2 opacity-40">/</span>
              <span>{images.length}</span>
            </figcaption>
          </motion.figure>

          {hasPrev && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 px-3 py-6 text-2xl font-light text-[var(--vega-paper-elevated)] opacity-70 transition-opacity duration-500 hover:opacity-100 sm:block"
              aria-label="Previous image"
            >
              ‹
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 px-3 py-6 text-2xl font-light text-[var(--vega-paper-elevated)] opacity-70 transition-opacity duration-500 hover:opacity-100 sm:block"
              aria-label="Next image"
            >
              ›
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-20 text-[0.8125rem] tracking-[0.14em] uppercase text-[var(--vega-paper-elevated)]/75 transition-opacity duration-500 hover:text-[var(--vega-paper-elevated)]"
            aria-label="Close"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
