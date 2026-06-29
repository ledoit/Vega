import { galleryImages, heroImage } from "@/lib/images";
import { deliveryToken, newId, slugify } from "@/lib/id";
import type {
  Album,
  ClientPickSubmission,
  DeliverySession,
  Workspace,
} from "@/types/album";
import type { SiteBuilderConfig } from "@/types/site";
import type { VegaStore } from "./types";

function seedAssets(albumId: string, projectId: string) {
  return galleryImages.map((img, i) => ({
    id: newId(),
    projectId,
    albumId,
    categoryId: i < 4 ? "cat-ceremony" : "cat-portraits",
    filename: `IMG_${String(i + 1).padStart(4, "0")}.jpg`,
    previewUrl: img.src,
    originalUrl: img.src,
    width: img.width,
    height: img.height,
    alt: img.alt,
    sortOrder: i,
    visibleToClient: true,
    visibleOnSite: i !== 2,
    selectionState: "none" as const,
  }));
}

export function createSeedStore(): VegaStore {
  const workspaceId = "ws-demo";
  const projectId = "proj-demo";
  const albumId = "album-smith-wedding";

  const album: Album = {
    id: albumId,
    projectId,
    name: "Smith Wedding",
    slug: "smith-wedding",
    sortOrder: 0,
    coverAssetId: null,
    shortLabel: "Wedding",
    categories: [
      { id: "cat-ceremony", albumId, name: "Ceremony", slug: "ceremony", sortOrder: 0 },
      { id: "cat-portraits", albumId, name: "Portraits", slug: "portraits", sortOrder: 1 },
    ],
    assets: seedAssets(albumId, projectId),
    deliveryState: "ready_to_pick",
    pickLimit: 5,
  };
  album.coverAssetId = album.assets[0]?.id ?? null;

  const session: DeliverySession = {
    id: "session-demo",
    albumId,
    token: "demo-pick-link",
    createdAt: new Date().toISOString(),
  };

  const workspace: Workspace = {
    id: workspaceId,
    ownerId: "owner-demo",
    displayName: "Vega Studio",
    slug: "vega-studio",
    plan: "student",
    site: {
      workspaceId,
      slug: "vega-studio",
      productionUrl: "/s/vega-studio",
      publishedAt: new Date().toISOString(),
    },
  };

  const site: SiteBuilderConfig = {
    slug: "vega-studio",
    published: true,
    heroTitle: "Light, lingered",
    heroSubtitle: "Vega Studio",
    heroImageUrl: heroImage.src,
    aboutText:
      "Photographs that feel like memory, not performance. Based between coast and city.",
    contactEmail: "hello@vegastudio.com",
    sections: [
      {
        id: "sec-hero-gallery",
        type: "gallery",
        albumId,
        layout: "masonry",
        title: "Selected work",
        subtitle: "Portfolio",
      },
      {
        id: "sec-editorial",
        type: "editorial",
        albumId,
        startIndex: 4,
        count: 4,
      },
    ],
    publishedAt: new Date().toISOString(),
  };

  const picks: Record<string, ClientPickSubmission> = {};

  return {
    workspace,
    albums: [album],
    deliverySessions: [session],
    picks,
    site,
  };
}

export function createEmptyAlbum(name: string): Album {
  const projectId = "proj-demo";
  const id = newId();
  return {
    id,
    projectId,
    name,
    slug: slugify(name),
    sortOrder: 0,
    coverAssetId: null,
    categories: [],
    assets: [],
    deliveryState: "draft",
  };
}
