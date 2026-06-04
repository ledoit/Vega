import { Gallery } from "@/components/gallery/Gallery";
import type { GalleryImage, GalleryLayout } from "@/types/gallery";

type FeaturedGallerySectionProps = {
  images: GalleryImage[];
  layout?: GalleryLayout;
};

export function FeaturedGallerySection({
  images,
  layout = "masonry",
}: FeaturedGallerySectionProps) {
  return (
    <section
      id="work"
      className="scroll-mt-24 px-[var(--space-sm)] py-[var(--space-2xl)] sm:px-[var(--space-md)] sm:py-[var(--space-3xl)]"
    >
      <Gallery
        images={images}
        layout={layout}
        subtitle="Selected work"
        title="Moments held in light"
      />
    </section>
  );
}
