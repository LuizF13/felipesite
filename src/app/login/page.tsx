import Link from "next/link";
import { login } from "@/app/login/actions";
import { isSupabaseConfigured } from "@/lib/config";
import { SiteHeader } from "@/components/site-header";

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <>
      <SiteHeader solid />
      <main className="login-page">
        <div className="login-card">
          <p className="eyebrow dark">Área administrativa</p>
          <h1>Painel da imobiliária</h1>

          {!isSupabaseConfigured ? (
            <div className="setup-box">
              <strong>Modo demonstração</strong>
              <p>
                O Supabase ainda não foi conectado. Você pode abrir o painel
                demonstrativo agora; as mutações reais serão ativadas assim que
                as variáveis de ambiente e o banco forem configurados.
              </p>
              <Link className="button button-dark" href="/admin">
                Abrir painel demonstrativo →
              </Link>
            </div>
          ) : (
            <form action={login} className="login-form">
              {params.error ? (
                <p className="form-error">
                  {params.error === "not-admin"
                    ? "Este usuário não possui permissão administrativa."
                    : "E-mail ou senha inválidos."}
                </p>
              ) : null}

              <label>
                <span>E-mail</span>
                <input name="email" type="email" required autoComplete="email" />
              </label>

              <label>
                <span>Senha</span>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </label>

              <button className="button button-dark" type="submit">
                Entrar →
              </button>
            </form>
          )}

          <Link className="back-link" href="/">
            ← Voltar ao site
          </Link>
        </div>
      </main>
    </>
  );
}
