import { RequestForm } from "./RequestForm";
import { Reveal } from "./Reveal";
import type { Service, Settings } from "@/lib/booking";
import { EdgeTool } from "./motion/EdgeTool";

export function RequestSection({ services, settings }: { services: Service[]; settings: Settings }) {
  return (
    <section id="anfrage" className="relative overflow-x-clip py-24 md:py-32">
      <EdgeTool src="/images/tools/brush.webp" side="left" top="30%" width={240} rotate={-22} />
      <div className="pointer-events-none absolute right-[5%] top-24 -z-10 size-[480px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Anfrage senden.
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Wähl Paket und Wunschtermin. Jeremia schaut sich die Anfrage an und meldet sich persönlich bei dir.
          </p>

          <div className="mt-10 border-t border-line pt-8">
            <p className="text-sm font-medium">Öffnungszeiten</p>
            <dl className="mt-3 grid gap-1.5 text-[15px] text-muted">
              <div className="flex justify-between gap-6">
                <dt>Montag bis Freitag</dt>
                <dd className="tabular-nums">{settings.hoursWeekday}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt>Samstag</dt>
                <dd className="tabular-nums">{settings.hoursSaturday}</dd>
              </div>
            </dl>
            <p className="mt-6 text-sm font-medium">Standort</p>
            <p className="mt-2 text-[15px] text-muted">{settings.address}</p>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={0.1}>
          <RequestForm services={services} settings={settings} />
        </Reveal>
      </div>
    </section>
  );
}
