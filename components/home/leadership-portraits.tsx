"use client";

/* eslint-disable @next/next/no-img-element */
import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { tr, type Lang } from "@/lib/i18n";

type Portrait = { id: string; name: string; role: string; photo: string; photoPosition: string };

const portraitOffsets = [
  { spacing: "mt-1", angle: -3 },
  { spacing: "mt-9 sm:mt-12", angle: 3 },
  { spacing: "mt-3 sm:mt-6", angle: -2 },
  { spacing: "mt-7 sm:mt-8", angle: 2 },
  { spacing: "mt-1 sm:mt-0", angle: -3 },
  { spacing: "mt-5 sm:mt-4", angle: 2 },
];

export function LeadershipPortraits({ people, lang }: { people: Portrait[]; lang: Lang }) {
  const t = tr(lang);
  const id = useId();
  const reducedMotion = useReducedMotion();
  const threeAcross = people.length >= 3;

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl">
      <h3 id={id} className="mb-4 text-label-lg font-bold text-ink">
        {t("Удирдлагын баг", "Leadership team")}
      </h3>
      <ul aria-labelledby={id} className="flex flex-wrap items-start justify-center gap-x-3 gap-y-5 pb-3 sm:gap-x-4 sm:gap-y-7">
        {people.map((person, index) => {
          const offset = portraitOffsets[index % portraitOffsets.length];
          return (
            <li key={person.id} className={`min-w-0 basis-[calc((100%-0.75rem)/2)] px-1 ${
              threeAcross ? "sm:basis-[calc((100%-2rem)/3)]" : "sm:basis-[calc((100%-1rem)/2)]"
            } ${offset.spacing}`}>
              <motion.figure
                initial={reducedMotion ? false : { y: 10, rotate: offset.angle }}
                style={{ rotate: offset.angle }}
                whileInView={{ y: 0 }}
                whileHover={reducedMotion ? undefined : { y: -4, rotate: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reducedMotion ? 0 : 0.35, ease: "easeOut" }}
                className="relative isolate overflow-hidden rounded-2xl border border-line bg-soft shadow-md"
              >
                <img
                  src={person.photo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                  style={{ objectPosition: person.photoPosition }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/80 to-transparent px-2.5 pb-2.5 pt-8 text-white [overflow-wrap:anywhere] sm:px-3 sm:pb-3">
                  <p className="text-sm font-bold leading-tight">{person.name}</p>
                  <p className="mt-0.5 text-[0.68rem] leading-snug text-brand-light sm:text-xs">{person.role}</p>
                </figcaption>
              </motion.figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
