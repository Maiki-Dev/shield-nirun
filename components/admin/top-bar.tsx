import Link from "next/link";
import { Clock3, Search, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";

/** Top bar from the Framer design: logo, search, live status pills, signed-in user. */
export function TopBar({ user, newLeads, inProgress }: { user: { name: string; role: "ADMIN" | "EDITOR" }; newLeads: number; inProgress: number }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-4 pb-2 pt-5 sm:px-8 lg:px-10">
      <Logo className="h-11 sm:h-12" href="/admin" />
      <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
        <form action="/admin/leads" className="group relative hidden md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink" />
          <input
            name="q"
            aria-label="Хүсэлт хайх"
            placeholder="Хайх…"
            className="h-11 w-11 rounded-2xl border border-line bg-soft pl-10 text-body-sm text-ink outline-none transition-[width] duration-300 placeholder:text-transparent focus:w-64 focus:border-accent focus:placeholder:text-muted"
          />
        </form>
        <Link href="/admin/leads?status=NEW" className="inline-flex h-11 items-center gap-2 rounded-2xl border border-line px-4 text-body-sm text-muted hover:border-accent/50">
          <ShieldCheck className="h-[18px] w-[18px] text-ink" />
          <span className="font-semibold text-ink">{newLeads}</span> шинэ хүсэлт
        </Link>
        <Link href="/admin/leads?status=IN_PROGRESS" className="hidden h-11 items-center gap-2 rounded-2xl border border-line px-4 text-body-sm text-muted hover:border-accent/50 sm:inline-flex">
          <Clock3 className="h-[18px] w-[18px]" /> {inProgress} хийгдэж буй
        </Link>
        <Link href="/admin/account" className="ml-2 text-right leading-tight">
          <span className="block text-body-sm font-semibold text-ink">{user.name}</span>
          <span className="text-label-sm text-accent">{user.role === "ADMIN" ? "Администратор" : "Редактор"}</span>
        </Link>
      </div>
    </header>
  );
}
