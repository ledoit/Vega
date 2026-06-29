import type { GalleryImage } from "@/types/gallery";
import type { Album } from "@/types/album";
import type { SiteBuilderConfig } from "@/types/site";
import { EditorialStripSection } from "@/components/sections/EditorialStripSection";
import { FeaturedGallerySection } from "@/components/sections/FeaturedGallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { SiteHeader } from "@/components/layout/SiteHeader";

function toGalleryImages(assets: Album["assets"]): GalleryImage[] {
  return assets.map((a) => ({
    id: a.id,
    src: a.previewUrl,
    alt: a.alt,
    width: a.width,
    height: a.height,
    aspect: a.height > a.width ? "portrait" : "landscape",
  }));
}

type PublishedSiteViewProps = {
  site: SiteBuilderConfig;
  albums: Album[];
};

export function PublishedSiteView({ site, albums }: PublishedSiteViewProps) {
  const gallerySection = site.sections.find((s) => s.type === "gallery");
  const editorialSection = site.sections.find((s) => s.type === "editorial");

  const galleryAlbum = albums.find((a) => a.id === gallerySection?.albumId) ?? albums[0];
  const galleryImages = galleryAlbum ? toGalleryImages(galleryAlbum.assets) : [];

  const editorialAlbum = albums.find((a) => a.id === editorialSection?.albumId) ?? galleryAlbum;
  const editorialStart = editorialSection?.type === "editorial" ? editorialSection.startIndex ?? 0 : 0;
  const editorialCount = editorialSection?.type === "editorial" ? editorialSection.count ?? 4 : 4;
  const stripImages = editorialAlbum
    ? toGalleryImages(editorialAlbum.assets.slice(editorialStart, editorialStart + editorialCount))
    : [];

  const heroImage = {
    src: site.heroImageUrl,
    alt: site.heroTitle,
    width: 2400,
    height: 3600,
  };

  return (
    <>
      <SiteHeader />
      <main id="main">
        <HeroSection
          image={heroImage}
          title={site.heroTitle}
          subtitle={site.heroSubtitle}
        />
        {galleryImages.length > 0 && (
          <FeaturedGallerySection
            images={galleryImages}
            layout={gallerySection?.type === "gallery" ? gallerySection.layout : "masonry"}
            title={gallerySection?.type === "gallery" ? gallerySection.title : undefined}
            subtitle={gallerySection?.type === "gallery" ? gallerySection.subtitle : undefined}
          />
        )}
        {stripImages.length > 0 && <EditorialStripSection images={stripImages} />}
        <section
          id="about"
          className="mx-auto max-w-2xl px-[var(--space-sm)] py-[var(--space-2xl)] sm:px-[var(--space-md)] sm:py-[var(--space-3xl)]"
        >
          <p className="text-label mb-6">About</p>
          <p className="text-display-lg mb-8 font-light text-ink">{site.heroTitle}</p>
          <p className="text-lg leading-[1.75] text-ink-muted sm:text-xl">{site.aboutText}</p>
        </section>
        <section
          id="contact"
          className="border-t border-line px-[var(--space-sm)] py-[var(--space-2xl)] sm:px-[var(--space-md)]"
        >
          <p className="text-label mb-4">Inquire</p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="text-display-lg inline-block text-ink transition-[color,transform] duration-700 ease-[var(--ease-cinematic)] hover:translate-y-[-3px] hover:text-ink-muted"
          >
            {site.contactEmail}
          </a>
        </section>
        <footer className="px-[var(--space-sm)] pb-[var(--space-lg)] pt-[var(--space-md)] sm:px-[var(--space-md)]">
          <p className="text-sm text-ink-faint">Published with Vega</p>
        </footer>
      </main>
    </>
  );
}
