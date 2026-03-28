import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/session";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) || {};
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="admin-login-shell">
      <div className="admin-login-card">
        <span className="admin-chip">Ice Retro CMS</span>
        <h1>Painel de conteúdo e operação</h1>
        <p>
          Entre para editar o cardápio, os destaques da home, os depoimentos e acompanhar os
          leads enviados pelo site.
        </p>

        <form action={loginAction} className="admin-login-form">
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" placeholder="admin@iceretro.com" required />
          </label>

          <label className="field">
            <span>Senha</span>
            <input name="password" type="password" placeholder="Sua senha" required />
          </label>

          <button className="button full-width" type="submit">
            Entrar no CMS
          </button>

          {params.error ? <p className="form-feedback">{params.error}</p> : null}
        </form>
      </div>
    </main>
  );
}
