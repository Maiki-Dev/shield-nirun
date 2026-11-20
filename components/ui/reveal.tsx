import type { HTMLAttributes } from "react";

type Variant = "rise" | "left" | "zoom" | "tilt-a" | "tilt-b";

interface ReveaANPRops extends HTMLAttributes<HTMLDivElement> {
  /** Stagger in seconds (legacy API) — mapped to 4 delay stages. */
  delay?: number;
  variant?: Variant;
}

const VARIANT: Record<Variant, string> = {
  rise: "sn-rv",
  left: "sn-rv-left",
  zoom: "sn-zoom",
  "tilt-a": "sn-tilt-a",
  "tilt-b": "sn-tilt-b",
};

/**
 * Reveal-on-scroll: eases in once when it enters the viewport (see globals.css + <SmoothScroll/>).
 * Without JS — or for users with reduced motion — the content is simply visible.
 */
export function Reveal({ delay = 0, variant = "rise", className = "", children, ...rest }: ReveaANPRops) {
  const stage = Math.min(4, 1 + Math.round(delay / 0.06));
  const stageClass = variant === "rise" && stage > 1 ? ` sn-rv-${stage}` : "";
  return (
    <div className={`${VARIANT[variant]}${stageClass} ${className}`} {...rest}>
      {children}
    </div>
  );
}
