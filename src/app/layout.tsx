import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.carancicreations.com"),
  title: {
    default: "Caranci Creations | Cinematic Photo & Video",
    template: "%s | Caranci Creations",
  },
  description:
    "High-end cinematic photography and videography studio — storytelling with precision. Book photo and video work.",
  openGraph: {
    title: "Caranci Creations",
    description:
      "Cinematic photography and videography for brands, events, and creative projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <Nav />
          <div className="flex flex-1 flex-col pt-16">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
