"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { EdgeTool } from "./EdgeTool";

const items = [
  { title: "Handwäsche", text: "Snow-Foam, zwei Eimer, weiche Handschuhe.", image: "/images/schaum.png", tag: "Aussen" },
  { title: "Politur", text: "Swirls und Kratzer auspolieren, nicht überdecken.", image: "/images/politur.png", tag: "Lack" },
  { title: "Keramik", text: "Harte Schutzschicht, Wasser perlt ab.", image: "/images/keramik-auftrag.png", tag: "Schutz" },
  { title: "Innenraum", text: "Dampf für Lüftungen, Ritzen und Polster.", image: "/images/dampf.png", tag: "Innen" },
  { title: "Felgen", text: "Bremsstaub und Flugrost lösen, versiegeln.", image: "/images/felgen.png", tag: "Räder" },
  { title: "Motorraum", text: "Schonend gereinigt, ohne Hochdruck.", image: "/images/motorraum.png", tag: "Technik" },
];

// Grosse Typo-Liste. Auf Desktop schwebt das passende Foto neben dem Mauszeiger.
export function ServiceList() {
  const root = useRef<HTMLElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".sl-row", {
          yPercent: 60,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".sl-list", start: "top 80%" },
        });
        gsap.from(".sl-line", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".sl-list", start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  // Folgt dem Zeiger mit etwas Verzögerung, dreht sich leicht je nach Bewegungsrichtung
  const move = (e: React.PointerEvent) => {
    const el = follower.current;
    if (!el || e.pointerType !== "mouse") return;
    const box = root.current!.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const dx = e.movementX ?? 0;
    gsap.to(el, { x, y, rotation: gsap.utils.clamp(-8, 8, dx * 0.6), duration: 0.6, ease: "power3.out", overwrite: "auto" });
  };

  return (
    <section ref={root} id="leistungen" className="relative overflow-x-clip" onPointerMove={move}>
      <EdgeTool src="/images/tools/spray.webp" side="right" top="6%" width={300} rotate={-14} />
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
        Was Jeremia an deinem Auto macht.
      </h2>
      <p className="mt-4 max-w-md text-lg text-muted">Alles von Hand, nichts aus der Waschstrasse.</p>

      <ul className="sl-list mt-14" onPointerLeave={() => setActive(null)}>
        {items.map((it, i) => (
          <li key={it.title} className="relative overflow-hidden">
            <span className="sl-line absolute inset-x-0 top-0 h-px bg-line" />
            <a
              href="#pakete"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="sl-row group grid grid-cols-[1fr_auto] items-center gap-4 py-6 md:py-8 lg:grid-cols-[1fr_1fr_auto]"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-display text-4xl font-semibold tracking-tight transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-accent md:text-6xl lg:text-7xl">
                  {it.title}
                </span>
              </span>
              <span className="hidden text-muted lg:block">{it.text}</span>
              <span className="flex items-center gap-3">
                <span className="hidden rounded-full border border-line px-3 py-1 text-xs text-muted sm:inline">{it.tag}</span>
                <span className="grid size-11 place-items-center rounded-full border border-line transition duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent">
                  <ArrowUpRight size={18} />
                </span>
              </span>
              {/* Mobil: Foto inline als schmaler Streifen */}
              <span className="relative col-span-2 h-28 overflow-hidden rounded-2xl md:hidden">
                <Image src={it.image} alt="" fill sizes="100vw" className="object-cover" />
              </span>
            </a>
          </li>
        ))}
        <li aria-hidden className="h-px bg-line" />
      </ul>
      </div>

      {/* Schwebendes Foto (nur Desktop mit Maus) */}
      <div
        ref={follower}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
        style={{ transform: "translate(-9999px, -9999px)" }}
      >
        <div
          className={`relative -ml-36 -mt-48 h-[240px] w-[190px] overflow-hidden rounded-[120px_120px_20px_20px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] transition-[opacity,scale] duration-500 ${
            active === null ? "scale-75 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          {items.map((it, i) => (
            <Image
              key={it.image}
              src={it.image}
              alt=""
              fill
              sizes="190px"
              className={`object-cover transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
