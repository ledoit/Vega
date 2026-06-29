import { NextResponse } from "next/server";
import { newId } from "@/lib/id";
import { mutateStore } from "@/lib/store";
import type { MediaAsset } from "@/types/album";

type RouteParams = { params: Promise<{ id: string }> };

type UploadBody = {
  files: Array<{
    filename: string;
    dataUrl: string;
    width: number;
    height: number;
  }>;
  categoryId?: string | null;
};

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json()) as UploadBody;

  if (!body.files?.length) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }

  let added: MediaAsset[] = [];

  await mutateStore((store) => {
    const album = store.albums.find((a) => a.id === id);
    if (!album) return;

    const baseOrder = album.assets.length;
    added = body.files.map((file, i) => ({
      id: newId(),
      projectId: album.projectId,
      albumId: album.id,
      categoryId: body.categoryId ?? null,
      filename: file.filename,
      previewUrl: file.dataUrl,
      originalUrl: file.dataUrl,
      width: file.width,
      height: file.height,
      alt: file.filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      sortOrder: baseOrder + i,
      visibleToClient: true,
      visibleOnSite: false,
      selectionState: "none" as const,
    }));

    album.assets.push(...added);
    if (!album.coverAssetId && added[0]) album.coverAssetId = added[0].id;
    if (album.deliveryState === "draft" && album.assets.length > 0) {
      album.deliveryState = "draft";
    }
  });

  if (!added.length) {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }

  return NextResponse.json({ assets: added }, { status: 201 });
}
