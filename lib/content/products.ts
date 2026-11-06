import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck, BatteryCharging, Cctv, Cpu, DoorClosed, Gavel, Lock, QrCode, ReceiptText, Server, UserCheck, Zap, ScanLine, ChartColumn, Wrench, LayoutDashboard, Network, ShieldCheck,
} from "lucide-react";
import { Drone } from "@/lib/icons";
import { tr, type Lang } from "@/lib/i18n";


export interface Kpi { icon: LucideIcon; value: string; label: string; caption: string }
export interface Feature { icon: LucideIcon; title: string; text: string }
export interface HardwareCard { icon: LucideIcon; badge: string; title: string; text: string; footIcon: LucideIcon; foot: string; image: string; imageAlt: string }
export interface Step { no: string; title: string; text: string; time: string; highlight?: boolean }
export interface Tier {
  name: string; tag: string; audience: string; price: string; period: string; cta: string; featured?: boolean;
  includes: string[]; excludes?: string[];
}
export interface Faq { q: string; a: string; /** about a Shield+ product — hidden until launch */ shieldPlus?: boolean }
export interface Service { icon: LucideIcon; title: string; text: string }

/** Products page content (MN + EN side by side). Flagship-system copy comes from the brochures (see lib/content/systems.ts). */
export function productsContent(lang: Lang) {
  const t = tr(lang);

  /** Capability highlights (no performance figures until confirmed). */
  const KPIS: Kpi[] = [
    { icon: Cpu, value: "AI", label: t("Хиймэл оюун ухаан", "Artificial intelligence"), caption: t("Дугаар, царай, дүрс таних", "Plate, face and object recognition") },
    { icon: Drone, value: t("Дрон", "Drones"), label: t("Агаараас хяналт", "Aerial monitoring"), caption: t("Том талбай, периметр", "Large sites and perimeters") },
    { icon: Cctv, value: "24/7", label: t("Ухаалаг камер", "Smart cameras"), caption: t("Бодит цагийн хяналт", "Real-time monitoring") },
    { icon: DoorClosed, value: "Access", label: t("Нэвтрэх хяналт", "Access control"), caption: t("Хаалга, турникет, зогсоол", "Doors, turnstiles, parking") },
  ];

  /** Services Shield Nirun offers today (independent of the Shield+ launch). */
  const SERVICES: Service[] = [
    {
      icon: Cctv, title: t("Хамгаалалтын камер суурилуулалт", "Security camera installation"),
      text: t(
        "Объектын онцлогт тохируулан камерын байршлыг тогтоож, AI ухаалаг камер болон бичлэгийн системийг угсарч тохируулна.",
        "We plan camera placement for your site, then install and configure AI smart cameras and the recording system.",
      ),
    },
    {
      icon: DoorClosed, title: t("Нэвтрэх хяналт & турникет", "Access control & turnstiles"),
      text: t(
        "Царай, карт, QR-аар нэвтрэх систем, турникет болон хаалганы контроллерийг суурилуулна.",
        "We install face, card and QR access systems, turnstiles and door controllers.",
      ),
    },
    {
      icon: Drone, title: t("Дрон хяналт", "Drone monitoring"),
      text: t(
        "Том талбай, периметрийг агаараас эргүүлж, нөхцөл байдлыг шуурхай үнэлнэ.",
        "Aerial patrols of large sites and perimeters with rapid situation assessment.",
      ),
    },
    {
      icon: ShieldCheck, title: t("Биет харуул хамгаалалт", "On-site security guards"),
      text: t(
        "Сургагдсан хамгаалалтын алба, эргүүл, төвлөрсөн хяналт болон шуурхай хариу арга хэмжээ.",
        "Trained security staff, patrols, central monitoring and rapid response.",
      ),
    },
    {
      icon: Network, title: t("Сүлжээ, кабелийн угсралт", "Network & cabling"),
      text: t(
        "Камер, хаалт, серверийн сүлжээний дэд бүтцийг угсарч, тасралтгүй ажиллагааг хангана.",
        "We build the network infrastructure for cameras, barriers and servers so everything stays online.",
      ),
    },
    {
      icon: Wrench, title: t("Засвар үйлчилгээ & дэмжлэг", "Maintenance & support"),
      text: t(
        "Системийг алсаас хянаж, тоног төхөөрөмжийн үзлэг, засвар үйлчилгээг тогтмол хийнэ.",
        "We monitor systems remotely and carry out regular equipment checks and maintenance.",
      ),
    },
  ];

  const PARKING = {
    description: t(
      "Камер машины дугаарыг таньж, орсон цагийг бүртгэнэ. Жолооч QR код уншуулаад QPay-аар төлж, хаалт автоматаар нээгдэнэ. Орлого, хөдөлгөөн, гүйлгээгээ нэг дэлгэцээс харна.",
      "Cameras recognise each vehicle's plate and log its entry time. Drivers scan a QR code, pay with QPay and the barrier opens automatically. Revenue, traffic and transactions are all on one screen.",
    ),
    features: [
      { icon: ScanLine, title: t("Дугаар таних", "Plate recognition"), text: t("Камер машины дугаарыг автоматаар уншина", "Cameras read plates automatically") },
      { icon: UserCheck, title: t("Эрхийг ялгах", "Access rights"), text: t("Гэрээт болон төлбөртэй машиныг ялгана", "Separates contract and paying vehicles") },
      { icon: QrCode, title: t("QR + QPay төлбөр", "QR + QPay payment"), text: t("Төлбөр баталгаажмагц хаалт нээгдэнэ", "The barrier opens once payment is confirmed") },
      { icon: ChartColumn, title: t("Тайлан", "Reports"), text: t("Орлого, дүүргэлт, гүйлгээг нэг дор", "Revenue, occupancy and transactions in one place") },
    ] satisfies Feature[],
  };

  const HOA = {
    description: t(
      "Оршин суугчийн гар утасны апп, СӨХ-ийн удирдлагын самбар, нэхэмжлэл ба хүсэлтийн урсгалыг нэг системд нэгтгэнэ. Мэдээлэл хоёр талд нэг төлөвөөр харагдана.",
      "Brings the resident mobile app, the HOA management dashboard, invoices and service requests into one system. Both sides always see the same status.",
    ),
    features: [
      {
        icon: ReceiptText, title: t("Нэхэмжлэл ба үлдэгдэл", "Invoices & balances"),
        text: t(
          "Оршин суугч тоотын нэхэмжлэл, үлдэгдэл, төлбөрийн түүхээ апп-аас харна. СӨХ баталгаажсан дүнг урьдчилан шалгаж оруулна.",
          "Residents see their unit's invoices, balance and payment history in the app. The HOA checks and enters confirmed amounts in advance.",
        ),
      },
      {
        icon: Wrench, title: t("Хүсэлт ба зарлал", "Requests & announcements"),
        text: t(
          "Засвар, үйлчилгээний хүсэлтийн явцыг хянаж, зарлал, санал асуулга, push мэдэгдлийг апп дотроос авна.",
          "Track repair and service requests, and receive announcements, polls and push notifications in the app.",
        ),
      },
      {
        icon: LayoutDashboard, title: t("Удирдлагын самбар", "Management dashboard"),
        text: t(
          "Байр, орц, тоот, Excel импорт, хүсэлт ба санхүүг СӨХ-ийн дарга веб самбараас удирдана.",
          "The HOA chair manages buildings, entrances, units, Excel imports, requests and finances from a web dashboard.",
        ),
      },
    ] satisfies Feature[],
  };

  const HARDWARE: HardwareCard[] = [
    {
      icon: Server, badge: "Hybrid Sync", title: "Local Server & Cloud Sync", footIcon: BadgeCheck, foot: t("Офлайн үед ч хадгална", "Keeps working offline"),
      text: t(
        "Объект дээрх локал сервер нь интернэт тасарсан үед ч хаалт, камер, бүртгэлийг хадгалж, холболт сэргэмэгц үүлэнд синк хийнэ.",
        "An on-site local server keeps barriers, cameras and records running even when the internet drops, then syncs to the cloud once the connection returns.",
      ),
      image: "/images/site/hw-server.webp",
      imageAlt: t("Серверийн тавиур", "Server rack"),
    },
    {
      icon: Lock, badge: t("Шифрлэлт", "Encryption"), title: t("Мэдээллийн Нууцлал & NDA", "Data Privacy & NDA"), footIcon: Gavel, foot: t("Хуулийн хатуу хамгаалалт", "Strong legal protection"),
      text: t(
        "Оршин суугчдын хувийн мэдээлэл, автомашины дугаар болон видео бичлэгийг шифрлэн хадгалж, нууцлалын гэрээгээр баталгаажуулна.",
        "Residents' personal data, licence plates and video recordings are stored encrypted and covered by a confidentiality agreement.",
      ),
      image: "/images/site/hw-security.webp",
      imageAlt: t("Кибер аюулгүй байдлын дүрслэл", "Cybersecurity illustration"),
    },
    {
      icon: BatteryCharging, badge: "24/7 Backup", title: t("UPS Тасралтгүй Тэжээл", "UPS Backup Power"), footIcon: Zap, foot: t("Тасралтгүй хэвийн ажиллагаа", "Uninterrupted operation"),
      text: t(
        "Цахилгаан тасарсан үед ч автомат хаалт, камер болон хяналтын системийг ажиллуулах нөөц тэжээл суурилуулна.",
        "We install backup power that keeps automatic barriers, cameras and the monitoring system running during power cuts.",
      ),
      image: "/images/site/hw-ups.webp",
      imageAlt: t("UPS нөөц тэжээлийн төхөөрөмж", "UPS backup power unit"),
    },
  ];

  const STEPS: Step[] = [
    {
      no: "01", title: t("Объектын судалгаа", "Site survey"), time: "",
      text: t(
        "Инженерүүд объектын орц гарц, кабель таталт, хамгаалах бүсийг газар дээр нь хэмжиж техникийн зөвлөмж боловсруулна.",
        "Our engineers measure entrances, cabling routes and the areas to protect on site, then prepare technical recommendations.",
      ),
    },
    {
      no: "02", title: t("Суурилуулалт & Тохиргоо", "Installation & Setup"), time: "",
      text: t(
        "Камер, хаалт, мэдрэгч болон серверийг угсарч, системийг объектын бодит нөхцөлд тохируулна.",
        "We install cameras, barriers, sensors and servers, and tune the system to real conditions on site.",
      ),
    },
    {
      no: "03", title: t("Сургалт & Системийн нээлт", "Training & Launch"), time: "",
      text: t(
        "Захиалагчийн ажилтан болон харуулын албанд системийн сургалт орж, ашиглалтад хүлээлгэн өгнө.",
        "We train your staff and security team, then hand the system over for daily use.",
      ),
    },
    {
      no: "04", title: t("24/7 Дэмжлэг & Арчлалт", "24/7 Support & Maintenance"), time: t("Байнгын дэмжлэг", "Ongoing support"), highlight: true,
      text: t(
        "Системийг алсаас тасралтгүй хянаж, тоног төхөөрөмжийн үзлэг, програмын шинэчлэлт, засвар үйлчилгээг тогтмол хийнэ.",
        "We monitor the system remotely around the clock and carry out regular equipment checks, software updates and maintenance.",
      ),
    },
  ];

  const QUOTE = t("Үнийн санал", "Custom quote");
  const PERIOD = t("/ объектоос хамаарна", "/ depends on the site");

  const TIERS: Tier[] = [
    {
      name: t("Суурь Багц", "Basic"), tag: t("СӨХ Дижитал", "Digital HOA"),
      audience: t("Жижиг орон сууц, 50-150 өрхтэй хотхонд тохиромжтой.", "For smaller residential buildings and complexes of 50–150 households."),
      price: QUOTE, period: PERIOD, cta: t("Суурь багц сонгох", "Choose Basic"),
      includes: [
        t("СӨХ-ийн санхүү удирдлагын систем", "HOA finance management system"),
        t("Оршин суугчийн гар утасны апп", "Resident mobile app"),
        t("Инженерийн засварын хүсэлтийн модуль", "Maintenance request module"),
        t("QPay авто нэхэмжлэх", "Automatic QPay invoices"),
      ],
      excludes: [t("ANPR Ухаалаг камер (багтаагүй)", "ANPR smart cameras (not included)"), t("Зогсоолын автомат хаалт (тусдаа)", "Automatic parking barriers (separate)")],
    },
    {
      name: t("Бизнес Багц", "Business"), tag: t("Ухаалаг Зогсоол + ANPR", "Smart Parking + ANPR"),
      audience: t("1-2 гарцтай дунд, том орон сууц, оффисын барилгад.", "For mid-size and large residential or office buildings with 1–2 gates."),
      price: QUOTE, period: PERIOD, cta: t("Бизнес багц захиалах", "Order Business"), featured: true,
      includes: [
        t("AI ANPR дугаар таних систем (2 гарц)", "AI ANPR plate recognition (2 gates)"),
        t("Ухаалаг автомат хаалт 2 иж бүрдэл", "2 smart automatic barrier sets"),
        t("QPay шууд төлбөр, зочны тариф", "Direct QPay payment, visitor rates"),
        t("Оршин суугчийн апп & СӨХ систем", "Resident app & HOA system"),
        t("24/7 UPS нөөц & инженерийн дэмжлэг", "24/7 UPS backup & engineering support"),
      ],
    },
    {
      name: t("Премиум Хотхон", "Premium Complex"), tag: t("Байгууллагын Цогц Шийдэл", "Complete Enterprise Solution"),
      audience: t("Олон орц гарцтай тансаг зэрэглэлийн хотхон, цогцолборт.", "For premium complexes and developments with many entrances and gates."),
      price: QUOTE, period: PERIOD, cta: t("Тусгай үнийн санал авах", "Request a tailored quote"),
      includes: [
        t("Ухаалаг зогсоол — олон гарцтай ANPR", "Smart parking — multi-gate ANPR"),
        t("СӨХ-ийн бүх модуль", "All HOA modules"),
        t("AI камер, дрон & царай таних орц", "AI cameras, drones & face-recognition entry"),
        t("Биет харуул хамгаалалтын алба", "On-site security guard service"),
        t("Тусгайлсан менежер & дэмжлэг", "Dedicated manager & support"),
      ],
    },
  ];

  const FAQS: Faq[] = [
    {
      shieldPlus: true,
      q: t("Авто зогсоолын камер шороо, цас, өвлийн улиралд дугаарыг таньж чадах уу?", "Can the parking cameras read plates through dust, snow and winter conditions?"),
      a: t(
        "Манай ANPR камерууд хэт улаан туяаны (IR) гэрэлтүүлэг, өвлийн нөхцөлд тохирсон хайрцаг болон AI алгоритм ашигладаг тул харанхуй, цас, тоос шороотой үед ч дугаарыг танихаар тохируулагддаг. Объект бүр дээр туршилт хийж тохиргоог нарийвчилна.",
        "Our ANPR cameras use infrared (IR) illumination, winter-ready housings and AI algorithms, and are configured to read plates in darkness, snow and dust. We test and fine-tune the setup at every site.",
      ),
    },
    {
      shieldPlus: true,
      q: t("Одоо байгаа хуучин авто хаалт болон домофон төхөөрөмж дээр системээ холбож болох уу?", "Can the system connect to our existing barriers and intercoms?"),
      a: t(
        "Ихэнх тохиолдолд боломжтой. Одоогийн хаалт техникийн хувьд хэвийн бол шинэ хаалт авалгүйгээр ухаалаг контроллер болон ANPR камераар тоноглож зардлыг хэмнэнэ. Инженер газар дээр нь үзэж нийцтэй эсэхийг тодорхойлно.",
        "In most cases, yes. If your current barrier is in good working order, we fit a smart controller and ANPR camera instead of replacing it, which saves cost. An engineer checks compatibility on site.",
      ),
    },
    {
      q: t("Дрон хяналтыг ямар объектод ашигладаг вэ?", "Where is drone monitoring used?"),
      a: t(
        "Том талбай, периметр, барилгын талбай, агуулахын бүс зэрэг газрын хяналтыг агаараас хурдан, үр ашигтай хийхэд дрон ашиглана. Нислэгийн хуваарь, хамрах бүсийг объектын онцлогт тохируулна.",
        "Drones monitor large areas such as perimeters, construction sites and warehouse zones quickly and efficiently from the air. Flight schedules and coverage are tailored to each site.",
      ),
    },
    {
      q: t("Шөнийн цагаар эсвэл амралтын өдрүүдэд гэмтэл гарвал хэрхэн шийдвэрлэх вэ?", "What happens if something breaks at night or on a weekend?"),
      a: t(
        "Систем алсаас хяналттай тул програм хангамжийн асуудлыг ихэвчлэн алсаас засна. Техник хангамжийн гэмтэлд манай инженер газар дээр нь очиж шийдвэрлэнэ. Дэмжлэгийн нөхцөлийг гэрээнд тусгана.",
        "Because the system is monitored remotely, software issues are usually fixed remotely. For hardware faults our engineer comes on site. Support terms are set out in the contract.",
      ),
    },
  ];

  /** Downloadable brochures (Mongolian only for now). The buttons appear only when the PDF exists in public/files/. */
  const BROCHURES = {
    parking: { href: "/files/shield-nirun-smart-parking.pdf", label: t("Ухаалаг зогсоолын танилцуулга", "Smart parking brochure") },
    hoa: { href: "/files/shield-nirun-smart-hoa.pdf", label: t("СӨХ-ийн системийн танилцуулга", "HOA system brochure") },
  };

  return { KPIS, SERVICES, PARKING, HOA, HARDWARE, STEPS, TIERS, FAQS, BROCHURES };
}
