"use client";

import Image from "next/image";
import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// Vorher/Nachher-Vergleich. Ein unsichtbares Range-Input steuert den Schieber,
// damit er per Maus, Touch und Tastatur bedienbar ist.
export function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <section id="ergebnis" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="mb-10 max-w-xl">
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Der Unterschied liegt im Licht.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Gleiche Motorhaube, vor und nach Wäsche, Politur und Versiegelung. Zieh den Regler.
        </p>
      </div>

      <div className="relative aspect-[3/2] w-full select-none overflow-hidden rounded-[var(--radius-card)] border border-line">
        <Image
          src="/images/nachher.png"
          alt="Motorhaube nach der Aufbereitung, tiefschwarz und spiegelglatt"
          fill
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src="/images/vorher.png"
            alt="Dieselbe Motorhaube vorher, mit Wasserflecken und Kratzern"
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover"
          />
        </div>

        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-medium">Vorher</span>
        <span className="glass absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-medium">Nachher</span>

        <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80" style={{ left: `${pos}%` }}>
          <div className="glass absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white">
            <CaretLeft size={14} weight="bold" />
            <CaretRight size={14} weight="bold" />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Vorher-Nachher-Vergleich verschieben"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </section>
  );
}
