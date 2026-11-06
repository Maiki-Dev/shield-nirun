import type { LucideIcon } from "lucide-react";
import {
  Building2, Cctv, Cpu, DoorClosed, Eye, Network, ScanFace, ShieldCheck, SquareParking, Workflow,
} from "lucide-react";
import { Drone } from "@/lib/icons";
import { tr, type Lang } from "@/lib/i18n";

/*
 * Content policy: only facts the company has confirmed. Unverified numbers, certificates, named
 * people, case studies, news and prices were removed (Nov 2026) — add them back only with real data.
 */

export interface IconText { icon: LucideIcon; title: string; text: string }
export interface HudStatus { icon: LucideIcon; label: string; status: string; caption: string }
export interface Solution {
  id: string; icon: LucideIcon; index: number; title: string; tag: string; description: string; features: string[]; href: string;
}
export interface Sector { title: string; tag: string; scene: "residential" | "office" | "retail"; description: string; uses: string[] }

/** The company's own one-line positioning (confirmed by Shield Nirun). Used after "Манай байгууллага" / "We". */
export const companyStatement = (lang: Lang) =>
  tr(lang)(
    "хиймэл оюун ухаан, дрон, ухаалаг камер, нэвтрэх хяналтын систем зэрэг технологид суурилсан холбогдсон, автоматжуулсан, найдвартай хамгаалалтын шийдэл санал болгодог",
    "deliver connected, automated and reliable security solutions built on artificial intelligence, drones, smart cameras and access control systems",
  );

export function homeContent(lang: Lang) {
  const t = tr(lang);

  const HERO_BADGES = [
    { icon: Cpu, label: t("Хиймэл оюун ухаан", "Artificial intelligence") },
    { icon: Drone, label: t("Дрон хяналт", "Drone surveillance") },
    { icon: ScanFace, label: t("Ухаалаг нэвтрэх хяналт", "Smart access control") },
  ];

  /** Illustrative dashboard states (no performance figures). */
  const HUD_STATUS: HudStatus[] = [
    { icon: Cctv, label: t("Ухаалаг камер", "Smart cameras"), status: t("Онлайн", "Online"), caption: t("AI дүрс шинжилгээ", "AI video analytics") },
    { icon: Drone, label: t("Дрон эргүүл", "Drone patrol"), status: t("Бэлэн", "Ready"), caption: t("Агаараас хяналт", "Aerial monitoring") },
    { icon: DoorClosed, label: t("Нэвтрэх хяналт", "Access control"), status: t("Идэвхтэй", "Active"), caption: t("Царай, карт, QR", "Face, card, QR") },
    { icon: SquareParking, label: t("Зогсоол ANPR", "Parking ANPR"), status: t("Идэвхтэй", "Active"), caption: t("Дугаар таних AI", "Plate recognition AI") },
  ];

  /** The four technology pillars from the company statement. */
  const TECH: IconText[] = [
    { icon: Cpu, title: t("Хиймэл оюун ухаан", "Artificial intelligence"), text: t("Дүрс, дугаар, царай таних AI шинжилгээ", "AI analysis that recognises objects, plates and faces") },
    { icon: Drone, title: t("Дрон", "Drones"), text: t("Агаараас эргүүл, том талбайн хяналт", "Aerial patrols and wide-area monitoring") },
    { icon: Cctv, title: t("Ухаалаг камер", "Smart cameras"), text: t("Бодит цагийн видео хяналт ба сэрэмжлүүлэг", "Real-time video monitoring and alerts") },
    { icon: ScanFace, title: t("Нэвтрэх хяналт", "Access control"), text: t("Хаалга, турникет, зогсоолын хандалт", "Doors, turnstiles and parking access") },
  ];

  const EXEC = {
    message: t(
      "Аюулгүй байдлыг бид зөвхөн харуулын хяналт гэж харахгүй. Хиймэл оюун ухаан, дрон, ухаалаг камер, нэвтрэх хяналтын системийг нэг сүлжээнд холбож, хүний алдаанаас хамаарал багатай, найдвартай хамгаалалтыг бий болгох нь бидний зорилго.",
      "We don't see security as guarding alone. Our goal is to connect artificial intelligence, drones, smart cameras and access control into one network, creating automated, reliable protection that depends less on human error.",
    ),
    vision: t(
      "Ухаалаг хамгаалалтын технологиор Монголын хот, байгууллагуудын аюулгүй байдлын стандартыг дээшлүүлэх.",
      "To raise the security standard of Mongolia's cities and organisations with smart security technology.",
    ),
    mission: t(
      "AI, дрон, ухаалаг камер, нэвтрэх хяналтын шийдлээр харилцагчдадаа найдвартай, тайван орчныг бүрдүүлэх.",
      "To give our clients a safe, calm environment through AI, drones, smart cameras and access control.",
    ),
  };

  const SOLUTIONS: Solution[] = [
    {
      id: "parking", icon: SquareParking, index: 1, title: t("Ухаалаг авто зогсоолын систем", "Smart parking system"), tag: "Smart Parking ANPR",
      description: t(
        "Дугаар таних камер, машины бүртгэл, QR + QPay төлбөр, автомат хаалт болон орлогын тайлан бүхий зогсоолын шийдэл.",
        "A parking solution with plate-recognition cameras, vehicle records, QR + QPay payment, automatic barriers and revenue reports.",
      ),
      features: [
        t("Улсын дугаар автоматаар таних", "Automatic licence-plate recognition"),
        t("Гэрээт, төлбөртэй машиныг ялгах", "Separates contract and paying vehicles"),
        t("Орлого, гүйлгээний тайлан", "Revenue and transaction reports"),
      ],
      href: "/products/smart-parking",
    },
    {
      id: "hoa", icon: Building2, index: 2, title: t("СӨХ-ийн нэгдсэн систем", "Unified HOA system"), tag: "Smart HOA Cloud",
      description: t(
        "Оршин суугчийн апп, СӨХ-ийн удирдлагын самбар, нэхэмжлэл ба хүсэлтийн урсгалыг нэгтгэсэн систем.",
        "One system for the resident app, the HOA management dashboard, invoices and service requests.",
      ),
      features: [
        t("Нэхэмжлэл, үлдэгдлийг апп-аас харах", "Invoices and balances in the app"),
        t("Хүсэлт, зарлал, push мэдэгдэл", "Requests, announcements, push notifications"),
        t("Байр, тоотын удирдлагын самбар", "Building and unit management dashboard"),
      ],
      href: "/products/smart-hoa",
    },
    {
      id: "camera", icon: Cctv, index: 3, title: t("Камер, дрон & тоног төхөөрөмж", "Cameras, drones & hardware"), tag: "Surveillance & Hardware",
      description: t(
        "AI ухаалаг камер, дрон, хандалтын хяналт (Access Control), турникет хаалт, сүлжээний дэд бүтэц угсралт.",
        "AI smart cameras, drones, access control, turnstiles and network infrastructure installation.",
      ),
      features: [
        t("AI царай таних хяналтын камер", "AI face-recognition cameras"),
        t("Дрон ба агаараас хяналт", "Drones and aerial monitoring"),
        t("Турникет, хандалтын систем", "Turnstiles and access systems"),
      ],
      href: "/products#hardware",
    },
    {
      id: "security", icon: ShieldCheck, index: 4, title: t("Хамгаалалт & Аюулгүй байдал", "Security & safety"), tag: "Physical Security & Patrol",
      description: t(
        "Мэргэшсэн хамгаалалтын алба, дрон болон GPS эргүүл, төвлөрсөн хяналт, шуурхай хариу арга хэмжээ.",
        "Professional security staff, drone and GPS patrols, central monitoring and rapid response.",
      ),
      features: [
        t("Сургагдсан хамгаалалтын алба", "Trained security staff"),
        t("Дрон эргүүл ба агаараас хяналт", "Drone patrols and aerial monitoring"),
        t("Төвлөрсөн хяналтын самбар", "Central monitoring dashboard"),
      ],
      href: "/contact",
    },
  ];

  /** Where the solutions apply — descriptive, not completed projects. */
  const SECTORS: Sector[] = [
    {
      title: t("Орон сууцны хотхон", "Residential complexes"), tag: t("Хотхон", "Residential"), scene: "residential",
      description: t(
        "Хотхоны орц, зогсоол, гадна талбайг нэг системд холбож, оршин суугчдын нэвтрэлт, зочны бүртгэл, эргүүлийг автоматжуулна.",
        "Connect entrances, parking and outdoor areas in one system and automate resident access, visitor logs and patrols.",
      ),
      uses: [t("ANPR зогсоол", "ANPR parking"), t("Царай таних орц", "Face-recognition entry"), t("Дрон эргүүл", "Drone patrol")],
    },
    {
      title: t("Оффис & бизнес төв", "Offices & business centres"), tag: t("Бизнес төв", "Business"), scene: "office",
      description: t(
        "Ажилтан, зочны нэвтрэх хяналт, турникет, ухаалаг камерын сүлжээг төвлөрсөн самбараас удирдана.",
        "Manage staff and visitor access, turnstiles and the smart camera network from one central dashboard.",
      ),
      uses: [t("Турникет", "Turnstiles"), t("Зочны QR", "Visitor QR"), t("AI камер", "AI cameras")],
    },
    {
      title: t("Худалдаа & үйлчилгээний төв", "Retail & service centres"), tag: t("Худалдаа", "Retail"), scene: "retail",
      description: t(
        "Олон гарцтай зогсоол, цахим төлбөр, том талбайн видео болон дрон хяналтыг нэгтгэсэн шийдэл.",
        "One solution for multi-gate parking, digital payment, and video and drone monitoring of large sites.",
      ),
      uses: [t("Олон гарцтай ANPR", "Multi-gate ANPR"), t("Цахим төлбөр", "Digital payment"), t("Периметр хяналт", "Perimeter monitoring")],
    },
  ];

  /** Why Shield Nirun — built only from the company statement. */
  const WHY: IconText[] = [
    { icon: Network, title: t("Нэгдсэн систем", "Unified system"), text: t("Камер, дрон, хаалга, зогсоолын систем нэг сүлжээнд холбогдож, мэдээлэл нэг дор харагдана.", "Cameras, drones, gates and parking share one network, so everything is visible in one place.") },
    { icon: Workflow, title: t("Автомат ажиллагаа", "Automation"), text: t("Таних, бүртгэх, сэрэмжлүүлэх үйлдлийг систем өөрөө гүйцэтгэж, хүний алдааг багасгана.", "The system recognises, records and alerts on its own, reducing human error.") },
    { icon: ShieldCheck, title: t("Найдвартай", "Reliable"), text: t("Хамгаалалтын алба болон технологийн шийдлийг хослуулж, тасралтгүй хяналтыг хангана.", "Security staff and technology work together for uninterrupted monitoring.") },
    { icon: Cpu, title: t("Хиймэл оюун ухаан", "Artificial intelligence"), text: t("Дүрс, дугаар, царай таних AI шинжилгээгээр эрсдэлийг эрт илрүүлнэ.", "AI recognition of objects, plates and faces spots risks early.") },
    { icon: Drone, title: t("Дрон технологи", "Drone technology"), text: t("Том талбай, периметрийг агаараас хурдан, үр ашигтай хянана.", "Monitors large sites and perimeters from the air, quickly and efficiently.") },
    { icon: Eye, title: t("Ил тод хяналт", "Transparent oversight"), text: t("Үйл явдал, нэвтрэлт бүр бүртгэгдэж, удирдлагад тайлан хэлбэрээр харагдана.", "Every event and entry is logged and reported to management.") },
  ];

  return { HERO_BADGES, HUD_STATUS, TECH, EXEC, SOLUTIONS, SECTORS, WHY };
}
