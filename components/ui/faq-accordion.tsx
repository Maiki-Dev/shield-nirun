"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

/** Single-open accordion with animated height. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `faq-panel-${i}`;
        return (
          <div key={item.q} className="card overflow-hidden !rounded-[22px]">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[1.1rem] font-semibold text-ink transition-colors hover:text-accent"
            >
              <span>{item.q}</span>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-all duration-200 ${isOpen ? "rotate-180 border-brand bg-brand text-white" : "text-ink"}`}>
                <ChevronDown className="h-5 w-5" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <p className="px-6 pb-6 text-body-md text-muted">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
