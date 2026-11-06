"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2 text-label-md font-bold text-ink hover:border-ink/30"
    >
      {done ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {done ? "Хуулсан" : "Холбоос хуулах"}
    </button>
  );
}
