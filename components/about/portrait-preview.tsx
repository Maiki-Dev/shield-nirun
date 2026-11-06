"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";

export function PortraitPreview({ photo, position, name, role, closeLabel }: {
  photo: string;
  position: string;
  name: string;
  role: string;
  closeLabel: string;
}) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!preview) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") setPreview(false);
    }
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [preview]);

  return (
    <>
      <div
        className={`org-person relative ${preview ? "z-10" : ""}`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && !dialog.current?.open) setPreview(true);
        }}
        onPointerLeave={() => setPreview(false)}
      >
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => {
            setPreview(false);
            dialog.current?.showModal();
          }}
          className="flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border border-line bg-card p-2 text-left shadow-sm transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-soft">
            <img src={photo} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
            <Maximize2 aria-hidden="true" className="absolute bottom-1 right-1 h-5 w-5 rounded bg-navy/80 p-1 text-white" />
          </span>
          <span className="min-w-0 [overflow-wrap:anywhere]">
            <span className="block text-base font-semibold leading-tight text-ink">{name}</span>
            <span className="mt-1 block text-xs leading-snug text-muted">{role}</span>
          </span>
        </button>
        {preview && (
          <div aria-hidden="true" className="absolute bottom-full left-0 w-56 max-w-[70vw] pb-1 lg:left-1/2 lg:-translate-x-1/2">
            <figure className="rounded-2xl border border-line bg-card p-2 text-ink shadow-xl">
              <img src={photo} alt="" className="block max-h-60 w-full rounded-xl bg-soft object-contain" />
              <figcaption className="px-1 pb-1 pt-2 [overflow-wrap:anywhere]">
                <p className="text-base font-semibold leading-tight">{name}</p>
                <p className="mt-1 text-body-sm text-muted">{role}</p>
              </figcaption>
            </figure>
          </div>
        )}
      </div>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-line bg-card p-0 text-ink shadow-xl backdrop:bg-navy/70"
      >
        <figure className="relative p-3 sm:p-4">
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => dialog.current?.close()}
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-navy/90 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
          <img src={photo} alt="" loading="lazy" decoding="async" className="block max-h-[60dvh] w-full rounded-xl bg-soft object-contain" />
          <figcaption className="px-1 pb-1 pt-4 [overflow-wrap:anywhere]">
            <p id={titleId} className="text-xl font-semibold leading-tight">{name}</p>
            <p className="mt-1 text-body-sm text-muted">{role}</p>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}
