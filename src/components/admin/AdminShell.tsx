"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Albums" },
  { href: "/admin/builder", label: "Portfolio" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-[family-name:var(--font-cormorant)] text-xl font-light tracking-[0.06em]"
            >
              Vega
            </Link>
            <nav className="hidden items-center gap-6 sm:flex" aria-label="Admin">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.8125rem] tracking-[0.1em] transition-colors ${
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "text-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="text-xs tracking-[0.08em] text-ink-faint">Photographer · desktop</p>
        </div>
      </header>
      {children}
    </div>
  );
}
