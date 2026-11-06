import { requireUser } from "@/lib/admin/auth";
import { PageHeader, Panel, inputCls } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/action-form";
import { changeOwnPassword } from "./actions";
import { logout } from "@/app/admin/login/actions";
import { LogOut } from "lucide-react";

export const metadata = { title: "Миний бүртгэл" };

export default async function AccountPage() {
  const me = await requireUser();
  return (
    <>
      <PageHeader
        title="Миний бүртгэл"
        description={`${me.name} · ${me.email} · ${me.role === "ADMIN" ? "Админ" : "Редактор"}`}
        actions={
          <form action={logout}>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2.5 text-label-lg font-bold text-red-300 hover:bg-red-500/20">
              <LogOut className="h-4 w-4" /> Гарах
            </button>
          </form>
        }
      />
      <Panel title="Нууц үг солих" className="max-w-xl">
        <ActionForm action={changeOwnPassword} submit="Солих" className="flex flex-col gap-4">
          <div><label className="label" htmlFor="cur">Одоогийн нууц үг</label><input id="cur" name="current" type="password" autoComplete="current-password" required className={inputCls} /></div>
          <div><label className="label" htmlFor="nx">Шинэ нууц үг (10+ тэмдэгт)</label><input id="nx" name="next" type="password" autoComplete="new-password" minLength={10} required className={inputCls} /></div>
          <div><label className="label" htmlFor="cf">Шинэ нууц үг дахин</label><input id="cf" name="confirm" type="password" autoComplete="new-password" required className={inputCls} /></div>
        </ActionForm>
      </Panel>
    </>
  );
}
