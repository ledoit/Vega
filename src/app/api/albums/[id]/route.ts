import { NextResponse } from "next/server";
import { loadStore, mutateStore } from "@/lib/store";
import type { Album, AlbumDeliveryState } from "@/types/album";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const store = await loadStore();
  const album = store.albums.find((a) => a.id === id);
  if (!album) return NextResponse.json({ error: "Album not found" }, { status: 404 });

  const session = store.deliverySessions.find((s) => s.albumId === id);
  const submission = session ? store.picks[session.id] : undefined;

  return NextResponse.json({ album, session, submission });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json()) as Partial<Album> & {
    deliveryState?: AlbumDeliveryState;
    reorder?: string[];
  };

  let updated: Album | undefined;

  await mutateStore((store) => {
    const album = store.albums.find((a) => a.id === id);
    if (!album) return;

    if (body.name) album.name = body.name;
    if (body.shortLabel !== undefined) album.shortLabel = body.shortLabel;
    if (body.pickLimit !== undefined) album.pickLimit = body.pickLimit;
    if (body.deliveryState) album.deliveryState = body.deliveryState;
    if (body.coverAssetId !== undefined) album.coverAssetId = body.coverAssetId;

    if (body.reorder) {
      body.reorder.forEach((assetId, index) => {
        const asset = album.assets.find((a) => a.id === assetId);
        if (asset) asset.sortOrder = index;
      });
      album.assets.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    if (body.assets) {
      album.assets = body.assets;
    }

    updated = album;
  });

  if (!updated) return NextResponse.json({ error: "Album not found" }, { status: 404 });
  return NextResponse.json({ album: updated });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  await mutateStore((store) => {
    store.albums = store.albums.filter((a) => a.id !== id);
    store.deliverySessions = store.deliverySessions.filter((s) => s.albumId !== id);
  });
  return NextResponse.json({ ok: true });
}
