import Image from "next/image";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 md:grid-cols-3">
        <div className="flex items-center gap-4">
          <Image src="/logo.webp" alt="jj.detailing01 Logo" width={64} height={64} className="size-16 rounded-full" />
          <div>
            <p className="font-display text-lg font-semibold">
              jj<span className="text-accent">.</span>detailing01
            </p>
            <p className="text-sm text-muted">{site.tagline}</p>
          </div>
        </div>

        <div className="text-[15px] text-muted">
          <p className="mb-3 text-sm font-medium text-fg">Kontakt</p>
          <ul className="grid gap-1.5">
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-fg">
                  {site.phone}
                </a>
              </li>
            )}
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-fg">
                  {site.email}
                </a>
              </li>
            )}
            {site.address && <li>{site.address}</li>}
            <li>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
                <InstagramLogo size={18} />
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div className="text-[15px] text-muted md:text-right">
          <p className="mb-3 text-sm font-medium text-fg">Rechtliches</p>
          <ul className="grid gap-1.5">
            <li>
              <a href="/impressum" className="hover:text-fg">
                Impressum
              </a>
            </li>
            <li>
              <a href="/datenschutz" className="hover:text-fg">
                Datenschutz
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-10 text-sm text-zinc-500">
        © {new Date().getFullYear()} jj.detailing01
      </p>
    </footer>
  );
}
