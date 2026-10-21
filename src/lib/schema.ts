import type { Service, Settings } from "./booking";
import type { Faq } from "./faq";
import { BUSINESS, SITE_URL } from "./seo";

// "08:00 - 18:00" -> ["08:00", "18:00"]
function parseHours(s: string): [string, string] | null {
  const m = s.match(/(\d{1,2}:\d{2})\s*[-bis]+\s*(\d{1,2}:\d{2})/);
  return m ? [m[1].padStart(5, "0"), m[2].padStart(5, "0")] : null;
}

// Schema.org-Graph für Google, Bing und KI-Suchmaschinen (GEO).
export function buildJsonLd(services: Service[], settings: Settings, faqs: Faq[]) {
  const businessId = `${SITE_URL}/#business`;
  const prices = services.map((s) => s.priceFrom);
  const weekday = parseHours(settings.hoursWeekday);
  const saturday = parseHours(settings.hoursSaturday);

  const openingHours = [
    weekday && {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: weekday[0],
      closes: weekday[1],
    },
    saturday &&
      settings.saturdaySlots.length > 0 && {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: saturday[0],
        closes: saturday[1],
      },
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AutoWash", "LocalBusiness"],
        "@id": businessId,
        name: BUSINESS.name,
        alternateName: BUSINESS.alternateName,
        slogan: BUSINESS.slogan,
        description: BUSINESS.description,
        url: SITE_URL,
        image: [`${SITE_URL}/og.jpg`, `${SITE_URL}/images/studio.png`, `${SITE_URL}/images/hero.png`],
        logo: `${SITE_URL}/icon.png`,
        founder: { "@type": "Person", name: BUSINESS.owner },
        address: {
          "@type": "PostalAddress",
          addressLocality: BUSINESS.city,
          postalCode: BUSINESS.postalCode,
          addressRegion: BUSINESS.regionCode,
          addressCountry: BUSINESS.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: BUSINESS.lat, longitude: BUSINESS.lng },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${BUSINESS.city} ${BUSINESS.region}`)}`,
        areaServed: [
          { "@type": "City", name: BUSINESS.city },
          { "@type": "AdministrativeArea", name: `Kanton ${BUSINESS.region}` },
        ],
        openingHoursSpecification: openingHours,
        ...(prices.length ? { priceRange: `CHF ${Math.min(...prices)} - ${Math.max(...prices)}`, currenciesAccepted: "CHF" } : {}),
        ...(settings.phone ? { telephone: settings.phone } : {}),
        ...(settings.email ? { email: settings.email } : {}),
        sameAs: [settings.instagram],
        knowsAbout: ["Autoaufbereitung", "Handwäsche", "Lackpolitur", "Keramikversiegelung", "Innenraumreinigung", "Felgenreinigung"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Pakete und Richtpreise",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            url: `${SITE_URL}/#pakete`,
            priceCurrency: "CHF",
            priceSpecification: { "@type": "PriceSpecification", minPrice: s.priceFrom, priceCurrency: "CHF" },
            itemOffered: {
              "@type": "Service",
              name: s.name,
              description: `${s.short} Dauer: ${s.duration.replace(/\.$/, "")}. Enthält: ${s.includes.join(", ")}.`,
              serviceType: "Autoaufbereitung",
              provider: { "@id": businessId },
              areaServed: { "@type": "City", name: BUSINESS.city },
            },
          })),
        },
        potentialAction: {
          "@type": "ReserveAction",
          name: "Termin anfragen",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/#anfrage`, inLanguage: "de-CH" },
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.name,
        inLanguage: "de-CH",
        publisher: { "@id": businessId },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "Autoaufbereitung in Frauenfeld",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": businessId },
        inLanguage: "de-CH",
        primaryImageOfPage: `${SITE_URL}/og.jpg`,
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
