import { NextResponse } from "next/server";
import { mutateStore } from "@/lib/store";

type RouteParams = { params: Promise<{ id: string }> };

/** Mark picked assets as finalized (demo: copies preview to finalUrl). */
export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  await mutateStore((store) => {
    const album = store.albums.find((a) => a.id === id);
    if (!album) return;

    const session = store.deliverySessions.find((s) => s.albumId === id);
    album.assets.forEach((asset) => {
      if (asset.selectionState === "picked") {
        asset.finalUrl = asset.finalUrl ?? asset.originalUrl ?? asset.previewUrl;
      }
    });
    album.deliveryState = "finalized";
    if (session) session.finalizedAt = new Date().toISOString();
  });

  return NextResponse.json({ ok: true });
}
