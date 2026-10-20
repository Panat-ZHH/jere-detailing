import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Packages } from "@/components/Packages";
import { BookingSection } from "@/components/BookingSection";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <BeforeAfter />
        <Packages />
        <BookingSection />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
