import { NextResponse } from "next/server";
import { createEmptyAlbum } from "@/lib/store/seed";
import { loadStore, mutateStore } from "@/lib/store";

export async function GET() {
  const store = await loadStore();
  return NextResponse.json({ albums: store.albums });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string };
  const name = body.name?.trim() || "Untitled shoot";

  const album = createEmptyAlbum(name);

  await mutateStore((store) => {
    album.sortOrder = store.albums.length;
    store.albums.unshift(album);
  });

  return NextResponse.json({ album }, { status: 201 });
}
