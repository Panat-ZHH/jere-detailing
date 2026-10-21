import { requireAdmin } from "@/lib/auth";
import { getServices, getSettings } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { Dashboard, type RequestRow } from "@/components/admin/Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const supabase = getSupabaseAdmin()!;

  const [{ data: requests }, services, settings] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, created_at, service, vehicle_size, date, time, name, email, phone, car, notes, status, admin_note, price_estimate")
      .order("date", { ascending: true })
      .order("time", { ascending: true })
      .limit(500),
    getServices({ includeInactive: true }),
    getSettings(),
  ]);

  return (
    <Dashboard
      username={admin.username}
      requests={(requests ?? []) as RequestRow[]}
      services={services}
      settings={settings}
    />
  );
}
