"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Upload } from "lucide-react";
import { uploadMedia } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-label-lg font-bold text-navy hover:brightness-110 disabled:opacity-60">
      <Upload className="h-4 w-4" /> {pending ? "Оруулж байна…" : "Оруулах"}
    </button>
  );
}

export function UploadForm() {
  const [state, action] = useFormState(uploadMedia, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok && !state.error) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={action} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input name="files" type="file" multiple required accept="image/jpeg,image/png,image/webp,application/pdf" className="block w-full text-body-sm text-ink2 file:mr-4 file:rounded-full file:border-0 file:bg-soft file:px-4 file:py-2 file:text-label-md file:font-bold file:text-ink" />
      <Submit />
      {state?.ok ? <span className="text-label-md font-bold text-emerald-300">{state.ok} файл орлоо</span> : null}
      {state?.error && <span role="alert" className="text-label-md font-bold text-red-300">{state.error}</span>}
    </form>
  );
}
