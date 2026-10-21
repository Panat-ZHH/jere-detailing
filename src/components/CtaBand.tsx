"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { Magnetic } from "./motion/Magnetic";

// Vollbreites Rücklicht-Foto, das sich beim Scrollen von einem schmalen Fenster auf volle Breite öffnet.
export function CtaBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".cta-frame",
          { clipPath: "inset(12% 18% 12% 18% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "center center", scrub: true },
          },
        );
        gsap.fromTo(".cta-img", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="py-16">
      <div className="cta-frame relative isolate flex min-h-[80vh] items-center overflow-hidden">
        <div className="cta-img absolute inset-0 -z-20">
          <Image src="/images/ruecklicht.png" alt="" fill sizes="100vw" className="object-cover object-right" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        <div className="mx-auto w-full max-w-6xl px-5">
          <h2 className="max-w-2xl font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-8xl">
            Bereit für den Unterschied?
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted">Anfrage dauert zwei Minuten. Jeremia meldet sich persönlich.</p>
          <div className="mt-10">
            <Magnetic>
              <a
                href="#anfrage"
                className="grid size-40 place-items-center rounded-full bg-accent text-center font-medium text-white transition-colors hover:bg-accent-strong md:size-48 md:text-lg"
              >
                Anfrage senden
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
