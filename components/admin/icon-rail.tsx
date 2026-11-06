"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, ClipboardList, FileText, Images, Inbox, LayoutDashboard, LogOut, Newspaper, Settings, UserCog, Users, type LucideIcon } from "lucide-react";
import { logout } from "@/app/admin/login/actions";

type Item = { href: string; label: string; icon: LucideIcon; exact?: boolean; badge?: number };

function RailLink({ it, active }: { it: Item; active: boolean }) {
  return (
    <Link
      href={it.href}
      aria-label={it.label}
      aria-current={active ? "page" : undefined}
      className={`group relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition-colors lg:h-11 lg:w-11 ${
        active ? "bg-accent/15 text-accent" : "text-muted hover:bg-soft hover:text-ink"
      }`}
    >
      <it.icon className="h-[21px] w-[21px]" strokeWidth={1.8} />
      {!!it.badge && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-card" />}
      {/* tooltip (desktop) */}
      <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-soft2 px-2.5 py-1 text-label-md font-semibold text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
        {it.label}
      </span>
    </Link>
  );
}

/** Rounded icon rail (desktop) / bottom bar (mobile) from the Framer design. */
export function IconRail({ isAdmin, newLeads, newApplications }: { isAdmin: boolean; newLeads: number; newApplications: number }) {
  const pathname = usePathname();
  const top: Item[] = [
    { href: "/admin", label: "Тойм", icon: LayoutDashboard, exact: true },
    { href: "/admin/leads", label: "Хүсэлтүүд", icon: Inbox, badge: newLeads },
    { href: "/admin/news", label: "Мэдээ", icon: Newspaper },
    { href: "/admin/careers", label: "Ажлын анкет", icon: BriefcaseBusiness, badge: newApplications },
    { href: "/admin/surveys", label: "Санал асуулга", icon: ClipboardList },
    { href: "/admin/content", label: "Контент", icon: FileText },
    { href: "/admin/media", label: "Файл & зураг", icon: Images },
    ...(isAdmin ? [{ href: "/admin/users", label: "Хэрэглэгчид", icon: Users }] : []),
  ];
  const bottom: Item[] = [
    { href: "/admin/settings", label: "Тохиргоо", icon: Settings },
    { href: "/admin/account", label: "Миний бүртгэл", icon: UserCog },
  ];
  const on = (it: Item) => (it.exact ? pathname === it.href : pathname === it.href || pathname.startsWith(`${it.href}/`));

  return (
    <nav
      aria-label="Удирдлагын цэс"
      className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-1 overflow-x-auto rounded-[24px] [scrollbar-width:none] lg:overflow-visible bg-card/95 p-2 shadow-2xl backdrop-blur lg:sticky lg:inset-x-auto lg:bottom-auto lg:top-6 lg:h-[calc(100vh-7.5rem)] lg:w-16 lg:flex-col lg:justify-start lg:gap-2 lg:rounded-[28px] lg:px-2.5 lg:py-4 lg:shadow-none"
    >
      {top.map((it) => <RailLink key={it.href} it={it} active={on(it)} />)}
      <div className="hidden flex-1 lg:block" />
      {bottom.map((it) => <RailLink key={it.href} it={it} active={on(it)} />)}
      <form action={logout} className="hidden lg:block">
        <button type="submit" aria-label="Гарах" title="Гарах" className="grid h-11 w-11 place-items-center rounded-2xl text-muted transition-colors hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="h-[20px] w-[20px]" strokeWidth={1.8} />
        </button>
      </form>
    </nav>
  );
}
