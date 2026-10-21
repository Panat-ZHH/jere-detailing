import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ServiceList } from "@/components/motion/ServiceList";
import { Statement } from "@/components/motion/Statement";
import { Manifesto } from "@/components/motion/Manifesto";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CarShowcase } from "@/components/CarShowcase";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Packages } from "@/components/Packages";
import { ProcessSteps } from "@/components/motion/ProcessSteps";
import { About } from "@/components/About";
import { RequestSection } from "@/components/RequestSection";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { Footer } from "@/components/Footer";
import { PolishBackground } from "@/components/PolishBackground";
import { PolisherCursor } from "@/components/PolisherCursor";
import { getServices, getSettings } from "@/lib/data";
import { buildFaqs } from "@/lib/faq";
import { buildJsonLd } from "@/lib/schema";

// Preise und Einstellungen kommen aus Supabase. Der Admin aktualisiert die Seite beim Speichern sofort.
export const revalidate = 3600;

export default async function Home() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  const faqs = buildFaqs(services, settings);
  const jsonLd = buildJsonLd(services, settings, faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SmoothScroll />
      <PolishBackground />
      <PolisherCursor />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <ServiceList />
        <CarShowcase />
        <Manifesto />
        <BeforeAfter />
        <Packages services={services} settings={settings} />
        <ProcessSteps />
        <About instagram={settings.instagram} />
        <RequestSection services={services} settings={settings} />
        <Faq faqs={faqs} />
        <CtaBand />
      </main>
      <Footer settings={settings} />
    </>
  );
}
