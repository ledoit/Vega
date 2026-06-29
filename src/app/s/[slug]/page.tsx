import { notFound } from "next/navigation";
import { PublishedSiteView } from "@/components/site/PublishedSiteView";
import { loadStore } from "@/lib/store";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const store = await loadStore();
  if (store.site.slug !== slug) return { title: "Site not found" };
  return {
    title: `${store.site.heroTitle} — ${store.site.heroSubtitle}`,
    description: store.site.aboutText.slice(0, 160),
  };
}

export default async function PublishedSitePage({ params }: PageProps) {
  const { slug } = await params;
  const store = await loadStore();

  if (!store.site.published || store.site.slug !== slug) {
    notFound();
  }

  return <PublishedSiteView site={store.site} albums={store.albums} />;
}
