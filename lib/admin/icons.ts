import type { LucideIcon } from "lucide-react";
import { Building2, Camera, Car, Cctv, Code2, DoorClosed, Lock, Network, Pickaxe, ScanFace, Server, ShieldCheck, Wrench } from "lucide-react";
import { Drone } from "@/lib/icons";

/** Icons an editor can pick for a service card (stored by key in the database). */
export const SERVICE_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  cctv: { icon: Cctv, label: "Камер" },
  camera: { icon: Camera, label: "Фото камер" },
  door: { icon: DoorClosed, label: "Хаалга / нэвтрэлт" },
  face: { icon: ScanFace, label: "Царай таних" },
  drone: { icon: Drone, label: "Дрон" },
  shield: { icon: ShieldCheck, label: "Хамгаалалт" },
  network: { icon: Network, label: "Сүлжээ" },
  server: { icon: Server, label: "Сервер" },
  lock: { icon: Lock, label: "Нууцлал" },
  wrench: { icon: Wrench, label: "Засвар" },
  software: { icon: Code2, label: "Программ хангамж" },
  car: { icon: Car, label: "Машин / зогсоол" },
  building: { icon: Building2, label: "Барилга" },
  mine: { icon: Pickaxe, label: "Уул уурхай" },
};

export const serviceIcon = (key: string): LucideIcon => SERVICE_ICONS[key]?.icon ?? ShieldCheck;
