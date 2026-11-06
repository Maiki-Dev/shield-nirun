"use client";

import { useRef } from "react";

/** Note form that clears itself after a successful save. */
export function NoteForm({ action }: { action: (form: FormData) => Promise<void> }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await action(fd);
        ref.current?.reset();
      }}
      className="flex flex-col gap-3"
    >
      <textarea name="body" required rows={3} maxLength={4000} placeholder="Жишээ: Утсаар ярьсан, 11/12-нд объект дээр очно." className="input h-auto resize-y py-3" />
      <button className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 text-label-lg font-bold text-navy hover:brightness-110">Тэмдэглэл нэмэх</button>
    </form>
  );
}
