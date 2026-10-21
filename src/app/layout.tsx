import type { Metadata, Viewport } from "next";
import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import { BUSINESS, SEO_DESCRIPTION, SEO_TITLE, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SEO_TITLE, template: "%s | jj.detailing01" },
  description: SEO_DESCRIPTION,
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.owner }],
  creator: BUSINESS.owner,
  category: "Autoaufbereitung",
  alternates: { canonical: "/", languages: { "de-CH": "/" } },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "/",
    siteName: BUSINESS.name,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [
      {
        // ?v= erhöhen, wenn das Bild neu erzeugt wird, damit Messenger den Cache erneuern
        url: "/og.jpg?v=2",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "jj.detailing01: Autoaufbereitung in Frauenfeld. Schwarzes Auto unter Waben-Licht, Pakete ab CHF 89.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: ["/og.jpg?v=2"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Lokale Geo-Signale (Frauenfeld, Thurgau)
  other: {
    "geo.region": `${BUSINESS.country}-${BUSINESS.regionCode}`,
    "geo.placename": BUSINESS.city,
    "geo.position": `${BUSINESS.lat};${BUSINESS.lng}`,
    ICBM: `${BUSINESS.lat}, ${BUSINESS.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de-CH" className={`${geistSans.variable} ${outfit.variable} antialiased`}>
      <body className="grain min-h-[100dvh] font-sans">{children}</body>
    </html>
  );
}
