"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, requireAdmin, verifyLogin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export type ActionState = { ok?: boolean; error?: string; message?: string };

const STATUSES = ["angefragt", "bestaetigt", "erledigt", "storniert"] as const;
const CATEGORIES = ["pflege", "innen", "schutz"] as const;
const SLOT = /^([01]\d|2[0-3]):[0-5]\d$/;

function db() {
  const s = getSupabaseAdmin();
  if (!s) throw new Error("Supabase ist nicht konfiguriert.");
  return s;
}

// ---------------------------------------------------------------- Login

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!username || !password) return { error: "Bitte Benutzername und Passwort eingeben." };

  const userId = await verifyLogin(username, password);
  if (!userId) {
    // kleine Bremse gegen automatisiertes Durchprobieren
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Login fehlgeschlagen. Nach 5 Fehlversuchen ist der Zugang 15 Minuten gesperrt." };
  }
  await createSession(userId);
  redirect("/admin/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/admin");
}

// ---------------------------------------------------------------- Anfragen

export async function setRequestStatus(id: string, status: string): Promise<ActionState> {
  await requireAdmin();
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return { error: "Ungültiger Status." };
  const { error } = await db()
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "Für diesen Termin ist schon eine andere Anfrage bestätigt." };
    return { error: "Speichern fehlgeschlagen." };
  }
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function saveRequestNote(id: string, note: string): Promise<ActionState> {
  await requireAdmin();
  const { error } = await db()
    .from("bookings")
    .update({ admin_note: note.slice(0, 2000) || null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: "Notiz konnte nicht gespeichert werden." };
  revalidatePath("/admin/dashboard");
  return { ok: true, message: "Notiz gespeichert." };
}

// ---------------------------------------------------------------- Leistungen / Preise

export async function saveService(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const isNew = form.get("isNew") === "1";
  const id = String(form.get("id") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim();
  const price = Number(form.get("price_from"));
  const category = String(form.get("category") ?? "");
  const includes = String(form.get("includes") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 12);

  if (!/^[a-z0-9-]{2,40}$/.test(id)) return { error: "Kürzel: 2-40 Zeichen, nur a-z, 0-9 und Bindestrich." };
  if (name.length < 2) return { error: "Bitte einen Namen eingeben." };
  if (!Number.isInteger(price) || price < 0 || price > 100000) return { error: "Preis muss eine ganze Zahl sein." };
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) return { error: "Ungültige Kategorie." };

  const row = {
    id,
    name,
    short: String(form.get("short") ?? "").trim().slice(0, 200),
    price_from: price,
    duration: String(form.get("duration") ?? "").trim().slice(0, 40),
    category,
    includes,
    image: String(form.get("image") ?? "/images/schaum.png"),
    featured: form.get("featured") === "on",
    active: form.get("active") === "on",
    sort: Number(form.get("sort")) || 0,
    updated_at: new Date().toISOString(),
  };

  const supabase = db();
  const { error } = isNew
    ? await supabase.from("services").insert(row)
    : await supabase.from("services").update(row).eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "Dieses Kürzel gibt es schon." };
    console.error("saveService failed", error);
    return { error: "Speichern fehlgeschlagen." };
  }
  // Nur ein Paket kann hervorgehoben sein
  if (row.featured) await supabase.from("services").update({ featured: false }).neq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { ok: true, message: isNew ? "Paket angelegt." : "Gespeichert. Die Website ist aktualisiert." };
}

// ---------------------------------------------------------------- Einstellungen

export async function saveSettings(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const slots = (k: string) =>
    String(form.get(k) ?? "")
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  const weekday = slots("weekday_slots");
  const saturday = slots("saturday_slots");
  if (![...weekday, ...saturday].every((s) => SLOT.test(s))) return { error: "Zeiten bitte im Format HH:MM, z.B. 08:00." };
  const fm = Number(form.get("size_factor_mittel"));
  const fg = Number(form.get("size_factor_gross"));
  if (!(fm >= 0.5 && fm <= 3 && fg >= 0.5 && fg <= 3)) return { error: "Faktoren müssen zwischen 0.5 und 3 liegen." };

  const text = (k: string, max = 200) => String(form.get(k) ?? "").trim().slice(0, max);
  const { error } = await db()
    .from("settings")
    .update({
      phone: text("phone", 40) || null,
      email: text("email") || null,
      address: text("address") || "Frauenfeld, Thurgau",
      instagram: text("instagram") || "https://www.instagram.com/jj.detailing01/",
      weekday_slots: weekday,
      saturday_slots: saturday,
      hours_weekday: text("hours_weekday", 40),
      hours_saturday: text("hours_saturday", 40),
      size_factor_mittel: fm,
      size_factor_gross: fg,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) {
    console.error("saveSettings failed", error);
    return { error: "Speichern fehlgeschlagen." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Einstellungen gespeichert." };
}

export async function changePassword(_: ActionState, form: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next.length < 16) return { error: "Das neue Passwort braucht mindestens 16 Zeichen." };
  if (next !== String(form.get("repeat") ?? "")) return { error: "Die neuen Passwörter stimmen nicht überein." };
  if (!(await verifyLogin(admin.username, current))) return { error: "Aktuelles Passwort ist falsch." };

  const { error } = await db().rpc("admin_set_password", { p_username: admin.username, p_password: next });
  if (error) return { error: "Passwort konnte nicht geändert werden." };
  // admin_set_password beendet alle Sessions, also neu einloggen
  redirect("/admin");
}
