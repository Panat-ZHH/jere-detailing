import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "./supabase-server";

const COOKIE = "jj_admin";
const SESSION_HOURS = 12;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export type Admin = { id: string; username: string };

// Prüft Benutzername + Passwort in der DB (bcrypt, Sperre nach 5 Fehlversuchen).
export async function verifyLogin(username: string, password: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("admin_login", { p_username: username, p_password: password });
  if (error) {
    console.error("admin_login failed", error);
    return null;
  }
  return (data as string | null) ?? null;
}

export async function createSession(userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase nicht konfiguriert");
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_HOURS * 3600 * 1000);

  // abgelaufene Sessions bei der Gelegenheit aufräumen
  await supabase.from("admin_sessions").delete().lt("expires_at", new Date().toISOString());
  const { error } = await supabase
    .from("admin_sessions")
    .insert({ token_hash: sha256(token), user_id: userId, expires_at: expires.toISOString() });
  if (error) throw error;

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function getAdmin(): Promise<Admin | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase
    .from("admin_sessions")
    .select("expires_at, admin_users(id, username)")
    .eq("token_hash", sha256(token))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  const user = data?.admin_users as unknown as Admin | null | undefined;
  return user ?? null;
}

export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin");
  return admin;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await getSupabaseAdmin()?.from("admin_sessions").delete().eq("token_hash", sha256(token));
  }
  jar.delete(COOKIE);
}
