"use client";

import Image from "next/image";
import { useRef } from "react";
import { InstagramLogo } from "@phosphor-icons/react";
import { MOTION_OK, SplitText, gsap, useGSAP } from "@/lib/gsap";

export function About({ instagram }: { instagram: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Bogenfoto öffnet sich von unten, Bild darin wandert langsamer (Parallax)
        gsap.fromTo(
          ".ab-arch",
          { clipPath: "inset(100% 0% 0% 0% round 999px 999px 28px 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 999px 999px 28px 28px)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".ab-arch", start: "top 80%" },
          },
        );
        gsap.fromTo(".ab-arch-img", { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(".ab-circle", { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });

        const split = SplitText.create(".ab-copy", { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.from(split.lines, {
          yPercent: 100,
          duration: 1,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".ab-copy", start: "top 80%" },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="ueber" className="mx-auto max-w-6xl overflow-x-clip px-5 py-24 md:py-36">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="relative mx-auto w-full max-w-[440px] lg:col-span-5">
          <div className="ab-arch relative aspect-[3/4] overflow-hidden [clip-path:inset(0_round_999px_999px_28px_28px)]">
            <div className="ab-arch-img absolute -inset-y-[12%] inset-x-0">
              <Image
                src="/images/werkzeug.png"
                alt="Poliermaschine, Pads, Mikrofasertücher und Pinsel auf einer dunklen Matte"
                fill
                sizes="440px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="ab-circle absolute -bottom-10 right-0 size-36 sm:-right-6 sm:size-40 overflow-hidden rounded-full border-4 border-ink md:-right-16 md:size-52">
            <Image
              src="/images/thurgau.png"
              alt="Schwarzes Auto auf einer Landstrasse zwischen Obstbäumen im Thurgau"
              fill
              sizes="210px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Jeremia.
            <br />
            <span className="text-muted">Frauenfeld.</span>
          </h2>
          <div className="ab-copy mt-8 grid gap-4 text-lg leading-relaxed text-muted">
            <p>
              Hinter jj.detailing01 steht Jeremia aus Frauenfeld. Er arbeitet selbst am Auto, von der ersten Wäsche bis
              zur Übergabe.
            </p>
            <p>Lieber ein Auto pro Tag richtig als drei halb. Darum gibt es Termine nur auf Anfrage.</p>
          </div>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition hover:border-accent hover:bg-accent/10"
          >
            <InstagramLogo size={18} />
            Arbeiten auf Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
