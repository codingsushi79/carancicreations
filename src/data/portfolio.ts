export type PortfolioItem = {
  title: string;
  category: "Videography" | "Photography";
  description: string;
  href?: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
};

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Featured documentary — placeholder",
    category: "Videography",
    description:
      "Replace this block with your flagship film or campaign. Use a strong one-liner on craft, client, and outcome.",
    href: undefined,
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80",
    imageAlt: "Cinematic film production still",
    featured: true,
  },
  {
    title: "Brand narrative — winter campaign",
    category: "Videography",
    description:
      "Commercial spot with natural light, slow motion, and a restrained color grade for an elevated retail launch.",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80",
    imageAlt: "Camera and lighting on a film set",
  },
  {
    title: "Editorial portrait series",
    category: "Photography",
    description:
      "Studio and location portraits with careful attention to skin tone, texture, and composition.",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80",
    imageAlt: "Portrait photography session",
  },
  {
    title: "Live event highlight reel",
    category: "Videography",
    description:
      "Multi-cam coverage, crisp audio, and a tight edit delivered within 48 hours.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80",
    imageAlt: "Event videography",
  },
];
