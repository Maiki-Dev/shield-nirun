import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center" | "split";
  action?: ReactNode;
}

/** Eyebrow + H2 (+ description / action) used by every section. */
export function SectionHeader({ eyebrow, title, description, align = "left", action }: SectionHeaderProps) {
  if (align === "center") {
    return (
      <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-3 text-center lg:mb-14">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h2">{title}</h2>
        {description && <p className="text-body-md text-muted sm:text-body-lg">{description}</p>}
      </div>
    );
  }
  return (
    <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end lg:mb-12">
      <div className="flex max-w-2xl flex-col gap-2">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h2">{title}</h2>
        {align === "left" && description && <p className="mt-1 text-body-md text-muted sm:text-body-lg">{description}</p>}
      </div>
      {align === "split" && description && <p className="max-w-md text-body-md text-muted">{description}</p>}
      {action}
    </div>
  );
}
