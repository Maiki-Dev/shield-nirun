/**
 * Seeds the database from the site's current hard-coded content, so the admin starts with exactly
 * what the site shows today. Safe to re-run: existing rows are left alone.
 * First admin: set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in the environment (only used if no users exist).
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { CONTACT } from "../lib/content/site";
import { leaders } from "../lib/content/people";
import { productsContent } from "../lib/content/products";

const db = new PrismaClient();
const SERVICE_KEYS = ["cctv", "door", "drone", "shield", "network", "wrench"]; // same order as the current list

async function main() {
  await db.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      phone: CONTACT.phone,
      email: CONTACT.email,
      building: CONTACT.building,
      districtMn: CONTACT.district,
      districtEn: "Sükhbaatar District",
      cityMn: CONTACT.city,
      cityEn: "Ulaanbaatar",
      mapUrl: CONTACT.mapUrl,
      lat: CONTACT.lat,
      lng: CONTACT.lng,
      brochureParking: "/files/shield-nirun-smart-parking.pdf",
      brochureHoa: "/files/shield-nirun-smart-hoa.pdf",
    },
  });

  if ((await db.leader.count()) === 0) {
    const mn = leaders("mn");
    const en = leaders("en");
    // Created one by one so each person can report to the previous one (General Director → CEO).
    let parentId: string | null = null;
    for (const [i, l] of mn.entries()) {
      const row: { id: string } = await db.leader.create({
        data: {
          nameMn: l.name ?? "", nameEn: en[i].name ?? "", roleMn: l.role, roleEn: en[i].role,
          photo: l.photo, photoPosition: l.photoPosition ?? "center 30%", sortOrder: i, parentId,
        },
      });
      parentId = row.id;
    }
  }

  if ((await db.service.count()) === 0) {
    const mn = productsContent("mn").SERVICES;
    const en = productsContent("en").SERVICES;
    await db.service.createMany({
      data: mn.map((s, i) => ({ icon: SERVICE_KEYS[i] ?? "shield", titleMn: s.title, titleEn: en[i].title, textMn: s.text, textEn: en[i].text, sortOrder: i })),
    });
  }

  if ((await db.faq.count()) === 0) {
    const mn = productsContent("mn").FAQS;
    const en = productsContent("en").FAQS;
    await db.faq.createMany({
      data: mn.map((f, i) => ({ questionMn: f.q, questionEn: en[i].q, answerMn: f.a, answerEn: en[i].a, shieldPlus: !!f.shieldPlus, sortOrder: i })),
    });
  }

  if ((await db.user.count()) === 0) {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn("No users yet: set ADMIN_EMAIL and ADMIN_PASSWORD, then run `npm run db:seed` again to create the first admin.");
    } else if (ADMIN_PASSWORD.length < 10) {
      throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
    } else {
      await db.user.create({
        data: { email: ADMIN_EMAIL.toLowerCase(), name: ADMIN_NAME ?? "Admin", role: "ADMIN", passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12) },
      });
      console.log(`Created first admin: ${ADMIN_EMAIL}`);
    }
  }
  console.log("Seed complete.");
}

main().finally(() => db.$disconnect());
