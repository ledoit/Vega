"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DELIVERY_STATE_LABELS } from "@/lib/delivery";
import type { Album, AlbumDeliveryState, ClientPickSubmission, DeliverySession } from "@/types/album";
import { UploadBatch } from "./UploadBatch";

type AlbumEditorProps = {
  albumId: string;
};

export function AlbumEditor({ albumId }: AlbumEditorProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [session, setSession] = useState<DeliverySession | null>(null);
  const [submission, setSubmission] = useState<ClientPickSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "client" | "site">("all");

  const load = useCallback(async () => {
    const res = await fetch(`/api/albums/${albumId}`);
    if (!res.ok) return;
    const data = (await res.json()) as {
      album: Album;
      session: DeliverySession | null;
      submission: ClientPickSubmission | null;
    };
    setAlbum(data.album);
    setSession(data.session);
    setSubmission(data.submission);
    setLoading(false);
  }, [albumId]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchAlbum = async (patch: Partial<Album> & { reorder?: string[] }) => {
    await fetch(`/api/albums/${albumId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
  };

  const patchAsset = async (
    assetId: string,
    patch: { visibleToClient?: boolean; visibleOnSite?: boolean },
  ) => {
    await fetch(`/api/albums/${albumId}/assets/${assetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
  };

  const moveAsset = async (assetId: string, direction: -1 | 1) => {
    if (!album) return;
    const sorted = [...album.assets].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((a) => a.id === assetId);
    const swap = idx + direction;
    if (swap < 0 || swap >= sorted.length) return;
    [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
    await patchAlbum({ reorder: sorted.map((a) => a.id) });
  };

  const ensureDeliveryLink = async () => {
    const res = await fetch(`/api/albums/${albumId}/delivery`, { method: "POST", body: "{}" });
    const data = (await res.json()) as { token: string };
    await load();
    return data.token;
  };

  const copyLink = async () => {
    const token = session?.token ?? (await ensureDeliveryLink());
    const url = `${window.location.origin}/deliver/${token}`;
    await navigator.clipboard.writeText(url);
    setCopyMsg("Client link copied");
    setTimeout(() => setCopyMsg(null), 2500);
  };

  const setState = async (deliveryState: AlbumDeliveryState) => {
    if (deliveryState === "ready_to_pick" && !session) await ensureDeliveryLink();
    await patchAlbum({ deliveryState });
  };

  const finalize = async () => {
    await fetch(`/api/albums/${albumId}/finalize`, { method: "POST" });
    await load();
  };

  if (loading) {
    return <p className="p-8 text-ink-muted">Loading album…</p>;
  }

  if (!album) {
    return <p className="p-8 text-ink-muted">Album not found.</p>;
  }

  const sorted = [...album.assets].sort((a, b) => a.sortOrder - b.sortOrder);
  const filtered = sorted.filter((a) => {
    if (filter === "client") return a.visibleToClient;
    if (filter === "site") return a.visibleOnSite;
    return true;
  });

  const pickedAssets = sorted.filter((a) => a.selectionState === "picked");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <Link href="/admin" className="mb-2 inline-block text-sm text-ink-muted hover:text-ink">
            ← Albums
          </Link>
          <h1 className="text-display-lg font-light">{album.name}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {sorted.length} images · {DELIVERY_STATE_LABELS[album.deliveryState]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DELIVERY_STATE_LABELS) as AlbumDeliveryState[]).map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => void setState(state)}
              className={`border px-3 py-1.5 text-xs tracking-[0.06em] transition-colors ${
                album.deliveryState === state
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {DELIVERY_STATE_LABELS[state]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10 grid gap-6 lg:grid-cols-2">
        <section className="border border-line p-5">
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-light">
            Upload batch
          </h2>
          <UploadBatch albumId={albumId} onComplete={() => void load()} />
        </section>

        <section className="border border-line p-5">
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-light">
            Client delivery
          </h2>
          <p className="mb-4 text-sm text-ink-muted">
            Share one link for picking and later downloads. Hidden images stay out of
            the client grid.
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyLink()}
              className="border border-ink px-4 py-2 text-sm tracking-[0.08em]"
            >
              Copy client link
            </button>
            {session && (
              <Link
                href={`/deliver/${session.token}`}
                target="_blank"
                className="border border-line px-4 py-2 text-sm tracking-[0.08em] text-ink-muted hover:text-ink"
              >
                Preview as client
              </Link>
            )}
          </div>
          {copyMsg && <p className="text-sm text-ink">{copyMsg}</p>}
          {session && (
            <p className="mt-2 break-all font-mono text-xs text-ink-faint">
              /deliver/{session.token}
            </p>
          )}
          <div className="mt-4">
            <label className="text-label mb-2 block">Pick limit</label>
            <input
              type="number"
              min={1}
              className="w-24 border border-line bg-paper px-3 py-2 text-sm"
              value={album.pickLimit ?? ""}
              placeholder="∞"
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined;
                void patchAlbum({ pickLimit: v });
              }}
            />
          </div>
        </section>
      </div>

      {submission && (
        <section className="mb-10 border border-line bg-paper-elevated p-5">
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-light">
            Client selection ({submission.picks.length})
          </h2>
          <ul className="mb-4 space-y-2 text-sm">
            {pickedAssets.map((a) => (
              <li key={a.id} className="flex flex-wrap gap-2 border-b border-line py-2">
                <span className="font-mono text-ink-faint">#{a.clientPickNumber}</span>
                <span>{a.filename}</span>
                {a.clientNote && (
                  <span className="text-ink-muted">— {a.clientNote}</span>
                )}
              </li>
            ))}
          </ul>
          {album.deliveryState === "picked" && (
            <button
              type="button"
              onClick={() => void finalize()}
              className="border border-ink bg-ink px-4 py-2 text-sm tracking-[0.08em] text-paper"
            >
              Mark finals ready (enable client download)
            </button>
          )}
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-light">
            Curate · order · visibility
          </h2>
          <div className="flex gap-2 text-xs tracking-[0.08em]">
            {(["all", "client", "site"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`border px-2.5 py-1 ${
                  filter === f ? "border-ink text-ink" : "border-line text-ink-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((asset) => (
            <div key={asset.id} className="group border border-line bg-paper-elevated">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.previewUrl}
                  alt={asset.alt}
                  className="h-full w-full object-cover"
                />
                {asset.selectionState === "picked" && (
                  <span className="absolute left-2 top-2 bg-ink px-2 py-0.5 text-xs text-paper">
                    #{asset.clientPickNumber}
                  </span>
                )}
              </div>
              <div className="space-y-2 p-2">
                <p className="truncate font-mono text-[10px] text-ink-faint">{asset.filename}</p>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    title="Visible to client"
                    onClick={() =>
                      void patchAsset(asset.id, { visibleToClient: !asset.visibleToClient })
                    }
                    className={`px-2 py-0.5 text-[10px] tracking-wide ${
                      asset.visibleToClient
                        ? "bg-ink text-paper"
                        : "border border-line text-ink-faint"
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    title="On portfolio site"
                    onClick={() =>
                      void patchAsset(asset.id, { visibleOnSite: !asset.visibleOnSite })
                    }
                    className={`px-2 py-0.5 text-[10px] tracking-wide ${
                      asset.visibleOnSite
                        ? "bg-ink text-paper"
                        : "border border-line text-ink-faint"
                    }`}
                  >
                    Site
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Move earlier"
                    onClick={() => void moveAsset(asset.id, -1)}
                    className="flex-1 border border-line py-1 text-xs text-ink-muted hover:text-ink"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Move later"
                    onClick={() => void moveAsset(asset.id, 1)}
                    className="flex-1 border border-line py-1 text-xs text-ink-muted hover:text-ink"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
