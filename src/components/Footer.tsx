import Image from "next/image";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import type { Settings } from "@/lib/booking";

export function Footer({ settings }: { settings: Settings }) {
  const handle = "@" + settings.instagram.replace(/\/$/, "").split("/").pop();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 md:grid-cols-3">
        <div className="flex items-center gap-4">
          <Image src="/logo.webp" alt="jj.detailing01 Logo" width={64} height={64} className="size-16 rounded-full" />
          <div>
            <p className="font-display text-lg font-semibold">
              jj<span className="text-accent">.</span>detailing01
            </p>
            <p className="text-sm text-muted">Autoaufbereitung in Frauenfeld</p>
          </div>
        </div>

        <div className="text-[15px] text-muted">
          <p className="mb-3 text-sm font-medium text-fg">Kontakt</p>
          <ul className="grid">
            <li>Jeremia</li>
            <li>{settings.address}</li>
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-fg">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-fg">
                  {settings.email}
                </a>
              </li>
            )}
            <li>
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-fg">
                <InstagramLogo size={18} />
                {handle}
              </a>
            </li>
          </ul>
        </div>

        <div className="text-[15px] text-muted md:text-right">
          <p className="mb-3 text-sm font-medium text-fg">Rechtliches</p>
          <ul className="grid">
            <li>
              <a href="/impressum" className="inline-flex min-h-10 items-center hover:text-fg">
                Impressum
              </a>
            </li>
            <li>
              <a href="/datenschutz" className="inline-flex min-h-10 items-center hover:text-fg">
                Datenschutz
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Riesige Wortmarke als Abschluss */}
      <p
        aria-hidden
        className="select-none overflow-x-clip whitespace-nowrap pb-[0.06em] text-center font-display text-[20vw] font-bold leading-[1.05] tracking-tighter text-white/[0.05]"
      >
        jj.detailing
      </p>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 pb-10 pt-8 text-xs text-zinc-500 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} jj.detailing01, Frauenfeld</p>
        <p>
          3D-Modell: „Car Concept“, Khronos Group, nach einem Modell von Unity Fan,{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" className="underline underline-offset-2" target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>
          , Lack eingefärbt
        </p>
      </div>
    </footer>
  );
}
