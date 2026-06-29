import { Gallery } from "@/components/gallery/Gallery";
import type { GalleryImage, GalleryLayout } from "@/types/gallery";

type FeaturedGallerySectionProps = {
  images: GalleryImage[];
  layout?: GalleryLayout;
  title?: string;
  subtitle?: string;
};

export function FeaturedGallerySection({
  images,
  layout = "masonry",
  title = "Moments held in light",
  subtitle = "Selected work",
}: FeaturedGallerySectionProps) {
  return (
    <section
      id="work"
      className="scroll-mt-24 px-[var(--space-sm)] py-[var(--space-2xl)] sm:px-[var(--space-md)] sm:py-[var(--space-3xl)]"
    >
      <Gallery images={images} layout={layout} subtitle={subtitle} title={title} />
    </section>
  );
}
