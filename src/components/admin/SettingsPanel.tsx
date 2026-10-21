"use client";

import { useActionState } from "react";
import type { Settings } from "@/lib/booking";
import { changePassword, saveSettings, type ActionState } from "@/app/admin/actions";
import { adminInput, adminLabel } from "./styles";

export function SettingsPanel({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettings, {});
  const [pw, pwAction, pwPending] = useActionState<ActionState, FormData>(changePassword, {});

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form action={action} className="grid gap-5 rounded-[var(--radius-card)] border border-line bg-ink-2 p-6 md:grid-cols-2 lg:col-span-8">
        <h2 className="font-display text-xl font-semibold md:col-span-2">Kontakt und Zeiten</h2>
        <Field label="Telefon" name="phone" defaultValue={settings.phone ?? ""} placeholder="+41 79 ..." />
        <Field label="E-Mail" name="email" type="email" defaultValue={settings.email ?? ""} />
        <Field label="Adresse / Ort" name="address" defaultValue={settings.address} className="md:col-span-2" />
        <Field label="Instagram-Link" name="instagram" defaultValue={settings.instagram} className="md:col-span-2" />
        <Field label="Öffnungszeiten Mo-Fr" name="hours_weekday" defaultValue={settings.hoursWeekday} />
        <Field label="Öffnungszeiten Samstag" name="hours_saturday" defaultValue={settings.hoursSaturday} />
        <Field
          label="Startzeiten Mo-Fr (mit Komma getrennt)"
          name="weekday_slots"
          defaultValue={settings.weekdaySlots.join(", ")}
        />
        <Field
          label="Startzeiten Samstag (leer = geschlossen)"
          name="saturday_slots"
          defaultValue={settings.saturdaySlots.join(", ")}
        />
        <Field
          label="Preisfaktor mittleres Auto"
          name="size_factor_mittel"
          type="number"
          step="0.05"
          defaultValue={String(settings.sizeFactors.mittel)}
        />
        <Field
          label="Preisfaktor grosses Auto"
          name="size_factor_gross"
          type="number"
          step="0.05"
          defaultValue={String(settings.sizeFactors.gross)}
        />
        <p className="text-sm text-muted md:col-span-2">
          Beispiel: Faktor 1.15 macht aus CHF 100 für Kleinwagen CHF 115 für ein mittleres Auto.
        </p>
        <div className="flex items-center gap-4 md:col-span-2">
          <button
            disabled={pending}
            className="rounded-full bg-accent px-6 py-2.5 font-medium text-white transition hover:bg-accent-strong disabled:opacity-60"
          >
            {pending ? "Speichert ..." : "Speichern"}
          </button>
          {state.error && <p className="text-sm text-red-300">{state.error}</p>}
          {state.message && <p className="text-sm text-emerald-300">{state.message}</p>}
        </div>
      </form>

      <form action={pwAction} className="grid content-start gap-5 rounded-[var(--radius-card)] border border-line bg-ink-2 p-6 lg:col-span-4">
        <h2 className="font-display text-xl font-semibold">Passwort ändern</h2>
        <Field label="Aktuelles Passwort" name="current" type="password" autoComplete="current-password" required />
        <Field label="Neues Passwort (min. 16 Zeichen)" name="next" type="password" autoComplete="new-password" minLength={16} required />
        <Field label="Neues Passwort wiederholen" name="repeat" type="password" autoComplete="new-password" minLength={16} required />
        <button
          disabled={pwPending}
          className="rounded-full border border-line px-6 py-2.5 font-medium transition hover:bg-white/5 disabled:opacity-60"
        >
          {pwPending ? "Ändert ..." : "Passwort ändern"}
        </button>
        {pw.error && <p className="text-sm text-red-300">{pw.error}</p>}
        <p className="text-xs text-muted">Danach wirst du abgemeldet und meldest dich mit dem neuen Passwort an.</p>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  className,
  ...rest
}: { label: string; name: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label className={adminLabel} htmlFor={`s-${name}`}>
        {label}
      </label>
      <input id={`s-${name}`} name={name} {...rest} className={adminInput} />
    </div>
  );
}
