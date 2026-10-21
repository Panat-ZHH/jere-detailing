"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

// Vorher/Nachher über die volle Breite. Auf Desktop wird die Sektion beim Scrollen kurz fixiert
// und die Politur "fährt" über den Lack. Danach (und auf Mobil) lässt sich der Regler frei ziehen.
// Die Position läuft über Refs und Inline-Styles, nicht über React-State.
export function BeforeAfter() {
  const root = useRef<HTMLElement>(null);
  const before = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const apply = useCallback((pos: number) => {
    if (before.current) before.current.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    if (handle.current) handle.current.style.left = `${pos}%`;
    if (input.current) input.current.value = String(Math.round(pos));
  }, []);

  useGSAP(
    () => {
      apply(50);
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const state = { pos: 96 };
        apply(state.pos);
        gsap.to(state, {
          pos: 12,
          ease: "none",
          onUpdate: () => apply(state.pos),
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 0.8,
          },
        });
        gsap.from(".ba-label", {
          yPercent: 100,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="ergebnis" className="relative flex min-h-[100dvh] flex-col justify-center py-16">
      <div className="mx-auto mb-8 flex w-full max-w-6xl items-end justify-between gap-6 px-5">
        <h2 className="max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Der Unterschied liegt im Licht.
        </h2>
        <p className="hidden shrink-0 whitespace-nowrap text-sm text-muted md:block">Scrollen oder Regler ziehen</p>
      </div>

      <div className="relative mx-3 h-[62vh] min-h-[340px] select-none overflow-hidden rounded-[28px] md:mx-6">
        <Image
          src="/images/nachher.png"
          alt="Motorhaube nach der Aufbereitung, tiefschwarz und spiegelglatt"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div ref={before} className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
          <Image
            src="/images/vorher.png"
            alt="Dieselbe Motorhaube vorher, mit Wasserflecken und Kratzern"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Grosse Beschriftungen in den Ecken */}
        <div className="pointer-events-none absolute bottom-3 left-5 overflow-hidden px-1 py-[0.15em] md:bottom-5 md:left-8">
          <p className="ba-label font-display text-4xl font-semibold leading-[1.25] tracking-tight text-white/90 md:text-7xl">Vorher</p>
        </div>
        <div className="pointer-events-none absolute bottom-3 right-5 overflow-hidden px-1 py-[0.15em] md:bottom-5 md:right-8">
          <p className="ba-label font-display text-4xl font-semibold leading-[1.25] tracking-tight text-accent md:text-7xl">Nachher</p>
        </div>

        <div ref={handle} className="pointer-events-none absolute inset-y-0 w-px bg-white/90" style={{ left: "50%" }}>
          <div className="glass absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white">
            <CaretLeft size={14} weight="bold" />
            <CaretRight size={14} weight="bold" />
          </div>
        </div>

        <input
          ref={input}
          type="range"
          min={0}
          max={100}
          defaultValue={50}
          onChange={(e) => apply(Number(e.target.value))}
          aria-label="Vorher-Nachher-Vergleich verschieben"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </section>
  );
}
