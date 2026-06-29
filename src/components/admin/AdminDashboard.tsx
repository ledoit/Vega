"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DELIVERY_STATE_LABELS } from "@/lib/delivery";

type AlbumSummary = {
  id: string;
  name: string;
  slug: string;
  deliveryState: keyof typeof DELIVERY_STATE_LABELS;
  assetCount: number;
  visibleToClient: number;
  visibleOnSite: number;
  coverUrl?: string;
};

export function AdminDashboard() {
  const [albums, setAlbums] = useState<AlbumSummary[]>([]);
  const [siteSlug, setSiteSlug] = useState("vega-studio");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/workspace");
    const data = (await res.json()) as { albums: AlbumSummary[]; site: { slug: string } };
    setAlbums(data.albums);
    setSiteSlug(data.site.slug);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createAlbum = async () => {
    const name = window.prompt("Album name (e.g. Martinez Portrait Session)");
    if (!name?.trim()) return;
    setCreating(true);
    await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setCreating(false);
    await load();
  };

  if (loading) return <p className="p-8 text-ink-muted">Loading workspace…</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
        <div>
          <p className="text-label mb-2">Workspace</p>
          <h1 className="text-display-lg font-light">Albums & delivery</h1>
          <p className="mt-3 max-w-xl text-ink-muted">
            After each shoot, upload a batch, curate visibility and order, then share a
            client link. Picks return here for retouch and finals.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={creating}
            onClick={() => void createAlbum()}
            className="border border-ink bg-ink px-5 py-2.5 text-sm tracking-[0.08em] text-paper disabled:opacity-50"
          >
            New album
          </button>
          <Link
            href="/admin/builder"
            className="border border-line px-5 py-2.5 text-sm tracking-[0.08em] hover:border-ink"
          >
            Portfolio builder
          </Link>
          <Link
            href={`/s/${siteSlug}`}
            target="_blank"
            className="border border-line px-5 py-2.5 text-sm tracking-[0.08em] text-ink-muted hover:text-ink"
          >
            View published site
          </Link>
        </div>
      </div>

      <div className="mb-6 rounded border border-amber-900/20 bg-amber-50/50 px-4 py-3 text-sm text-ink-muted">
        <strong className="text-ink">Try the client flow:</strong>{" "}
        <Link href="/deliver/demo-pick-link" className="underline hover:text-ink">
          Open demo delivery link
        </Link>{" "}
        (Smith Wedding, 5-pick limit) — then return here to see picks on the album.
      </div>

      {albums.length === 0 ? (
        <p className="text-ink-muted">No albums yet. Create one and upload a shoot batch.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {albums.map((album) => (
            <li key={album.id}>
              <Link
                href={`/admin/albums/${album.id}`}
                className="group flex gap-4 border border-line p-4 transition-colors hover:border-ink"
              >
                <div className="h-24 w-20 shrink-0 overflow-hidden bg-stone">
                  {album.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={album.coverUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-light">
                    {album.name}
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {album.assetCount} images · {album.visibleToClient} client ·{" "}
                    {album.visibleOnSite} on site
                  </p>
                  <p className="mt-2 text-xs tracking-[0.08em] text-ink-faint">
                    {DELIVERY_STATE_LABELS[album.deliveryState]}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
