import { EditorialStripSection } from "@/components/sections/EditorialStripSection";
import { FeaturedGallerySection } from "@/components/sections/FeaturedGallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { galleryImages, heroImage } from "@/lib/images";

export default function Home() {
  const stripImages = galleryImages.slice(4, 8);

  return (
    <>
      <HeroSection
        image={heroImage}
        title="Light, lingered"
        subtitle="Vega Studio"
      />
      <FeaturedGallerySection images={galleryImages} layout="masonry" />
      <EditorialStripSection images={stripImages} />
      <section
        id="about"
        className="mx-auto max-w-2xl px-[var(--space-sm)] py-[var(--space-2xl)] sm:px-[var(--space-md)] sm:py-[var(--space-3xl)]"
      >
        <p className="text-label mb-6">About</p>
        <p className="text-display-lg text-ink mb-8 font-light">
          Photographs that feel like memory, not performance.
        </p>
        <p className="text-lg leading-[1.75] text-ink-muted sm:text-xl">
          Based between coast and city, I work with couples who want their day
          documented with restraint — honest gestures, soft grain, and the kind
          of quiet that only happens when no one is performing for a lens.
        </p>
      </section>
      <section
        id="contact"
        className="border-t border-line px-[var(--space-sm)] py-[var(--space-2xl)] sm:px-[var(--space-md)]"
      >
        <p className="text-label mb-4">Inquire</p>
        <a
          href="mailto:hello@vegastudio.com"
          className="text-display-lg inline-block text-ink transition-[color,transform] duration-700 ease-[var(--ease-cinematic)] hover:text-ink-muted hover:translate-y-[-3px]"
        >
          hello@vegastudio.com
        </a>
      </section>
      <footer className="px-[var(--space-sm)] pb-[var(--space-lg)] pt-[var(--space-md)] sm:px-[var(--space-md)]">
        <p className="text-sm text-ink-faint">
          © {new Date().getFullYear()} Vega Studio
        </p>
      </footer>
    </>
  );
}
