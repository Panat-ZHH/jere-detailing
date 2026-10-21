// Zentrale SEO-/GEO-Angaben. Die Domain kommt aus NEXT_PUBLIC_SITE_URL,
// auf Vercel ersatzweise aus der Produktions-Domain des Projekts.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3031")
).replace(/\/$/, "");

export const BUSINESS = {
  name: "jj.detailing01",
  alternateName: ["JJ Detailing", "jj detailing Frauenfeld"],
  owner: "Jeremia",
  slogan: "Professional Auto Care",
  description:
    "Autoaufbereitung von Hand in Frauenfeld (Thurgau): Handwäsche, Innenraumpflege, Politur und Keramikversiegelung. Termine auf Anfrage, persönlich bestätigt von Jeremia.",
  city: "Frauenfeld",
  postalCode: "8500",
  region: "Thurgau",
  regionCode: "TG",
  country: "CH",
  // Stadtzentrum Frauenfeld (keine genaue Adresse veröffentlicht)
  lat: 47.5536,
  lng: 8.8987,
};

export const SEO_TITLE = "Autoaufbereitung in Frauenfeld | jj.detailing01";
export const SEO_DESCRIPTION =
  "Autoaufbereitung von Hand in Frauenfeld TG: Handwäsche, Innenraum, Politur und Keramikversiegelung. Richtpreise online, Termin auf Anfrage bei Jeremia.";
