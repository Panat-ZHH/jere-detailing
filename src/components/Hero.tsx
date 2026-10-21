"use client";

import Image from "next/image";
import { useRef } from "react";
import { CalendarCheck, HandSoap, MapPin, Tag } from "@phosphor-icons/react";
import { DESKTOP, MOTION_OK, SplitText, gsap, useGSAP } from "@/lib/gsap";

const facts = [
  { icon: HandSoap, title: "Nur von Hand" },
  { icon: CalendarCheck, title: "Termin auf Anfrage" },
  { icon: Tag, title: "Richtpreise online" },
  { icon: MapPin, title: "Frauenfeld TG" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Headline: Buchstaben steigen aus einer Maske auf
        const split = SplitText.create(".hero-title", { type: "lines,chars", mask: "lines", linesClass: "split-line" });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(split.chars, { yPercent: 110, duration: 1.1, stagger: 0.022 })
          .from(".hero-fade", { opacity: 0, y: 24, duration: 0.9, stagger: 0.08 }, "-=0.7")
          .from(".hero-photo-intro", { scale: 1.08, opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
          .from(".hero-word", { opacity: 0, duration: 1.8, ease: "power1.out" }, 0.2);

        // Beim Scrollen: Schriftzug wandert seitlich, Foto zoomt leicht heran
        gsap.to(".hero-word", {
          xPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        // Eigene Ebene fürs Scrollen, damit sich Lade- und Scroll-Animation nicht ins Gehege kommen
        gsap.fromTo(
          ".hero-photo-scroll",
          { scale: 1, yPercent: 0 },
          {
            scale: 1.1,
            yPercent: 6,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          },
        );
        return () => split.revert();
      });
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        gsap.to(".hero-copy", {
          yPercent: -25,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative isolate overflow-x-clip">
      <div className="relative flex min-h-[100dvh] items-end md:items-center">
        {/* Riesiger Schriftzug, wandert beim Scrollen */}
        <p
          aria-hidden
          className="hero-word pointer-events-none absolute left-0 top-[12%] -z-[5] select-none whitespace-nowrap bg-gradient-to-b from-white/[0.13] to-white/0 bg-clip-text pl-[4vw] font-display text-[19vw] font-bold leading-none tracking-tighter text-transparent md:top-[8%]"
        >
          DETAILING FRAUENFELD
        </p>

        {/* Foto blendet per Maske weich in den Seitenhintergrund aus */}
        <div className="hero-photo absolute inset-y-0 right-0 -z-20 w-full overflow-hidden md:w-[74%]">
          <div className="hero-photo-scroll absolute inset-0 will-change-transform">
            <div className="hero-photo-intro absolute inset-0">
              <Image
                src="/images/hero.png"
                alt="Schwarzes Auto mit frisch poliertem Lack in einer dunklen Werkstatt"
                fill
                priority
                sizes="(min-width: 768px) 74vw, 100vw"
                className="object-cover object-[65%_center]"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent md:hidden" />
        </div>

        <div className="hero-copy mx-auto w-full max-w-6xl px-5 pb-32 pt-32 md:pb-20 md:pt-24">
          <div className="max-w-xl">
            <p className="hero-fade inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-muted backdrop-blur">
              <MapPin size={14} weight="fill" className="text-accent" />
              Frauenfeld, Thurgau
            </p>
            <h1 className="hero-title mt-6 pb-1 font-display text-[2.7rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Autoaufbereitung <span className="block text-muted">in Frauenfeld.</span>
            </h1>
            <p className="hero-fade mt-6 max-w-md text-lg leading-relaxed text-muted">
              Jeremia pflegt dein Auto von Hand. Wäsche, Politur und Keramik, mit Zeit für jedes Detail.
            </p>
            <div className="hero-fade mt-9 flex flex-wrap gap-3">
              <a
                href="#anfrage"
                className="rounded-full bg-accent px-7 py-3.5 font-medium text-white transition hover:bg-accent-strong active:scale-[0.98]"
              >
                Anfrage senden
              </a>
              <a
                href="#pakete"
                className="glass rounded-full px-7 py-3.5 font-medium text-fg transition hover:bg-white/10 active:scale-[0.98]"
              >
                Preise ansehen
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Schlanke Fakten-Zeile statt Karte, nur durch Linien getrennt */}
      <ul className="hero-fade mx-auto grid max-w-6xl grid-cols-2 border-y border-line px-5 md:grid-cols-4">
        {facts.map((f, i) => (
          <li
            key={f.title}
            className={`flex items-center gap-3 py-5 text-sm ${i % 2 === 1 ? "pl-4 md:pl-6" : ""} ${
              i > 0 ? "md:border-l md:border-line md:pl-6" : ""
            }`}
          >
            <f.icon size={18} className="shrink-0 text-accent" />
            {f.title}
          </li>
        ))}
      </ul>
    </section>
  );
}
