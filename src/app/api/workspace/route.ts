import { NextResponse } from "next/server";
import { loadStore } from "@/lib/store";

export async function GET() {
  const store = await loadStore();
  return NextResponse.json({
    workspace: store.workspace,
    albums: store.albums.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      deliveryState: a.deliveryState,
      assetCount: a.assets.length,
      visibleToClient: a.assets.filter((x) => x.visibleToClient).length,
      visibleOnSite: a.assets.filter((x) => x.visibleOnSite).length,
      pickLimit: a.pickLimit,
      coverUrl: a.assets.find((x) => x.id === a.coverAssetId)?.previewUrl ?? a.assets[0]?.previewUrl,
    })),
    site: store.site,
  });
}
