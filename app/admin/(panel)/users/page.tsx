import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { PageHeader, Panel, fmtDate, inputCls } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/action-form";
import { createUser, resetPassword, updateUser } from "./actions";

export const metadata = { title: "Хэрэглэгчид" };

export default async function UsersPage() {
  const me = await requireUser("ADMIN");
  const users = await db.user.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] });
  return (
    <>
      <PageHeader title="Хэрэглэгчид" description="Админ: бүх хэсэг, хэрэглэгч удирдана. Редактор: хүсэлт, контент, файл." />
      <div className="flex flex-col gap-4">
        {users.map((u) => (
          <Panel key={u.id} title={`${u.name}${u.id === me.id ? " (та)" : ""}`} actions={<span className="text-label-sm text-muted">{u.email} · сүүлд нэвтэрсэн: {u.lastLoginAt ? fmtDate(u.lastLoginAt) : "—"}</span>}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ActionForm action={updateUser.bind(null, u.id)} submit="Хадгалах" className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <select name="role" defaultValue={u.role} className={`${inputCls} !w-44`} aria-label="Эрх">
                    <option value="ADMIN">Админ</option>
                    <option value="EDITOR">Редактор</option>
                  </select>
                  <label className="flex items-center gap-2 text-body-sm font-semibold text-ink2">
                    <input name="active" type="checkbox" defaultChecked={u.active} className="h-4 w-4 accent-brand" /> Идэвхтэй
                  </label>
                </div>
              </ActionForm>
              <ActionForm action={resetPassword.bind(null, u.id)} submit="Нууц үг солих" className="flex flex-col gap-3">
                <input name="password" type="password" autoComplete="new-password" minLength={10} required placeholder="Шинэ нууц үг (10+ тэмдэгт)" className={inputCls} aria-label="Шинэ нууц үг" />
              </ActionForm>
            </div>
          </Panel>
        ))}

        <Panel title="Шинэ хэрэглэгч нэмэх" className="outline-dashed outline-1 outline-line">
          <ActionForm action={createUser} submit="Нэмэх" className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div><label className="label" htmlFor="nu-name">Нэр</label><input id="nu-name" name="name" required className={inputCls} /></div>
            <div><label className="label" htmlFor="nu-email">И-мэйл</label><input id="nu-email" name="email" type="email" required className={inputCls} /></div>
            <div>
              <label className="label" htmlFor="nu-role">Эрх</label>
              <select id="nu-role" name="role" defaultValue="EDITOR" className={inputCls}><option value="EDITOR">Редактор</option><option value="ADMIN">Админ</option></select>
            </div>
            <div><label className="label" htmlFor="nu-pw">Түр нууц үг (10+ тэмдэгт)</label><input id="nu-pw" name="password" type="password" autoComplete="new-password" minLength={10} required className={inputCls} /></div>
          </ActionForm>
        </Panel>
      </div>
    </>
  );
}
