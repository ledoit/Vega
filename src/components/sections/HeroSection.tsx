"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInSlow, fadeUp } from "@/lib/motion";

type HeroSectionProps = {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL?: string;
  };
  title: string;
  subtitle?: string;
  lede?: string;
};

export function HeroSection({
  image,
  title,
  subtitle,
  lede = "Weddings and portraits, photographed with patience — for couples who value stillness over spectacle.",
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 1.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className="object-cover object-[center_28%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[rgba(36,34,31,0.55)] via-[rgba(36,34,31,0.08)] to-transparent"
          aria-hidden
        />
      </motion.div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-[var(--space-sm)] pb-[calc(var(--space-xl)+2rem)] pt-28 sm:px-[var(--space-md)] sm:pb-[var(--space-2xl)]">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.18,
                delayChildren: reduceMotion ? 0 : 0.35,
              },
            },
          }}
        >
          {subtitle && (
            <motion.p
              className="mb-5 text-[0.8125rem] font-normal tracking-[0.14em] uppercase text-[var(--vega-paper-elevated)]/75"
              variants={fadeUp}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.h1
            className="text-display-xl text-[var(--vega-paper-elevated)]"
            variants={fadeUp}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mt-8 max-w-md text-lg leading-relaxed text-[var(--vega-paper-elevated)]/75 sm:text-xl"
            variants={fadeInSlow}
          >
            {lede}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
