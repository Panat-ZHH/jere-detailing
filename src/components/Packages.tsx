"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Clock, ListChecks, ShieldCheck, Tag } from "@phosphor-icons/react";
import {
  categoryLabels,
  estimatePrice,
  vehicleSizes,
  type Category,
  type Service,
  type Settings,
  type VehicleSize,
} from "@/lib/booking";
import { SELECT_SERVICE_EVENT } from "./SelectServiceLink";

const filters: { id: Category | "alle"; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "pflege", label: categoryLabels.pflege },
  { id: "innen", label: categoryLabels.innen },
  { id: "schutz", label: categoryLabels.schutz },
];

export function Packages({ services, settings }: { services: Service[]; settings: Settings }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Category | "alle">("alle");
  const [selectedId, setSelectedId] = useState(() => (services.find((s) => s.featured) ?? services[0])?.id);
  const [size, setSize] = useState<VehicleSize>("mittel");

  const list = useMemo(
    () => (filter === "alle" ? services : services.filter((s) => s.category === filter)),
    [services, filter],
  );
  const selected = services.find((s) => s.id === selectedId) ?? list[0];
  const price = estimatePrice(selected, size, settings);

  if (services.length === 0) return null;

  const request = () => {
    window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: { service: selected.id, size } }));
    document.getElementById("anfrage")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="pakete" className="relative overflow-x-clip py-24 md:py-32">
      <div className="pointer-events-none absolute right-[8%] top-1/4 -z-10 size-[420px] rounded-full bg-accent/12 blur-[130px]" />

      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Pakete und Preise.
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Wähl ein Paket und deine Fahrzeuggrösse. Der Richtpreis passt sich direkt an.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Kategorie filtern">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.98] ${
                filter === f.id ? "bg-accent text-white" : "border border-line text-muted hover:text-fg"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Karten-Liste */}
          <ul className="grid content-start gap-4 lg:col-span-7">
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((s) => {
                const on = s.id === selected?.id;
                return (
                  <motion.li
                    key={s.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(s.id)}
                      aria-pressed={on}
                      className={`group relative grid w-full grid-cols-1 items-stretch gap-4 overflow-hidden rounded-[var(--radius-card)] border p-4 text-left transition sm:grid-cols-[1fr_200px] ${
                        on ? "border-accent/70 bg-white/[0.05]" : "border-line bg-ink-2/70 hover:border-white/20"
                      }`}
                    >
                      <div className="flex min-w-0 flex-col py-1 pl-1 pr-12 sm:pr-0">
                        <span className="text-xs font-medium text-accent">{categoryLabels[s.category]}</span>
                        <span className="mt-1 font-display text-xl font-semibold tracking-tight">{s.name}</span>
                        <span className="mt-1 line-clamp-2 text-sm text-muted">{s.short}</span>
                        <span className="mt-auto flex items-baseline gap-2 pt-4">
                          <span className="text-xs text-muted">ab</span>
                          <span className="font-display text-2xl font-semibold">CHF {s.priceFrom}</span>
                          <span className="text-xs text-muted">{s.duration}</span>
                        </span>
                      </div>
                      <div className="relative hidden h-full min-h-[140px] overflow-hidden rounded-2xl sm:block">
                        <Image src={s.image} alt="" fill sizes="200px" className="object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <span
                        className={`absolute bottom-4 right-4 grid size-11 place-items-center rounded-full transition ${
                          on ? "bg-accent text-white" : "bg-white/10 text-fg group-hover:bg-accent group-hover:text-white"
                        }`}
                      >
                        <ArrowRight size={18} weight="bold" />
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          {/* Detail-Panel */}
          {selected && (
            <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
              <div className="glass overflow-hidden rounded-[var(--radius-card)]">
                <div className="relative aspect-[16/10]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={selected.id}
                      className="absolute inset-0"
                      initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduce ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Image src={selected.image} alt="" fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{selected.name}</h3>

                  <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <Spec icon={<Clock size={20} />} label="Dauer" value={selected.duration} />
                    <Spec icon={<Tag size={20} />} label="Bereich" value={categoryLabels[selected.category]} />
                    <Spec icon={<ListChecks size={20} />} label="Schritte" value={String(selected.includes.length)} />
                  </dl>

                  <ul className="mt-5 grid gap-2 text-[15px]">
                    {selected.includes.map((i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <Check size={16} weight="bold" className="shrink-0 text-accent" />
                        {i}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 grid grid-cols-3 gap-1 rounded-full border border-line p-1" role="radiogroup" aria-label="Fahrzeuggrösse">
                    {vehicleSizes.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={size === v.id}
                        onClick={() => setSize(v.id)}
                        className={`rounded-full py-2 text-sm transition ${
                          size === v.id ? "bg-white/10 text-fg" : "text-muted hover:text-fg"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-line bg-black/20 px-6 py-4">
                  <div>
                    <p className="text-xs text-muted">Richtpreis</p>
                    <p className="font-display text-2xl font-semibold">CHF {price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={request}
                    className="rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-strong active:scale-[0.98]"
                  >
                    Anfrage senden
                  </button>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 px-2 text-xs text-muted">
                <ShieldCheck size={14} />
                Der Endpreis hängt vom Zustand ab und wird vor Arbeitsbeginn abgesprochen.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-black/20 px-2 py-3">
      <span className="grid size-9 place-items-center rounded-full bg-white/[0.06] text-fg">{icon}</span>
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}
