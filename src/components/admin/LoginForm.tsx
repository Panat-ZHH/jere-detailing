"use client";

import { useActionState } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { login, type ActionState } from "@/app/admin/actions";
import { adminInput } from "./styles";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(login, {});

  return (
    <form action={action} className="mt-6 grid gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-medium">
          Benutzername
        </label>
        <input id="username" name="username" autoComplete="username" required className={adminInput} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={adminInput}
        />
      </div>
      {state.error && (
        <p className="flex items-start gap-2 text-sm text-red-300" role="alert">
          <WarningCircle size={18} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-strong active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Prüfe ..." : "Anmelden"}
      </button>
    </form>
  );
}
