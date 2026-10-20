import type { Metadata, Viewport } from "next";
import { Geist, Outfit } from "next/font/google";
import "./globals.css";

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
  title: "jj.detailing01 | Professionelle Fahrzeugaufbereitung",
  description:
    "Handwäsche, Innenraumpflege, Politur und Keramikversiegelung. Termin online buchen bei jj.detailing01.",
  openGraph: {
    title: "jj.detailing01 | Professional Auto Care",
    description: "Fahrzeugaufbereitung mit Handarbeit. Termin online buchen.",
    images: ["/images/hero.png"],
    locale: "de_CH",
    type: "website",
  },
  icons: { icon: "/logo.webp" },
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
