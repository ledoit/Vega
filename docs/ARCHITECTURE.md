# Vega — Architecture

Photographer portfolio. Cinematic, restrained, editorial. Photography dominates; UI stays nearly invisible.

## Page sections

| Section | Role |
|---------|------|
| `SiteHeader` | Minimal nav; recedes on scroll |
| `HeroSection` | Full-bleed hero, slow reveal, single line of copy |
| `FeaturedGallerySection` | Primary work — masonry or horizontal |
| `AboutSection` | (planned) Portrait + short statement |
| `ContactSection` | (planned) Quiet inquiry, no loud CTAs |

## Animation philosophy

- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` — ease-out-quart, analog feel
- **Duration:** 0.9–1.4s for enters; 0.5–0.7s for hovers
- **Movement:** max 5px translate on hover; no bounce, spring, or scale pops
- **Opacity:** primary transition channel; blur only in hero load
- **Reduced motion:** respect `prefers-reduced-motion`

## Responsive behavior

- Mobile-first type and spacing tokens
- Hero: 100svh, crop `object-cover`, copy anchored bottom with safe-area padding
- Gallery masonry: 1 col → 2 → 3; horizontal: scroll-snap + edge padding
- Nav: fewer links visible on small screens; same visual weight (no hamburger chrome)

## Palette token system

Defined in `globals.css` as CSS variables, mapped into Tailwind `@theme`:

- **Surface:** paper, elevated, overlay
- **Ink:** primary, muted, faint (low contrast)
- **Accent:** single warm neutral, never saturated CTA

## Typography scale

- Display (Cormorant): hero and section titles
- Sans (Libre Franklin): UI, captions, nav
- Fluid clamp() sizes; body never below 17px on mobile

## Image loading strategy

1. `next/image` with `sizes` per layout mode
2. `loading="lazy"` + `placeholder="blur"` for below-fold
3. Priority only for hero LCP image
4. Lightbox loads full `src` on open; prefetch adjacent slides
