# BOB → Vega migration

**BOB** (`Menhir Holdings/Website/BOB`) is retired. **Vega** is the only website/gallery product.

## Siphon into Vega

| BOB asset | Vega destination | Action |
|-----------|------------------|--------|
| `scripts/deploy-to-vercel.mjs` | `vega/scripts/deploy-to-vercel.mjs` | Copy + adapt env (`VERCEL_SCOPE=menhir-tech`) |
| `src/utils/buildSiteHtml.ts` | `vega/src/lib/site/build-html.ts` | Port; strip non-photo sections |
| `src/utils/generateSiteProject.ts` | `vega/src/lib/site/generate-project.ts` | Port; output Next/static photo site only |
| `src/utils/downloadSiteZip.ts` | `vega/src/lib/site/download-zip.ts` | Keep for export |
| `src/utils/siteTheme.ts` | `vega/src/lib/site/themes.ts` | Replace with photo-native palettes |
| `src/constants/sketch-templates.ts` | `vega/src/lib/site/section-catalog.ts` | **Replace** with Vega section types only (hero, gallery, album-grid, about, contact) |
| `src/utils/siteCopy.ts` | Merge into section defaults | Photo copy presets only |
| `.env.example` Vercel token pattern | `vega/.env.example` | Document |

## Do not migrate

| BOB asset | Reason |
|-----------|--------|
| Delegation builder / vision funnel / capability chips | Generic product-builder UX — not photo-specific |
| `delegation-capabilities.ts`, `delegationVisionParser.ts` | BOB-only abstraction |
| `enrichSketchFromBrief.ts` | Generic brief → site; replace with album-aware flow later |
| `generated-sites/*` smoke tests | Delete with BOB |
| Vue app shell (`App.vue`, components) | Vega is Next.js |

## Delete BOB (when greenlit)

1. Confirm Vega deploy path works for at least one test site
2. Remove Vercel projects matching `bob-*` (already cleaned 2026-06)
3. Archive GitHub repo `ledoit/BOB` or delete if never public
4. `rm -rf Menhir Holdings/Website/BOB`
5. Update `Monetization/monetization.md` — BOB → Vega only

## Vega repo already has

- Gallery components: masonry, horizontal, lightbox, gestures (`src/components/gallery/`)
- Photo-native marketing page stub (`src/app/page.tsx`)
- Next.js 16 + Framer Motion

BOB’s value was **deploy plumbing** and **static site generation** — not the delegation UI.
