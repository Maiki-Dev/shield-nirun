import type { LucideIcon } from "lucide-react";
import { Award, Cctv, Cpu, Handshake, ScanFace, Sprout } from "lucide-react";
import { Drone } from "@/lib/icons";
import { tr, type Lang } from "@/lib/i18n";

/*
 * Content policy: only confirmed facts. Founding year, timeline, named board members, governance
 * structure, ESG figures and certificates were removed until the company confirms them.
 */

export interface Value { icon: LucideIcon; no: string; title: string; text: string }
export interface TechPillar { icon: LucideIcon; title: string; text: string; points: string[] }

export function aboutContent(lang: Lang) {
  const t = tr(lang);

  const ABOUT_HERO = {
    image: "/images/site/about-hero.webp",
    imageAlt: t("Ухаалаг хамгаалалтын хяналтын төв", "Smart security monitoring centre"),
  };

  const VISION = {
    title: t("Ухаалаг Хамгаалалтын Шинэ Стандарт", "A New Standard for Smart Security"),
    text: t(
      "Хиймэл оюун ухаан, дрон, ухаалаг камер, нэвтрэх хяналтын технологиор Монголын хот, байгууллагуудын аюулгүй байдлын стандартыг дээшлүүлэх.",
      "To raise the security standard of Mongolia's cities and organisations with artificial intelligence, drones, smart cameras and access control.",
    ),
  };

  const MISSION = {
    title: t("Найдвартай, Тайван Орчныг Бүрдүүлэх", "Creating Safe, Calm Environments"),
    text: t(
      "Технологи болон мэргэшсэн хамгаалалтыг хослуулж, харилцагчдынхаа хүмүүс, хөрөнгө, барилга байгууламжийг найдвартай хамгаалах.",
      "To reliably protect our clients' people, assets and buildings by combining technology with professional security.",
    ),
  };

  /** The four technologies named in the company statement. */
  const TECH_PILLARS: TechPillar[] = [
    {
      icon: Cpu, title: t("Хиймэл оюун ухаан", "Artificial intelligence"),
      text: t("Видео болон мэдрэгчийн өгөгдлийг AI-аар шинжилж, эрсдэлийг эрт илрүүлнэ.", "AI analyses video and sensor data to detect risks early."),
      points: [t("Царай, дугаар таних", "Face and plate recognition"), t("Хэвийн бус үйлдэл илрүүлэх", "Unusual activity detection")],
    },
    {
      icon: Drone, title: t("Дрон", "Drones"),
      text: t("Том талбай, периметр, хүрэхэд хэцүү бүсийг агаараас хянана.", "Monitors large sites, perimeters and hard-to-reach areas from the air."),
      points: [t("Агаарын эргүүл", "Aerial patrols"), t("Шуурхай нөхцөл байдлын үнэлгээ", "Rapid situation assessment")],
    },
    {
      icon: Cctv, title: t("Ухаалаг камер", "Smart cameras"),
      text: t("Бодит цагийн видео хяналт, сэрэмжлүүлэг, бичлэгийн архив.", "Real-time video monitoring, alerts and recording archive."),
      points: [t("Шөнийн хараа", "Night vision"), t("Төвлөрсөн хяналтын самбар", "Central monitoring dashboard")],
    },
    {
      icon: ScanFace, title: t("Нэвтрэх хяналт", "Access control"),
      text: t("Хаалга, турникет, зогсоолын хандалтыг автоматжуулж, бүртгэлжүүлнэ.", "Automates and logs access to doors, turnstiles and parking."),
      points: [t("Царай, карт, QR нэвтрэлт", "Face, card and QR entry"), t("Зочны түр зөвшөөрөл", "Temporary visitor passes")],
    },
  ];

  const VALUES: Value[] = [
    { icon: Handshake, no: "01", title: t("Итгэлцэл ба Ил тод байдал", "Trust & Transparency"), text: t("Харилцагчдын өгөгдлийн нууцлал, ил тод хамтын ажиллагаа.", "Client data privacy and open, transparent cooperation.") },
    { icon: Award, no: "02", title: t("Мэргэжлийн ёс зүй", "Professional Ethics"), text: t("Чанар, аюулгүй ажиллагааны хатуу хяналт.", "Strict control of quality and safe operation.") },
    { icon: Cpu, no: "03", title: t("Инноваци", "Innovation"), text: t("AI, дрон, IoT технологийг дотоодын нөхцөлд нутагшуулах.", "Adapting AI, drone and IoT technology to local conditions.") },
    { icon: Sprout, no: "04", title: t("Нийгмийн хариуцлага", "Social Responsibility"), text: t("Аюулгүй, тайван орчныг нийгэмдээ бүтээх.", "Building a safe, calm environment for our community.") },
  ];

  return { ABOUT_HERO, VISION, MISSION, TECH_PILLARS, VALUES };
}
