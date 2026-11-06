import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { CONTACT } from "@/lib/content/site";
import { leaders as codeLeaders } from "@/lib/content/people";
import { productsContent } from "@/lib/content/products";
import { serviceIcon } from "@/lib/admin/icons";
import { tr, type Lang } from "@/lib/i18n";

/** Cache tag: admin saves call revalidateTag(SITE_TAG) so the public pages refresh. */
export const SITE_TAG = "site-content";

type Bi = { mn: string; en: string };
export interface SiteData {
  settings: {
    phone: string; email: string; building: string; district: Bi; city: Bi; mapUrl: string; lat: number; lng: number;
    brochureParking: string | null; brochureHoa: string | null;
  };
  leaders: { id: string; parentId: string | null; name: Bi; role: Bi; photo: string; photoPosition: string }[];
  services: { icon: string; title: Bi; text: Bi }[];
  faqs: { q: Bi; a: Bi; shieldPlus: boolean }[];
}

/** The site's built-in content — used before the database is seeded or if it is unreachable. */
function fallback(): SiteData {
  const [pmn, pen] = [productsContent("mn"), productsContent("en")];
  const [lmn, len] = [codeLeaders("mn"), codeLeaders("en")];
  const keys = ["cctv", "door", "drone", "shield", "network", "wrench"];
  return {
    settings: {
      phone: CONTACT.phone, email: CONTACT.email, building: CONTACT.building,
      district: { mn: CONTACT.district, en: "Sükhbaatar District" }, city: { mn: CONTACT.city, en: "Ulaanbaatar" },
      mapUrl: CONTACT.mapUrl, lat: CONTACT.lat, lng: CONTACT.lng,
      brochureParking: "/files/shield-nirun-smart-parking.pdf", brochureHoa: "/files/shield-nirun-smart-hoa.pdf",
    },
    leaders: lmn.map((l, i) => ({ id: `code-${i}`, parentId: i ? `code-${i - 1}` : null, name: { mn: l.name ?? "", en: len[i].name ?? "" }, role: { mn: l.role, en: len[i].role }, photo: l.photo, photoPosition: l.photoPosition ?? "center 30%" })),
    services: pmn.SERVICES.map((s, i) => ({ icon: keys[i] ?? "shield", title: { mn: s.title, en: pen.SERVICES[i].title }, text: { mn: s.text, en: pen.SERVICES[i].text } })),
    faqs: pmn.FAQS.map((f, i) => ({ q: { mn: f.q, en: pen.FAQS[i].q }, a: { mn: f.a, en: pen.FAQS[i].a }, shieldPlus: !!f.shieldPlus })),
  };
}

const load = unstable_cache(
  async (): Promise<SiteData | null> => {
    const [s, leaders, services, faqs] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: "site" } }),
      db.leader.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
      db.service.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
      db.faq.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    ]);
    if (!s) return null;
    return {
      settings: {
        phone: s.phone, email: s.email, building: s.building, district: { mn: s.districtMn, en: s.districtEn }, city: { mn: s.cityMn, en: s.cityEn },
        mapUrl: s.mapUrl, lat: s.lat, lng: s.lng, brochureParking: s.brochureParking, brochureHoa: s.brochureHoa,
      },
      leaders: leaders.map((l) => ({ id: l.id, parentId: l.parentId, name: { mn: l.nameMn, en: l.nameEn }, role: { mn: l.roleMn, en: l.roleEn }, photo: l.photo, photoPosition: l.photoPosition })),
      services: services.map((v) => ({ icon: v.icon, title: { mn: v.titleMn, en: v.titleEn }, text: { mn: v.textMn, en: v.textEn } })),
      faqs: faqs.map((f) => ({ q: { mn: f.questionMn, en: f.questionEn }, a: { mn: f.answerMn, en: f.answerEn }, shieldPlus: f.shieldPlus })),
    };
  },
  ["site-data-v2"],
  { tags: [SITE_TAG], revalidate: 300 },
);

export async function getSiteData(): Promise<SiteData> {
  try {
    return (await load()) ?? fallback();
  } catch (e) {
    console.error("getSiteData: database unavailable, using built-in content", e);
    return fallback();
  }
}

/** Contact details for one language (same shape the components used from CONTACT). */
export async function getContact(lang: Lang) {
  const { settings: s } = await getSiteData();
  const t = tr(lang);
  const district = t(s.district.mn, s.district.en);
  const city = t(s.city.mn, s.city.en);
  return {
    phone: s.phone,
    phoneHref: `tel:${s.phone.replace(/[^\d+]/g, "")}`,
    email: s.email,
    building: s.building,
    district,
    city,
    line: `${s.building}, ${district}, ${city}`,
    mapUrl: s.mapUrl,
    lat: s.lat,
    lng: s.lng,
    brochures: { parking: s.brochureParking, hoa: s.brochureHoa },
  };
}

export interface LeaderNode {
  id: string;
  name: string;
  role: string;
  photo: string;
  photoPosition: string;
  reports: LeaderNode[];
}

/**
 * Leaders as an org-chart forest (usually one root). Anyone whose manager is hidden or missing
 * becomes a root, so hiding a person never hides the people below them. Siblings keep the admin order.
 */
export async function getLeaderTree(lang: Lang): Promise<LeaderNode[]> {
  const t = tr(lang);
  const list = (await getSiteData()).leaders;
  const ids = new Set(list.map((l) => l.id));
  const node = new Map<string, LeaderNode>(
    list.map((l) => [l.id, { id: l.id, name: t(l.name.mn, l.name.en), role: t(l.role.mn, l.role.en), photo: l.photo, photoPosition: l.photoPosition, reports: [] }]),
  );
  const roots: LeaderNode[] = [];
  for (const l of list) {
    const parent = l.parentId && ids.has(l.parentId) ? node.get(l.parentId) : undefined;
    (parent ? parent.reports : roots).push(node.get(l.id)!);
  }
  return roots;
}

/** Flat list in org-chart order (top first, then each level). */
export async function getLeaders(lang: Lang) {
  const out: Omit<LeaderNode, "reports">[] = [];
  const queue = await getLeaderTree(lang);
  while (queue.length) {
    const { reports, ...n } = queue.shift()!;
    out.push(n);
    queue.push(...reports);
  }
  return out;
}

export async function getServices(lang: Lang) {
  const t = tr(lang);
  return (await getSiteData()).services.map((s) => ({ icon: serviceIcon(s.icon), title: t(s.title.mn, s.title.en), text: t(s.text.mn, s.text.en) }));
}

export async function getFaqs(lang: Lang) {
  const t = tr(lang);
  return (await getSiteData()).faqs.map((f) => ({ q: t(f.q.mn, f.q.en), a: t(f.a.mn, f.a.en), shieldPlus: f.shieldPlus }));
}
