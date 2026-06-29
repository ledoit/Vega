"use client";

import { useCallback, useRef, useState } from "react";
import { compressFiles } from "@/lib/compress-image";

type UploadBatchProps = {
  albumId: string;
  onComplete: () => void;
};

export function UploadBatch({ albumId, onComplete }: UploadBatchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!list.length) {
        setError("No images found in selection.");
        return;
      }

      setBusy(true);
      setError(null);
      setProgress(`Compressing 0 / ${list.length}…`);

      try {
        const compressed = await compressFiles(list, (done, total) => {
          setProgress(`Compressing ${done} / ${total}…`);
        });

        setProgress("Uploading…");
        const res = await fetch(`/api/albums/${albumId}/assets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: compressed }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "Upload failed");
        }

        setProgress(null);
        onComplete();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setBusy(false);
      }
    },
    [albumId, onComplete],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="border border-ink bg-ink px-4 py-2.5 text-sm tracking-[0.08em] text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload files"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => folderRef.current?.click()}
          className="border border-line px-4 py-2.5 text-sm tracking-[0.08em] text-ink transition-colors hover:border-ink disabled:opacity-50"
        >
          Upload folder
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) void upload(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={folderRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        // @ts-expect-error webkitdirectory is non-standard but widely supported
        webkitdirectory=""
        onChange={(e) => {
          if (e.target.files) void upload(e.target.files);
          e.target.value = "";
        }}
      />

      {progress && <p className="text-sm text-ink-muted">{progress}</p>}
      {error && <p className="text-sm text-red-800">{error}</p>}
      <p className="text-xs text-ink-faint">
        Local disk or external drive — select files or an entire folder. Images are
        compressed before upload.
      </p>
    </div>
  );
}
