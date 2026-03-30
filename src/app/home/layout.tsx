import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "blankcreations — photo and video for brands, events, and creative work.",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
