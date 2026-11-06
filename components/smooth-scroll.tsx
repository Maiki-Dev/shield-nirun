"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __snLenis?: Lenis;
  }
}

/**
 * Inertia ("buttery") scrolling via Lenis. It drives the native scroll position, so the CSS
 * scroll-driven reveals keep working. Disabled for users who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -96 },
    });
    window.__snLenis = lenis;
    return () => {
      lenis.destroy();
      window.__snLenis = undefined;
    };
  }, []);
  return null;
}
