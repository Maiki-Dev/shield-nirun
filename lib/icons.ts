import { createLucideIcon } from "lucide-react";

/** Quadcopter drone in Lucide style (lucide-react 0.460 has no drone icon). */
export const Drone = createLucideIcon("Drone", [
  ["path", { d: "M10 10 7 7", key: "a1" }],
  ["path", { d: "m14 10 3-3", key: "a2" }],
  ["path", { d: "m10 14-3 3", key: "a3" }],
  ["path", { d: "m14 14 3 3", key: "a4" }],
  ["rect", { x: "9.5", y: "9.5", width: "5", height: "5", rx: "1", key: "body" }],
  ["circle", { cx: "5.5", cy: "5.5", r: "2.5", key: "r1" }],
  ["circle", { cx: "18.5", cy: "5.5", r: "2.5", key: "r2" }],
  ["circle", { cx: "5.5", cy: "18.5", r: "2.5", key: "r3" }],
  ["circle", { cx: "18.5", cy: "18.5", r: "2.5", key: "r4" }],
]);
