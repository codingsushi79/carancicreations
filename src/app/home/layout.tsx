import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Caranci Creations — cinematic photography and videography for high-impact visual storytelling.",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
