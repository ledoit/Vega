/**
 * Vega domain — albums power portfolio builder and delivery mode.
 */

export type UploadSource = "local" | "google_drive" | "dropbox";

/** Lifecycle of a deliverable album (client-facing link follows this state) */
export type AlbumDeliveryState =
  | "draft"
  | "ready_to_pick"
  | "picked"
  | "finalized";

export type AssetSelectionState = "none" | "picked" | "rejected";

export type MediaAsset = {
  id: string;
  projectId: string;
  albumId: string;
  categoryId: string | null;
  filename: string;
  previewUrl: string;
  originalUrl?: string;
  /** Full-res retouched final — shown when album is `finalized` */
  finalUrl?: string;
  width: number;
  height: number;
  alt: string;
  sortOrder: number;
  /** Photographer can hide from client grid without deleting */
  visibleToClient: boolean;
  /** Show on published portfolio site */
  visibleOnSite: boolean;
  capturedAt?: string;
  selectionState?: AssetSelectionState;
  clientPickNumber?: number;
  /** Client retouch note on submit */
  clientNote?: string;
};

export type Category = {
  id: string;
  albumId: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export type Album = {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  sortOrder: number;
  coverAssetId: string | null;
  shortLabel?: string;
  categories: Category[];
  assets: MediaAsset[];
  deliveryState: AlbumDeliveryState;
  /** Max images client may pick (undefined = no limit) */
  pickLimit?: number;
};

/** Shareable client session — one link for pick + download */
export type DeliverySession = {
  id: string;
  albumId: string;
  token: string;
  pin?: string;
  expiresAt?: string;
  clientEmail?: string;
  submittedAt?: string;
  finalizedAt?: string;
  createdAt: string;
};

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  clientName?: string;
  eventDate?: string;
  albums: Album[];
  createdAt: string;
  updatedAt: string;
};

/** Where the built portfolio is served */
export type PublishedSite = {
  workspaceId: string;
  slug: string;
  customDomain?: string;
  /** Vercel deployment URL after publish */
  productionUrl?: string;
  publishedAt?: string;
};

export type Workspace = {
  id: string;
  ownerId: string;
  displayName: string;
  slug: string;
  plan: "student" | "pro";
  site: PublishedSite | null;
};

/** Client submission payload */
export type ClientPickSubmission = {
  deliverySessionId: string;
  picks: Array<{
    assetId: string;
    pickNumber?: number;
    note?: string;
  }>;
  submittedAt: string;
};
