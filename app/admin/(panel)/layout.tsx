import { TopBar } from "@/components/admin/top-bar";
import { IconRail } from "@/components/admin/icon-rail";
import { requireUser } from "@/lib/admin/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).replace(/-/g, ".");

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [newLeads, inProgress, newApplications] = await Promise.all([
    db.lead.count({ where: { status: "NEW" } }),
    db.lead.count({ where: { status: "IN_PROGRESS" } }),
    db.jobApplication.count({ where: { status: "NEW" } }),
  ]);
  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col">
      <TopBar user={user} newLeads={newLeads} inProgress={inProgress} />
      <div className="flex flex-1 gap-6 px-4 pb-28 pt-4 sm:px-8 lg:gap-8 lg:px-10 lg:pb-6">
        <IconRail isAdmin={user.role === "ADMIN"} newLeads={newLeads} newApplications={newApplications} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <footer className="hidden items-center gap-10 px-10 pb-6 text-label-sm uppercase tracking-wider text-muted lg:flex">
        <span>Shield Nirun / Удирдлагын нэгдсэн систем</span>
        <span>{today()} · Улаанбаатар</span>
      </footer>
    </div>
  );
}
