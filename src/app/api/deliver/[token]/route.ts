import { NextResponse } from "next/server";
import { loadStore } from "@/lib/store";
import type { AlbumDeliveryState } from "@/types/album";

type RouteParams = { params: Promise<{ token: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { token } = await params;
  const pin = new URL(request.url).searchParams.get("pin");
  const store = await loadStore();

  const session = store.deliverySessions.find((s) => s.token === token);
  if (!session) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
  }

  if (session.pin && session.pin !== pin) {
    return NextResponse.json({ error: "PIN required", requiresPin: true }, { status: 401 });
  }

  const album = store.albums.find((a) => a.id === session.albumId);
  if (!album) {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }

  const submission = store.picks[session.id];
  const clientAssets = album.assets
    .filter((a) => a.visibleToClient)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const state: AlbumDeliveryState = album.deliveryState;

  return NextResponse.json({
    session: {
      id: session.id,
      token: session.token,
      submittedAt: session.submittedAt,
      finalizedAt: session.finalizedAt,
    },
    album: {
      id: album.id,
      name: album.name,
      shortLabel: album.shortLabel,
      deliveryState: state,
      pickLimit: album.pickLimit,
      categories: album.categories,
      assets: clientAssets.map((a) => ({
        id: a.id,
        categoryId: a.categoryId,
        previewUrl: a.previewUrl,
        finalUrl: state === "finalized" && a.selectionState === "picked" ? a.finalUrl : undefined,
        width: a.width,
        height: a.height,
        alt: a.alt,
        selectionState: a.selectionState,
        clientPickNumber: a.clientPickNumber,
        filename: a.filename,
      })),
    },
    submission: submission ?? null,
    canPick: state === "ready_to_pick" && !submission,
    canDownload: state === "finalized",
  });
}
