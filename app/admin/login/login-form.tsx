"use client";

import { useFormState, useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { login } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full !rounded-full !py-3.5 disabled:opacity-60">
      <LogIn className="h-4 w-4" /> {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState(login, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="label">И-мэйл</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Нууц үг</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-body-sm font-semibold text-red-300">{state.error}</p>
      )}
      <Submit />
    </form>
  );
}
