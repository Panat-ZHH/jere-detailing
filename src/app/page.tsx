import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { CarShowcase } from "@/components/CarShowcase";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Packages } from "@/components/Packages";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { RequestSection } from "@/components/RequestSection";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { Footer } from "@/components/Footer";
import { getServices, getSettings } from "@/lib/data";

// Preise und Einstellungen kommen aus Supabase. Der Admin aktualisiert die Seite beim Speichern sofort.
export const revalidate = 3600;

export default async function Home() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    name: "jj.detailing01",
    description: "Professionelle Autoaufbereitung von Hand in Frauenfeld.",
    founder: { "@type": "Person", name: "Jeremia" },
    address: { "@type": "PostalAddress", addressLocality: "Frauenfeld", addressRegion: "TG", addressCountry: "CH" },
    areaServed: "Frauenfeld",
    sameAs: [settings.instagram],
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      name: s.name,
      priceSpecification: { "@type": "PriceSpecification", minPrice: s.priceFrom, priceCurrency: "CHF" },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main>
        <Hero />
        <Services />
        <CarShowcase />
        <BeforeAfter />
        <Packages services={services} settings={settings} />
        <Process />
        <About instagram={settings.instagram} />
        <RequestSection services={services} settings={settings} />
        <Faq />
        <CtaBand />
      </main>
      <Footer settings={settings} />
    </>
  );
}
