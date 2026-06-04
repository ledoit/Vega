"use client";

import type { GalleryImage } from "@/types/gallery";
import { GalleryItem } from "./GalleryItem";

type GalleryHorizontalProps = {
  images: GalleryImage[];
  onOpen: (index: number) => void;
};

const stripHeight = "min(72vh, 560px)";

export function GalleryHorizontal({ images, onOpen }: GalleryHorizontalProps) {
  return (
    <div className="-mx-[var(--space-sm)] overflow-x-auto px-[var(--space-sm)] pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <ul className="flex w-max items-end gap-5 snap-x snap-mandatory sm:gap-7">
        {images.map((image, index) => {
          const isLandscape = (image.aspect ?? "portrait") === "landscape";
          const width = isLandscape
            ? `min(78vw, 640px)`
            : `min(52vw, 380px)`;

          return (
            <li
              key={image.id}
              className="shrink-0 snap-center"
              style={{ width, height: stripHeight }}
            >
              <GalleryItem
                image={image}
                index={index}
                onOpen={onOpen}
                fill
                sizes="(max-width: 640px) 78vw, 52vw"
                className="h-full"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
