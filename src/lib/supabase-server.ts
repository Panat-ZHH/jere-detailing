import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Nur serverseitig verwenden: der Service-Role-Key umgeht RLS.
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
