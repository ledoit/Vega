export type SiteSection =
  | {
      id: string;
      type: "gallery";
      albumId: string;
      layout: "masonry" | "horizontal";
      title?: string;
      subtitle?: string;
    }
  | { id: string; type: "editorial"; albumId: string; startIndex?: number; count?: number };

export type SiteBuilderConfig = {
  slug: string;
  published: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutText: string;
  contactEmail: string;
  sections: SiteSection[];
  publishedAt?: string;
};
