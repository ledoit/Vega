import { NextResponse } from "next/server";
import { loadStore, mutateStore } from "@/lib/store";
import type { SiteBuilderConfig } from "@/types/site";

export async function GET() {
  const store = await loadStore();
  return NextResponse.json({ site: store.site, workspace: store.workspace });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Partial<SiteBuilderConfig>;
  let site: SiteBuilderConfig | undefined;

  await mutateStore((store) => {
    store.site = { ...store.site, ...body };
    if (body.published) {
      store.site.publishedAt = new Date().toISOString();
      store.workspace.site = {
        workspaceId: store.workspace.id,
        slug: store.site.slug,
        productionUrl: `/s/${store.site.slug}`,
        publishedAt: store.site.publishedAt,
      };
    }
    site = store.site;
  });

  return NextResponse.json({ site });
}
