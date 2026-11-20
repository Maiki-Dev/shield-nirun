"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __snLenis?: Lenis;
  }
}

const REVEAL = ".sn-rv, .sn-rv-left, .sn-zoom, .sn-tilt-a, .sn-tilt-b";

/** Marks reveal elements with `data-in` once, the first time they enter the viewport. */
function watchReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Entering, or already scrolled past (page restored mid-way / anchor jump).
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  const scan = (root: ParentNode) => {
    if (root instanceof Element && root.matches(REVEAL) && !root.hasAttribute("data-in")) io.observe(root);
    root.querySelectorAll(REVEAL).forEach((el) => {
      if (!el.hasAttribute("data-in")) io.observe(el);
    });
  };
  scan(document);
  // Pick up content rendered later (client-side route changes).
  const mo = new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && scan(n));
  });
  mo.observe(document.body, { childList: true, subtree: true });
  return () => {
    io.disconnect();
    mo.disconnect();
  };
}

/**
 * Inertia ("buttery") scrolling via Lenis + one-shot reveal-on-scroll.
 * Smooth scrolling is disabled for users who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => watchReveals(), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
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
