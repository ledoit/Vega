"use client";

import { useState } from "react";
import type { GalleryProps } from "@/types/gallery";
import { GalleryHorizontal } from "./GalleryHorizontal";
import { GalleryLightbox } from "./GalleryLightbox";
import { GalleryMasonry } from "./GalleryMasonry";

export function Gallery({
  images,
  layout = "masonry",
  className = "",
  title,
  subtitle,
}: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section className={className} aria-label={title ?? "Gallery"}>
      {(title || subtitle) && (
        <header className="mb-[var(--space-lg)] max-w-2xl">
          {subtitle && (
            <p className="text-label mb-4">{subtitle}</p>
          )}
          {title && (
            <h2 className="text-display-lg text-ink">{title}</h2>
          )}
        </header>
      )}

      {layout === "horizontal" ? (
        <GalleryHorizontal images={images} onOpen={setLightboxIndex} />
      ) : (
        <GalleryMasonry images={images} onOpen={setLightboxIndex} />
      )}

      <GalleryLightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
