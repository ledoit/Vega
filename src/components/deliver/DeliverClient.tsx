"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AlbumDeliveryState, Category } from "@/types/album";

type ClientAsset = {
  id: string;
  categoryId: string | null;
  previewUrl: string;
  finalUrl?: string;
  width: number;
  height: number;
  alt: string;
  selectionState?: string;
  clientPickNumber?: number;
  filename: string;
};

type DeliverData = {
  session: { submittedAt?: string; finalizedAt?: string };
  album: {
    name: string;
    shortLabel?: string;
    deliveryState: AlbumDeliveryState;
    pickLimit?: number;
    categories: Category[];
    assets: ClientAsset[];
  };
  submission: { picks: Array<{ assetId: string; note?: string }> } | null;
  canPick: boolean;
  canDownload: boolean;
  requiresPin?: boolean;
};

type DeliverClientProps = {
  token: string;
};

export function DeliverClient({ token }: DeliverClientProps) {
  const [data, setData] = useState<DeliverData | null>(null);
  const [pin, setPin] = useState("");
  const [pinNeeded, setPinNeeded] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const load = useCallback(
    async (pinValue?: string) => {
      const q = pinValue ? `?pin=${encodeURIComponent(pinValue)}` : "";
      const res = await fetch(`/api/deliver/${token}${q}`);
      if (res.status === 401) {
        setPinNeeded(true);
        return;
      }
      if (!res.ok) {
        setError("This gallery link is invalid or expired.");
        return;
      }
      const json = (await res.json()) as DeliverData;
      setData(json);
      setPinNeeded(false);
      if (json.submission) {
        setSelected(new Set(json.submission.picks.map((p) => p.assetId)));
        setDone(true);
      }
    },
    [token],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = (id: string) => {
    if (!data?.canPick || done) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (data.album.pickLimit && next.size >= data.album.pickLimit) {
          setError(`You can select up to ${data.album.pickLimit} images.`);
          return prev;
        }
        next.add(id);
      }
      setError(null);
      return next;
    });
  };

  const submit = async () => {
    if (!data || selected.size === 0) {
      setError("Select at least one image.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/deliver/${token}/picks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pin: pin || undefined,
        picks: [...selected].map((assetId) => ({
          assetId,
          note: notes[assetId] || undefined,
        })),
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? "Could not submit");
      setSubmitting(false);
      return;
    }
    setDone(true);
    setSubmitting(false);
    await load(pin);
  };

  const filteredAssets = useMemo(() => {
    if (!data) return [];
    if (activeCategory === "all") return data.album.assets;
    return data.album.assets.filter((a) => a.categoryId === activeCategory);
  }, [data, activeCategory]);

  const downloadAsset = (asset: ClientAsset) => {
    const url = asset.finalUrl ?? asset.previewUrl;
    const a = document.createElement("a");
    a.href = url;
    a.download = asset.filename;
    a.click();
  };

  const downloadAll = async () => {
    if (!data) return;
    const finals = data.album.assets.filter(
      (a) => a.selectionState === "picked" && (a.finalUrl || a.previewUrl),
    );
    for (const asset of finals) {
      downloadAsset(asset);
      await new Promise((r) => setTimeout(r, 300));
    }
  };

  if (pinNeeded) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-5">
        <p className="text-label mb-4">Private gallery</p>
        <h1 className="mb-6 font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Enter PIN
        </h1>
        <input
          type="password"
          inputMode="numeric"
          className="mb-4 w-full border border-line bg-paper px-4 py-3 text-lg tracking-widest"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••"
        />
        <button
          type="button"
          onClick={() => void load(pin)}
          className="w-full border border-ink bg-ink py-4 text-sm tracking-[0.1em] text-paper"
        >
          Open gallery
        </button>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-5">
        <p className="text-center text-ink-muted">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-ink-muted">Loading your gallery…</p>
      </div>
    );
  }

  const { album, canPick, canDownload } = data;
  const state = album.deliveryState;

  return (
    <div className="mx-auto min-h-[100dvh] max-w-lg pb-28">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-4 backdrop-blur-sm">
        <p className="text-label mb-1">{album.shortLabel ?? "Gallery"}</p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
          {album.name}
        </h1>
        <p className="mt-1 text-xs text-ink-faint">
          {state === "ready_to_pick" && !done && "Tap hearts to select favorites"}
          {state === "ready_to_pick" && done && "Selection sent — your photographer will retouch"}
          {state === "picked" && "Your photographer is preparing finals"}
          {state === "finalized" && canDownload && "Your retouched images are ready"}
          {state === "draft" && "Gallery not yet published"}
        </p>
      </header>

      {album.categories.length > 0 && (
        <div
          className="flex gap-2 overflow-x-auto border-b border-line px-4 py-3"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-3 py-1.5 text-xs tracking-[0.1em] ${
              activeCategory === "all" ? "bg-ink text-paper" : "text-ink-muted"
            }`}
          >
            All
          </button>
          {album.categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 text-xs tracking-[0.1em] ${
                activeCategory === cat.id ? "bg-ink text-paper" : "text-ink-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {canPick && !done && (
        <p className="px-4 py-3 text-center text-sm text-ink-muted">
          {selected.size}
          {album.pickLimit ? ` / ${album.pickLimit}` : ""} selected
        </p>
      )}

      <div className="grid grid-cols-2 gap-1 px-1 pt-1">
        {filteredAssets.map((asset) => {
          const isSelected = selected.has(asset.id);
          const showDownload = canDownload && asset.selectionState === "picked";

          return (
            <div key={asset.id} className="relative aspect-[3/4] overflow-hidden bg-stone">
              <button
                type="button"
                className="relative h-full w-full"
                onClick={() => (showDownload ? downloadAsset(asset) : toggle(asset.id))}
                aria-pressed={isSelected}
                aria-label={asset.alt}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.previewUrl}
                  alt={asset.alt}
                  className="h-full w-full object-cover"
                />
                {canPick && !done && (
                  <span
                    className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors ${
                      isSelected ? "bg-ink text-paper" : "bg-paper/80 text-ink-faint"
                    }`}
                    aria-hidden
                  >
                    {isSelected ? "♥" : "♡"}
                  </span>
                )}
                {asset.clientPickNumber && (
                  <span className="absolute left-2 top-2 bg-ink px-2 py-0.5 text-xs text-paper">
                    #{asset.clientPickNumber}
                  </span>
                )}
              </button>
              {canPick && isSelected && !done && (
                <input
                  type="text"
                  placeholder="Retouch note (optional)"
                  className="absolute inset-x-0 bottom-0 border-t border-line bg-paper/95 px-2 py-1.5 text-[11px]"
                  value={notes[asset.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [asset.id]: e.target.value }))}
                />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="fixed bottom-20 inset-x-4 text-center text-sm text-red-800">{error}</p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-4 backdrop-blur-sm">
        {canPick && !done && (
          <button
            type="button"
            disabled={submitting || selected.size === 0}
            onClick={() => void submit()}
            className="w-full border border-ink bg-ink py-4 text-sm tracking-[0.12em] text-paper disabled:opacity-40"
          >
            {submitting ? "Sending…" : `Submit ${selected.size} pick${selected.size === 1 ? "" : "s"}`}
          </button>
        )}
        {canDownload && (
          <button
            type="button"
            onClick={() => void downloadAll()}
            className="w-full border border-ink bg-ink py-4 text-sm tracking-[0.12em] text-paper"
          >
            Download all finals
          </button>
        )}
        {done && !canDownload && state !== "finalized" && (
          <p className="text-center text-sm text-ink-muted">
            Thanks — you&apos;ll get the same link when downloads are ready.
          </p>
        )}
        <p className="mt-3 text-center text-[10px] text-ink-faint">
          <Link href="/" className="underline">
            Vega
          </Link>
        </p>
      </div>
    </div>
  );
}
