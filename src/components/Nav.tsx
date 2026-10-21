"use client";

import Image from "next/image";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";

const links = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#showroom", label: "3D-Ansicht" },
  { href: "#pakete", label: "Preise" },
  { href: "#ueber", label: "Über Jeremia" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav className="glass mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full pl-2 pr-2 md:pl-3">
        <a href="#top" className="flex items-center gap-3" aria-label="jj.detailing01 Startseite">
          <Image
            src="/logo.webp"
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
            priority
          />
          <span className="font-display text-[17px] font-semibold tracking-tight">
            jj<span className="text-accent">.</span>detailing
          </span>
        </a>

        <ul className="hidden items-center gap-7 text-sm text-muted lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-fg">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#anfrage"
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-strong active:scale-[0.98] sm:inline-block"
          >
            Anfrage senden
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full text-fg lg:hidden"
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-[var(--radius-card)] p-2 lg:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-fg hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="p-2">
              <a
                href="#anfrage"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-accent px-5 py-3 text-center font-medium text-white"
              >
                Anfrage senden
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
