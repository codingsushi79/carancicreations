export const site = {
  name: "Caranci Creations",
  tagline:
    "High-end cinematic photography and videography — visual storytelling with precision and heart.",
  email: "hello@carancicreations.com",
  /** From live site footer + tel: link (scraped) */
  phoneDisplay: "(401) 864-1333",
  phoneTel: "tel:+14018641333",
  /** From JSON-LD LocalBusiness on wix site */
  address: {
    street: "Kirkbrae Drive",
    region: "RI",
    country: "US",
  },
  ogImage:
    "https://static.wixstatic.com/media/888b5a_d66e397b3fa34926975bb36559b8bd7b~mv2.jpeg",
} as const;

export const services = [
  {
    title: "Cinematography",
    description:
      "Elevate your vision with professional videography. Cinematic storytelling that captures the essence of your brand or creative project with precision.",
    cta: "Book a video project",
    href: "/contact",
  },
  {
    title: "Photography",
    description:
      "Custom, one-of-a-kind photos captured with top-tier equipment. Flexible packages and pricing tailored to you.",
    cta: "Book a photo session",
    href: "/contact",
  },
] as const;
