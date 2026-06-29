import Link from "next/link";

export function ProductHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-[var(--space-sm)] py-5 sm:px-[var(--space-md)]">
        <Link
          href="/"
          className="font-[family-name:var(--font-cormorant)] text-xl font-light tracking-[0.06em] text-ink sm:text-[1.35rem]"
        >
          Vega
        </Link>
        <nav className="flex items-center gap-6 text-[0.8125rem] tracking-[0.12em] text-ink-muted" aria-label="Product">
          <Link href="/s/vega-studio" className="transition-colors hover:text-ink">
            Demo site
          </Link>
          <Link href="/admin" className="transition-colors hover:text-ink">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
