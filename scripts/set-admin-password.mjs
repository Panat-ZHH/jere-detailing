// Setzt (oder ändert) das Admin-Passwort in der DB. Das Passwort wird in Postgres mit bcrypt gehasht.
//
//   ADMIN_PASSWORD='...' node --env-file=.env.local scripts/set-admin-password.mjs jere_admin
//
// Das Passwort kommt aus einer Umgebungsvariable, damit es nicht in einer Datei landet.

import { createClient } from "@supabase/supabase-js";

const username = process.argv[2] ?? "jere_admin";
const password = process.env.ADMIN_PASSWORD;
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt (.env.local).");
  process.exit(1);
}
if (!password || password.length < 16) {
  console.error("ADMIN_PASSWORD fehlt oder ist kürzer als 16 Zeichen.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { error } = await supabase.rpc("admin_set_password", { p_username: username, p_password: password });
if (error) {
  console.error("Fehler:", error.message);
  process.exit(1);
}
console.log(`Passwort für ${username} gesetzt. Alle bestehenden Sessions wurden beendet.`);
