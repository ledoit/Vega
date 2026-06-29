import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-[var(--space-sm)] py-[var(--space-2xl)] sm:px-[var(--space-md)] sm:py-[var(--space-3xl)]">
      <p className="text-label mb-6">Menhir Holdings</p>
      <h1 className="text-display-lg mb-8 font-light text-ink">
        Photo portfolios & client delivery
      </h1>
      <p className="mb-10 text-lg leading-[1.75] text-ink-muted sm:text-xl">
        For photo students and working photographers. Build your site, publish to
        your URL, deliver shoots on the same album model — upload, curate, share a
        pick link, retouch, and hand off finals on that same link.
      </p>

      <div className="mb-14 grid gap-6 sm:grid-cols-2">
        <section className="border border-line p-6">
          <h2 className="mb-3 font-[family-name:var(--font-cormorant)] text-2xl font-light">
            Portfolio builder
          </h2>
          <p className="text-sm leading-relaxed text-ink-muted">
            Desktop controller + live preview. Publish to{" "}
            <code className="text-ink">/s/your-slug</code> or your custom domain.
          </p>
        </section>
        <section className="border border-line p-6">
          <h2 className="mb-3 font-[family-name:var(--font-cormorant)] text-2xl font-light">
            Client delivery
          </h2>
          <p className="text-sm leading-relaxed text-ink-muted">
            Mobile pick link on private albums — same URL when finals are ready for
            one-click download.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin"
          className="border border-ink bg-ink px-6 py-3 text-sm tracking-[0.1em] text-paper transition-opacity hover:opacity-90"
        >
          Photographer admin
        </Link>
        <Link
          href="/deliver/demo-pick-link"
          className="border border-line px-6 py-3 text-sm tracking-[0.1em] text-ink transition-colors hover:border-ink"
        >
          Client demo link
        </Link>
        <Link
          href="/s/vega-studio"
          className="border border-line px-6 py-3 text-sm tracking-[0.1em] text-ink-muted transition-colors hover:border-ink hover:text-ink"
        >
          Published portfolio
        </Link>
      </div>
    </div>
  );
}
