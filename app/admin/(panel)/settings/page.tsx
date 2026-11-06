import { db } from "@/lib/db";
import { PageHeader, Panel } from "@/components/admin/ui";
import { SettingsForm } from "./settings-form";

export const metadata = { title: "Тохиргоо" };

export default async function SettingsPage() {
  const [s, media] = await Promise.all([
    db.siteSettings.findUniqueOrThrow({ where: { id: "site" } }),
    db.media.findMany({ where: { mime: "application/pdf" }, orderBy: { createdAt: "desc" }, select: { storedName: true, original: true } }),
  ]);
  const pdfs = [
    ...media.map((m) => ({ value: `/media/${m.storedName}`, label: `${m.original} (оруулсан)` })),
    { value: "/files/shield-nirun-smart-parking.pdf", label: "shield-nirun-smart-parking.pdf (анхны)" },
    { value: "/files/shield-nirun-smart-hoa.pdf", label: "shield-nirun-smart-hoa.pdf (анхны)" },
  ];
  const values = Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v === null ? "" : String(v)]));
  return (
    <>
      <PageHeader title="Тохиргоо" description="Сайтын бүх хуудсанд харагдах холбоо барих мэдээлэл болон татаж авах танилцуулгууд." />
      <Panel>
        <SettingsForm values={values} pdfs={pdfs} />
      </Panel>
    </>
  );
}
