import { NextResponse } from "next/server";
import { loadStore } from "@/lib/store";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const store = await loadStore();

  if (!store.site.published || store.site.slug !== slug) {
    return NextResponse.json({ error: "Site not published" }, { status: 404 });
  }

  const albums = store.albums.map((album) => ({
    ...album,
    assets: album.assets
      .filter((a) => a.visibleOnSite)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));

  return NextResponse.json({
    site: store.site,
    workspace: store.workspace,
    albums,
  });
}
