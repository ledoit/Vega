export type GalleryLayout = "masonry" | "horizontal";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  aspect?: "portrait" | "landscape" | "square";
  blurDataURL?: string;
};

export type GalleryProps = {
  images: GalleryImage[];
  layout?: GalleryLayout;
  className?: string;
  /** Section heading, optional */
  title?: string;
  subtitle?: string;
};
