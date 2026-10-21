import Image from "next/image";
import { Reveal } from "./Reveal";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[var(--radius-card)] border border-line">
          <Image
            src="/images/ruecklicht.png"
            alt=""
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="-z-20 object-cover object-right"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
          <div className="max-w-lg px-7 py-16 md:px-12 md:py-20">
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Bereit für den Unterschied?
            </h2>
            <p className="mt-3 text-muted">Anfrage dauert zwei Minuten. Jeremia meldet sich persönlich.</p>
            <a
              href="#anfrage"
              className="mt-8 inline-block rounded-full bg-accent px-7 py-3.5 font-medium text-white transition hover:bg-accent-strong active:scale-[0.98]"
            >
              Anfrage senden
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
