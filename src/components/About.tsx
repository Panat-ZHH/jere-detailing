import Image from "next/image";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

export function About({ instagram }: { instagram: string }) {
  return (
    <section id="ueber" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <Reveal className="relative lg:col-span-7">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] border border-line">
            <Image
              src="/images/werkzeug.png"
              alt="Poliermaschine, Pads, Mikrofasertücher und Pinsel auf einer dunklen Matte"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-10 right-4 hidden aspect-[16/10] w-[46%] overflow-hidden rounded-[var(--radius-card)] border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] md:block">
            <Image
              src="/images/thurgau.png"
              alt="Schwarzes Auto auf einer Landstrasse zwischen Obstbäumen im Thurgau"
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Jeremia, jj.detailing01.
          </h2>
          <div className="mt-6 grid gap-4 text-lg leading-relaxed text-muted">
            <p>
              Hinter jj.detailing01 steht Jeremia aus Frauenfeld. Er arbeitet selbst am Auto, von der ersten Wäsche bis
              zur Übergabe.
            </p>
            <p>
              Lieber ein Auto pro Tag richtig als drei halb. Darum gibt es Termine nur auf Anfrage.
            </p>
          </div>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition hover:bg-white/5"
          >
            <InstagramLogo size={18} />
            Arbeiten auf Instagram
          </a>
        </Reveal>
      </div>
    </section>
  );
}
