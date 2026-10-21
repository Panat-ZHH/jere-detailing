"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

const rowA = "Handwäsche  Politur  Keramik  Innenraum  Felgen  ";
const rowB = "Frauenfeld  Thurgau  jj.detailing01  Von Hand  ";

// Zwei riesige Textzeilen laufen beim Scrollen gegeneinander, in der Mitte ein Foto in Bogenform.
// Darüber zeichnet sich eine rote Polierspirale (wie die Bahnen einer Poliermaschine).
export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
        gsap.fromTo(".st-row-a", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: st });
        gsap.fromTo(".st-row-b", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: st });
        gsap.fromTo(
          ".st-arch",
          { clipPath: "inset(30% 20% 30% 20% round 999px 999px 24px 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 999px 999px 24px 24px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "center center", scrub: true },
          },
        );
        gsap.fromTo(
          ".st-swirl",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 40%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Leistungen im Überblick" className="relative overflow-x-clip py-20 md:py-32">
      <div className="pointer-events-none select-none" aria-hidden>
        <p className="st-row-a whitespace-nowrap font-display text-[16vw] font-semibold leading-[0.95] tracking-tighter text-white/90 md:text-[11vw]">
          {rowA.repeat(3)}
        </p>
        <p className="st-row-b whitespace-nowrap font-display text-[16vw] font-semibold leading-[0.95] tracking-tighter text-accent md:text-[11vw]">
          {rowB.repeat(3)}
        </p>
      </div>

      {/* Bogen-Foto liegt mittig über den Zeilen */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative aspect-[3/4] w-[58vw] max-w-[360px] md:w-[26vw]">
          <div className="st-arch absolute inset-0 overflow-hidden [clip-path:inset(0_round_999px_999px_24px_24px)]">
            <Image src="/images/nachher.png" alt="Frisch polierte, spiegelnde Motorhaube" fill sizes="360px" className="object-cover" />
          </div>
          <svg viewBox="0 0 400 400" className="pointer-events-none absolute -inset-[18%] h-[136%] w-[136%] overflow-visible" aria-hidden>
            <path
              className="st-swirl"
              d="M200 210c22 0 30-24 12-36-26-17-62 6-56 40 7 42 66 54 98 22 38-38 14-106-40-114-70-10-118 54-98 116 22 68 116 88 168 38 58-56 40-160-34-194-82-38-178 16-188 106"
              fill="none"
              stroke="#e0353b"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
