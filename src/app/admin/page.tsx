import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  if (await getAdmin()) redirect("/admin/dashboard");

  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-5">
      <Image src="/images/studio.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />

      <div className="glass w-full max-w-sm rounded-[var(--radius-card)] p-8">
        <div className="flex items-center gap-3">
          <Image src="/logo.webp" alt="" width={44} height={44} className="size-11 rounded-full" />
          <div>
            <p className="font-display font-semibold">jj.detailing01</p>
            <p className="text-sm text-muted">Verwaltung</p>
          </div>
        </div>
        <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight">Anmelden</h1>
        <LoginForm />
      </div>
    </main>
  );
}
