"use client";

import type { ReactNode } from "react";

/** Submit button that asks for confirmation first (for destructive actions). */
export function ConfirmButton({ action, message, className, children }: { action: () => Promise<void>; message: string; className?: string; children: ReactNode }) {
  return (
    <form action={action} onSubmit={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>
      <button type="submit" className={className}>{children}</button>
    </form>
  );
}
