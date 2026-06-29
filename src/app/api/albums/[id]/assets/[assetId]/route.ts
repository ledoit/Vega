import { NextResponse } from "next/server";
import { mutateStore } from "@/lib/store";

type RouteParams = { params: Promise<{ id: string; assetId: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id, assetId } = await params;
  const body = (await request.json()) as {
    visibleToClient?: boolean;
    visibleOnSite?: boolean;
    categoryId?: string | null;
    sortOrder?: number;
    clientNote?: string;
  };

  await mutateStore((store) => {
    const album = store.albums.find((a) => a.id === id);
    const asset = album?.assets.find((a) => a.id === assetId);
    if (!asset) return;

    if (body.visibleToClient !== undefined) asset.visibleToClient = body.visibleToClient;
    if (body.visibleOnSite !== undefined) asset.visibleOnSite = body.visibleOnSite;
    if (body.categoryId !== undefined) asset.categoryId = body.categoryId;
    if (body.sortOrder !== undefined) asset.sortOrder = body.sortOrder;
    if (body.clientNote !== undefined) asset.clientNote = body.clientNote;
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id, assetId } = await params;

  await mutateStore((store) => {
    const album = store.albums.find((a) => a.id === id);
    if (!album) return;
    album.assets = album.assets.filter((a) => a.id !== assetId);
    if (album.coverAssetId === assetId) {
      album.coverAssetId = album.assets[0]?.id ?? null;
    }
  });

  return NextResponse.json({ ok: true });
}
