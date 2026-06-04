import { Gallery } from "@/components/gallery/Gallery";
import type { GalleryImage } from "@/types/gallery";

type EditorialStripSectionProps = {
  images: GalleryImage[];
};

/** Horizontal scroll gallery — editorial film-strip rhythm */
export function EditorialStripSection({ images }: EditorialStripSectionProps) {
  return (
    <section className="border-t border-line py-[var(--space-xl)] sm:py-[var(--space-2xl)]">
      <div className="mb-[var(--space-lg)] px-[var(--space-sm)] sm:px-[var(--space-md)]">
        <p className="text-label">Recent ceremonies</p>
      </div>
      <Gallery images={images} layout="horizontal" />
    </section>
  );
}
