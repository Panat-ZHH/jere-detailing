"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { CaretDown, Plus } from "@phosphor-icons/react";
import { categoryLabels, type Service } from "@/lib/booking";
import { saveService, type ActionState } from "@/app/admin/actions";
import { adminInput, adminLabel } from "./styles";

const images = [
  "studio", "hero", "schaum", "schaum-front", "politur", "innenraum", "dampf", "keramik", "keramik-auftrag",
  "felgen", "scheinwerfer", "motorraum", "lackmessung", "nachher", "werkzeug", "thurgau", "ruecklicht",
].map((n) => `/images/${n}.png`);

const empty: Service = {
  id: "",
  name: "",
  short: "",
  priceFrom: 0,
  duration: "",
  category: "pflege",
  includes: [],
  image: "/images/studio.png",
  featured: false,
  active: true,
  sort: 10,
};

export function ServicesPanel({ services }: { services: Service[] }) {
  const [adding, setAdding] = useState(false);
  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">
        Änderungen sind nach dem Speichern sofort auf der Website sichtbar. Inaktive Pakete werden ausgeblendet.
      </p>
      {services.map((s) => (
        <ServiceEditor key={s.id} service={s} />
      ))}
      {adding ? (
        <ServiceEditor service={empty} isNew onDone={() => setAdding(false)} />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-line py-5 text-muted transition hover:border-white/25 hover:text-fg"
        >
          <Plus size={18} /> Neues Paket
        </button>
      )}
    </div>
  );
}

function ServiceEditor({ service, isNew, onDone }: { service: Service; isNew?: boolean; onDone?: () => void }) {
  const [open, setOpen] = useState(!!isNew);
  const [image, setImage] = useState(service.image);
  const [state, action, pending] = useActionState<ActionState, FormData>(async (prev, fd) => {
    const res = await saveService(prev, fd);
    if (res.ok && isNew) onDone?.();
    return res;
  }, {});

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
          <Image src={image} alt="" fill sizes="56px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            {isNew ? "Neues Paket" : service.name}
            {!service.active && <span className="ml-2 text-xs text-zinc-500">inaktiv</span>}
            {service.featured && <span className="ml-2 text-xs text-accent">hervorgehoben</span>}
          </p>
          {!isNew && (
            <p className="text-sm text-muted">
              ab CHF {service.priceFrom} · {categoryLabels[service.category]}
            </p>
          )}
        </div>
        <CaretDown size={18} className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <form action={action} className="grid gap-4 border-t border-line p-5 md:grid-cols-2">
          <input type="hidden" name="isNew" value={isNew ? "1" : "0"} />
          <Field label="Name" name="name" defaultValue={service.name} required />
          <Field
            label="Kürzel (für die URL, nicht änderbar)"
            name="id"
            defaultValue={service.id}
            readOnly={!isNew}
            required
            pattern="[a-z0-9-]{2,40}"
          />
          <Field label="Preis ab (CHF)" name="price_from" type="number" min={0} defaultValue={String(service.priceFrom)} required />
          <Field label="Dauer" name="duration" defaultValue={service.duration} placeholder="z.B. ca. 3 Std." />
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className={adminLabel} htmlFor={`short-${service.id}`}>
              Kurzbeschreibung
            </label>
            <input id={`short-${service.id}`} name="short" defaultValue={service.short} maxLength={200} className={adminInput} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className={adminLabel} htmlFor={`inc-${service.id}`}>
              Leistungen (eine pro Zeile)
            </label>
            <textarea
              id={`inc-${service.id}`}
              name="includes"
              rows={5}
              defaultValue={service.includes.join("\n")}
              className={`${adminInput} resize-y`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={adminLabel} htmlFor={`cat-${service.id}`}>
              Kategorie
            </label>
            <select id={`cat-${service.id}`} name="category" defaultValue={service.category} className={adminInput}>
              {Object.entries(categoryLabels).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Field label="Reihenfolge" name="sort" type="number" defaultValue={String(service.sort)} />

          <fieldset className="md:col-span-2">
            <legend className={adminLabel}>Bild</legend>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
              {images.map((src) => (
                <label key={src} className="relative shrink-0 cursor-pointer">
                  <input
                    type="radio"
                    name="image"
                    value={src}
                    checked={image === src}
                    onChange={() => setImage(src)}
                    className="peer sr-only"
                  />
                  <span className="relative block size-16 overflow-hidden rounded-xl border-2 border-transparent peer-checked:border-accent peer-focus-visible:border-white">
                    <Image src={src} alt={src.split("/").pop()!} fill sizes="64px" className="object-cover" />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-6 md:col-span-2">
            <Check name="active" label="Auf der Website anzeigen" defaultChecked={service.active} />
            <Check name="featured" label="Als Hauptpaket hervorheben" defaultChecked={service.featured} />
          </div>

          <div className="flex items-center gap-4 md:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-accent px-6 py-2.5 font-medium text-white transition hover:bg-accent-strong disabled:opacity-60"
            >
              {pending ? "Speichert ..." : isNew ? "Paket anlegen" : "Speichern"}
            </button>
            {isNew && (
              <button type="button" onClick={onDone} className="text-sm text-muted hover:text-fg">
                Abbrechen
              </button>
            )}
            {state.error && <p className="text-sm text-red-300">{state.error}</p>}
            {state.message && <p className="text-sm text-emerald-300">{state.message}</p>}
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `${name}-${rest.defaultValue ?? "neu"}`;
  return (
    <div className="flex flex-col gap-2">
      <label className={adminLabel} htmlFor={id}>
        {label}
      </label>
      <input id={id} name={name} {...rest} className={`${adminInput} read-only:text-muted`} />
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-[var(--color-accent)]" />
      {label}
    </label>
  );
}
