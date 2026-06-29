"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Album } from "@/types/album";
import type { SiteBuilderConfig } from "@/types/site";

export function SiteBuilder() {
  const [site, setSite] = useState<SiteBuilderConfig | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [siteRes, albumsRes] = await Promise.all([
      fetch("/api/site"),
      fetch("/api/albums"),
    ]);
    const siteData = (await siteRes.json()) as { site: SiteBuilderConfig };
    const albumsData = (await albumsRes.json()) as { albums: Album[] };
    setSite(siteData.site);
    setAlbums(albumsData.albums);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (patch: Partial<SiteBuilderConfig>) => {
    if (!site) return;
    setSaving(true);
    const res = await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...site, ...patch }),
    });
    const data = (await res.json()) as { site: SiteBuilderConfig };
    setSite(data.site);
    setSaving(false);
  };

  const publish = async () => {
    await save({ published: true });
    setMsg("Published — your site is live.");
    setTimeout(() => setMsg(null), 3000);
  };

  if (!site) return <p className="p-8 text-ink-muted">Loading builder…</p>;

  const galleryAlbumId = site.sections.find((s) => s.type === "gallery")?.albumId ?? albums[0]?.id;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <Link href="/admin" className="mb-2 inline-block text-sm text-ink-muted hover:text-ink">
            ← Albums
          </Link>
          <h1 className="text-display-lg font-light">Portfolio builder</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Controller + preview. Publish to{" "}
            <code className="text-ink">/s/{site.slug}</code> or your custom domain later.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/s/${site.slug}`}
            target="_blank"
            className="border border-line px-4 py-2 text-sm tracking-[0.08em]"
          >
            Preview
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => void publish()}
            className="border border-ink bg-ink px-4 py-2 text-sm tracking-[0.08em] text-paper disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {msg && <p className="mb-6 text-sm text-ink">{msg}</p>}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-5 border border-line p-5">
          <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-light">Site copy</h2>
          <label className="block">
            <span className="text-label mb-1 block">URL slug</span>
            <input
              className="w-full border border-line bg-paper px-3 py-2 text-sm"
              value={site.slug}
              onChange={(e) => setSite({ ...site, slug: e.target.value })}
              onBlur={() => void save({ slug: site.slug })}
            />
          </label>
          <label className="block">
            <span className="text-label mb-1 block">Hero title</span>
            <input
              className="w-full border border-line bg-paper px-3 py-2 text-sm"
              value={site.heroTitle}
              onChange={(e) => setSite({ ...site, heroTitle: e.target.value })}
              onBlur={() => void save({ heroTitle: site.heroTitle })}
            />
          </label>
          <label className="block">
            <span className="text-label mb-1 block">Hero subtitle</span>
            <input
              className="w-full border border-line bg-paper px-3 py-2 text-sm"
              value={site.heroSubtitle}
              onChange={(e) => setSite({ ...site, heroSubtitle: e.target.value })}
              onBlur={() => void save({ heroSubtitle: site.heroSubtitle })}
            />
          </label>
          <label className="block">
            <span className="text-label mb-1 block">About</span>
            <textarea
              rows={4}
              className="w-full border border-line bg-paper px-3 py-2 text-sm"
              value={site.aboutText}
              onChange={(e) => setSite({ ...site, aboutText: e.target.value })}
              onBlur={() => void save({ aboutText: site.aboutText })}
            />
          </label>
          <label className="block">
            <span className="text-label mb-1 block">Contact email</span>
            <input
              type="email"
              className="w-full border border-line bg-paper px-3 py-2 text-sm"
              value={site.contactEmail}
              onChange={(e) => setSite({ ...site, contactEmail: e.target.value })}
              onBlur={() => void save({ contactEmail: site.contactEmail })}
            />
          </label>
        </section>

        <section className="border border-line p-5">
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-light">
            Live preview
          </h2>
          <div className="aspect-[9/16] max-h-[520px] w-full overflow-hidden border border-line bg-paper-elevated sm:aspect-[4/5]">
            <iframe
              title="Site preview"
              src={`/s/${site.slug}`}
              className="h-full w-full scale-[0.98] origin-top"
            />
          </div>
          <p className="mt-4 text-xs text-ink-faint">
            Public gallery pulls images marked <strong>Site</strong> in album curator.
            Featured album: {albums.find((a) => a.id === galleryAlbumId)?.name ?? "—"}
          </p>
        </section>
      </div>
    </div>
  );
}
