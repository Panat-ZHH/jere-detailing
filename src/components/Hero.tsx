import Image from "next/image";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100dvh] items-end overflow-hidden md:items-center">
      {/* Foto rechtsbündig, links bleibt dunkler Raum für den Text */}
      <div className="absolute inset-y-0 right-0 -z-20 w-full md:w-[72%]">
        <Image
          src="/images/hero.png"
          alt="Schwarzes Auto mit frisch poliertem Lack in einer dunklen Werkstatt"
          fill
          priority
          sizes="(min-width: 768px) 72vw, 100vw"
          className="object-cover object-[65%_center]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10 md:bg-gradient-to-r md:from-ink md:from-[28%] md:via-ink/40 md:via-[48%] md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-32 md:pb-0 md:pt-24">
        <Reveal className="max-w-md">
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            Dein Auto.
            <br />
            <span className="text-muted sm:whitespace-nowrap">Wie am ersten Tag.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Handwäsche, Politur und Keramikversiegelung von Hand gemacht. Termin online wählen, Auto glänzend
            zurückbekommen.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#termin"
              className="rounded-full bg-accent px-7 py-3.5 font-medium text-white transition hover:bg-accent-strong active:scale-[0.98]"
            >
              Termin buchen
            </a>
            <a
              href="#pakete"
              className="glass rounded-full px-7 py-3.5 font-medium text-fg transition hover:bg-white/10 active:scale-[0.98]"
            >
              Preise ansehen
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
