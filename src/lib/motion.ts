import type { Variants } from "framer-motion";

const easeCinematic = [0.22, 1, 0.36, 1] as const;
const easeFade = [0.25, 0.1, 0.25, 1] as const;

/** Shared Framer Motion variants — analog, no bounce */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.1, ease: easeCinematic },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.15, ease: easeCinematic },
  },
};

export const fadeInSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.4, ease: easeFade },
  },
};

export const lightboxBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: easeFade },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: easeFade },
  },
};

export const lightboxImage: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeCinematic },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: easeFade },
  },
};
