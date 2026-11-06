"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, Moon, Phone, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/ui/logo";
import { navItems, type NavItem } from "@/lib/content/site";
import { useLang } from "@/components/lang-provider";
import { localize, splitPath } from "@/lib/i18n";

/** Switches to the same page in the other language (keeps the #hash). */
function LangSwitch() {
  const { lang, t } = useLang();
  const pathname = usePathname();
  const [, path] = splitPath(pathname);
  const [hash, setHash] = useState("");
  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);

  return (
    <div role="group" aria-label={t("Хэл сонгох", "Choose language")} className="inline-flex items-center rounded-full border border-line bg-soft p-0.5">
      {(["mn", "en"] as const).map((l) => (
        <Link
          key={l}
          href={localize(l, path) + hash}
          hrefLang={l}
          lang={l}
          scroll={false}
          aria-current={lang === l ? "true" : undefined}
          aria-label={l === "mn" ? "Монгол хэл" : "English"}
          className={`rounded-full px-2.5 py-1 text-label-sm uppercase transition-colors ${
            lang === l ? "bg-card text-accent shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { t } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("Цайвар горим руу шилжих", "Switch to light mode") : t("Бараан горим руу шилжих", "Switch to dark mode")}
      className="relative inline-flex items-center gap-1 rounded-full border border-line bg-soft p-1 transition-colors hover:border-brand/40"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`absolute top-1 h-7 w-7 rounded-full bg-card shadow-sm ${isDark ? "left-[33px]" : "left-1"}`}
      />
      <span className={`relative grid h-7 w-7 place-items-center ${isDark ? "text-muted" : "text-amber-500"}`}>
        <Sun className="h-4 w-4" />
      </span>
      <span className={`relative grid h-7 w-7 place-items-center ${isDark ? "text-brand-light" : "text-muted"}`}>
        <Moon className="h-4 w-4" />
      </span>
    </button>
  );
}

function NavDropdown({ item, mobile, isActive, onNavigate }: {
  item: NavItem;
  mobile?: boolean;
  isActive: (path: string) => boolean;
  onNavigate?: () => void;
}) {
  const { href } = useLang();
  const id = useId();
  const reduceMotion = useReducedMotion();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const active = item.children?.some((child) => isActive(child.href));

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !trigger.current?.parentElement?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 transition-colors ${
          mobile ? "w-full justify-between rounded-xl px-4 py-3 text-body-md font-semibold" : "whitespace-nowrap rounded-full px-2.5 py-2 text-label-lg xl:px-3.5"
        } ${active ? "font-bold text-accent" : mobile ? "text-ink hover:bg-soft" : "text-muted hover:text-ink"}`}
      >
        {item.label}
        <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
        {active && !mobile && (
          <motion.span layoutId="nav-underline" className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-brand xl:inset-x-3.5" />
        )}
      </button>
      {open && (
        <motion.div
          id={id}
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`overflow-hidden ${mobile ? "ml-4 border-l border-line pl-2" : "absolute left-0 top-full z-10 mt-2 min-w-48 rounded-xl border border-line bg-card shadow-lg"}`}
        >
          <div className="grid gap-1 p-1.5">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={href(child.href)}
                aria-current={isActive(child.href) ? "page" : undefined}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-body-sm ${
                  isActive(child.href) ? "bg-brand/10 font-semibold text-accent" : "text-ink hover:bg-soft"
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function Navbar() {
  const { lang, t, href } = useLang();
  const pathname = splitPath(usePathname())[1];
  const NAV_ITEMS = navItems(lang);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) window.__snLenis?.stop();
    else window.__snLenis?.start();
    return () => {
      document.body.style.overflow = "";
      window.__snLenis?.start();
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // Every page opens on a dark hero: transparent bar with dark-theme tokens (scoped via the `dark` class) until scrolled.
  const onDark = !scrolled && !open;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
        onDark
          ? "dark border-transparent bg-transparent"
          : scrolled || open
            ? "border-line bg-card/85 shadow-[0_1px_8px_rgba(11,28,48,0.06)] backdrop-blur-xl"
            : "border-transparent bg-card/60 backdrop-blur-xl"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-3">
        <Logo className="h-10 sm:h-12" href={href("/")} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t("Үндсэн цэс", "Main menu")}>
          {NAV_ITEMS.map((item) => {
            if (item.children) return <NavDropdown key={item.href} item={item} isActive={isActive} />;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={href(item.href)}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-label-lg transition-colors xl:px-3.5 ${
                  active ? "font-bold text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
                {active && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-brand xl:inset-x-3.5" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LangSwitch />
          </div>
          <ThemeToggle />
          <Link href={href("/contact")} className="btn-primary hidden whitespace-nowrap !px-5 !py-2.5 xl:inline-flex">
            <Phone className="h-4 w-4" />
            {t("Зөвлөгөө авах", "Get advice")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("Цэс хаах", "Close menu") : t("Цэс нээх", "Open menu")}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-ink lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-line backdrop-blur-md lg:hidden"
          >
            <nav className="container-x flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto py-4" aria-label={t("Гар утасны цэс", "Mobile menu")}>
              {NAV_ITEMS.map((item) => {
                if (item.children) {
                  return <NavDropdown key={item.href} item={item} mobile isActive={isActive} onNavigate={() => setOpen(false)} />;
                }
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={href(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 text-body-md font-semibold ${
                      active ? "bg-brand/10 text-accent" : "text-ink hover:bg-soft"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 px-1 sm:hidden">
                <LangSwitch />
              </div>
              <Link href={href("/contact")} className="btn-primary mt-3">
                <Phone className="h-4 w-4" />
                {t("Холбогдох / Зөвлөгөө авах", "Contact / Get advice")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
