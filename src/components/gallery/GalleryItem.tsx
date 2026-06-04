"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { fadeIn } from "@/lib/motion";
import type { GalleryImage } from "@/types/gallery";

type GalleryItemProps = {
  image: GalleryImage;
  index: number;
  onOpen: (index: number) => void;
  priority?: boolean;
  sizes: string;
  className?: string;
  /** Fill a parent cell (e.g. horizontal strip) instead of intrinsic aspect */
  fill?: boolean;
};

export function GalleryItem({
  image,
  index,
  onOpen,
  priority = false,
  sizes,
  className = "",
  fill = false,
}: GalleryItemProps) {
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={`group relative block w-full overflow-hidden bg-stone text-left ${
        fill ? "h-full" : ""
      } ${className}`}
      style={fill ? undefined : { aspectRatio: image.width / image.height }}
      onClick={() => onOpen(index)}
      aria-label={`View photograph: ${image.alt}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={fadeIn}
      whileHover={reduceMotion ? undefined : { y: fill ? 0 : -4 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="relative block h-full w-full">
        <span
          className={`absolute inset-0 bg-stone transition-opacity duration-700 ease-[var(--ease-cinematic)] ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden
        />
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-[1.1s] ease-[var(--ease-cinematic)] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <span
          className="pointer-events-none absolute inset-0 bg-[var(--vega-overlay)] opacity-0 transition-opacity duration-700 ease-[var(--ease-cinematic)] group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden
        />
      </span>
    </motion.button>
  );
}
