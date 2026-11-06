import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { currentUser } from "@/lib/admin/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Нэвтрэх" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-12" href="/" />
        </div>
        <div className="card p-7 shadow-[0_30px_60px_-30px_rgba(11,25,44,0.25)]">
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink">Удирдлагын хэсэг</h1>
          <p className="mb-6 mt-1 text-body-sm text-muted">Ажилтны бүртгэлээрээ нэвтэрнэ үү.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
