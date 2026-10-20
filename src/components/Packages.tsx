import { Check, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { services } from "@/lib/booking";
import { Reveal } from "./Reveal";
import { SelectServiceLink } from "./SelectServiceLink";

const chf = (n: number) => `CHF ${n}`;

export function Packages() {
  const featured = services.find((s) => s.id === "komplett")!;
  const others = services.filter((s) => s.id !== "komplett");

  return (
    <section id="pakete" className="relative overflow-x-clip py-24 md:py-32">
      {/* Leichter roter Schimmer hinter dem Hauptpaket, damit das Glas etwas zum Brechen hat */}
      <div className="pointer-events-none absolute left-[10%] top-1/3 -z-10 size-[420px] rounded-full bg-accent/15 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Klare Pakete, faire Preise.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Richtpreise für Kleinwagen. Der genaue Preis hängt von Grösse und Zustand ab.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <article className="glass flex h-full flex-col rounded-[var(--radius-card)] p-7 md:p-9">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-accent">Am häufigsten gebucht</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{featured.name}</h3>
                </div>
                <p className="shrink-0 sm:text-right">
                  <span className="block text-sm text-muted">ab</span>
                  <span className="font-display text-3xl font-semibold">{chf(featured.priceFrom)}</span>
                </p>
              </div>
              <p className="mt-4 text-muted">{featured.short}</p>
              <ul className="mt-8 grid gap-3">
                {featured.includes.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check size={18} weight="bold" className="shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
                <span className="text-sm text-muted">{featured.duration}</span>
                <SelectServiceLink
                  service={featured.id}
                  className="rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-strong active:scale-[0.98]"
                >
                  Dieses Paket wählen
                </SelectServiceLink>
              </div>
            </article>
          </Reveal>

          <div className="grid gap-4 lg:col-span-6">
            {others.map((s, i) => (
              <Reveal key={s.id} delay={0.08 * (i + 1)}>
                <SelectServiceLink
                  service={s.id}
                  className="group flex items-center gap-6 rounded-[var(--radius-card)] border border-line bg-ink-2/60 p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl font-semibold tracking-tight">{s.name}</h3>
                    <p className="mt-1 text-[15px] text-muted">{s.short}</p>
                    <p className="mt-3 text-sm text-muted">{s.duration}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-xs text-muted">ab</span>
                    <span className="font-display text-2xl font-semibold">{chf(s.priceFrom)}</span>
                  </div>
                  <ArrowRight
                    size={20}
                    className="hidden shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-fg sm:block"
                  />
                </SelectServiceLink>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
