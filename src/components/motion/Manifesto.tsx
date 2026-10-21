"use client";

import { useRef } from "react";
import { MOTION_OK, SplitText, gsap, useGSAP } from "@/lib/gsap";
import { EdgeTool } from "./EdgeTool";

// Grosser Statement-Text: Wörter leuchten beim Scrollen nacheinander auf.
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".mf-text", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 55%", scrub: true },
          },
        );
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-x-clip">
      <EdgeTool src="/images/tools/towel.webp" side="left" top="10%" width={340} rotate={12} speed={0.8} />
      <div className="mx-auto max-w-6xl px-5 py-28 md:py-40">
      <p className="mf-text relative z-10 font-display text-[2rem] font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.6rem]">
        Kein Durchlauf, kein Zeitdruck. <span className="text-accent">Ein Auto pro Tag</span>, von Hand gewaschen,
        poliert und versiegelt. So, wie Jeremia es an seinem <span className="italic">eigenen</span> Auto machen würde.
      </p>
      </div>
    </section>
  );
}
