"use client";

import Link from "next/link";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Inquire" },
];

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    setOverHero(window.scrollY < window.innerHeight * 0.72);
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setOverHero(y < window.innerHeight * 0.72);
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color] duration-700 ease-[var(--ease-cinematic)] ${
        overHero ? "" : "border-b border-line bg-paper/92 backdrop-blur-[2px]"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-[var(--space-sm)] py-5 sm:px-[var(--space-md)] sm:py-6">
        <Link
          href="/"
          className={`font-[family-name:var(--font-cormorant)] text-xl font-light tracking-[0.06em] transition-colors duration-700 sm:text-[1.35rem] ${
            overHero
              ? "text-[var(--vega-paper-elevated)]"
              : "text-ink"
          }`}
        >
          Vega
        </Link>

        <nav className="flex items-center gap-7 sm:gap-9" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.8125rem] tracking-[0.12em] transition-[color,transform] duration-500 ease-[var(--ease-cinematic)] hover:translate-y-[-2px] ${
                overHero
                  ? "text-[var(--vega-paper-elevated)]/80 hover:text-[var(--vega-paper-elevated)]"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
