import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "jj.detailing01 | Autoaufbereitung Frauenfeld",
    short_name: "jj.detailing",
    description: "Autoaufbereitung von Hand in Frauenfeld. Termin online anfragen.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0d",
    theme_color: "#0b0b0d",
    lang: "de-CH",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
