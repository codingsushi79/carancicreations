export const site = {
  name: "blankcreations",
  tagline:
    "Creative photo and video — replace this line with your positioning.",
  /** Placeholder — set your real address in production */
  email: "hello@example.com",
  phoneDisplay: "(555) 000-0000",
  phoneTel: "tel:+15550000000",
  address: {
    street: "123 Main Street",
    region: "ST",
    country: "US",
  },
  ogImage:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80",
} as const;

export const services = [
  {
    title: "Cinematography",
    description:
      "Professional videography and motion — describe your offering here.",
    cta: "Book a video project",
    href: "/contact",
  },
  {
    title: "Photography",
    description:
      "Portraits, events, and brand work — describe your offering here.",
    cta: "Book a photo session",
    href: "/contact",
  },
] as const;
