"use client";

import type { GalleryImage } from "@/types/gallery";
import { GalleryItem } from "./GalleryItem";

type GalleryMasonryProps = {
  images: GalleryImage[];
  onOpen: (index: number) => void;
};

export function GalleryMasonry({ images, onOpen }: GalleryMasonryProps) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8">
      {images.map((image, index) => (
        <div key={image.id} className="mb-5 break-inside-avoid sm:mb-6 lg:mb-8">
          <GalleryItem
            image={image}
            index={index}
            onOpen={onOpen}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}
