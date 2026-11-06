"use client";

import type { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";

type State = { ok?: string; error?: string } | undefined;

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-label-lg font-bold text-navy hover:brightness-110 disabled:opacity-60">
      {pending ? "…" : label}
    </button>
  );
}

/** Small form wrapper that shows the action's ok / error message next to the submit button. */
export function ActionForm({ action, submit, children, className = "" }: { action: (s: State, f: FormData) => Promise<State>; submit: string; children: ReactNode; className?: string }) {
  const [state, run] = useFormState(action, undefined);
  return (
    <form action={run} className={className}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <Submit label={submit} />
        {state?.ok && <span className="text-label-md font-bold text-emerald-300">{state.ok}</span>}
        {state?.error && <span role="alert" className="text-label-md font-bold text-red-300">{state.error}</span>}
      </div>
    </form>
  );
}
