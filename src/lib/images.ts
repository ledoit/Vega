import type { GalleryImage } from "@/types/gallery";

/** Demo portfolio imagery — replace with CMS or local assets */
export const heroImage = {
  src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=85",
  alt: "Bride in soft window light, portrait",
  width: 2400,
  height: 3600,
  blurDataURL:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSITFBUWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzrSt7uK4uY4oY1Mk8qoHJJr//Z",
};

export const galleryImages: GalleryImage[] = [
  {
    id: "01",
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=82",
    alt: "Couple embracing in golden hour meadow",
    width: 1600,
    height: 2400,
    aspect: "portrait",
  },
  {
    id: "02",
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1800&q=82",
    alt: "Hands with wedding rings, close detail",
    width: 1800,
    height: 1200,
    aspect: "landscape",
  },
  {
    id: "03",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&q=82",
    alt: "Reception table florals and candlelight",
    width: 1400,
    height: 2100,
    aspect: "portrait",
  },
  {
    id: "04",
    src: "https://images.unsplash.com/photo-1465492759477-378a6e3c2b2b?w=1800&q=82",
    alt: "First dance, soft backlight",
    width: 1800,
    height: 1200,
    aspect: "landscape",
  },
  {
    id: "05",
    src: "https://images.unsplash.com/photo-1520854221256-174bf7fbc049?w=1400&q=82",
    alt: "Bridal portrait in natural light",
    width: 1400,
    height: 2100,
    aspect: "portrait",
  },
  {
    id: "06",
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=82",
    alt: "Ceremony aisle, minimalist venue",
    width: 1800,
    height: 1200,
    aspect: "landscape",
  },
  {
    id: "07",
    src: "https://images.unsplash.com/photo-1529634806980-85c4939a42f6?w=1400&q=82",
    alt: "Quiet moment between partners",
    width: 1400,
    height: 1750,
    aspect: "portrait",
  },
  {
    id: "08",
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1800&q=82",
    alt: "Outdoor celebration at dusk",
    width: 1800,
    height: 1200,
    aspect: "landscape",
  },
];
