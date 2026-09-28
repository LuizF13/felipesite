import Link from "next/link";
import { logout } from "@/app/login/actions";
import { siteConfig } from "@/lib/config";

export function AdminNav({ demo = false }: { demo?: boolean }) {
  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-brand">
          {siteConfig.companyName}
          <span>Painel</span>
        </div>

        {demo ? <div className="demo-pill">Modo demo</div> : null}

        <nav className="admin-menu">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/imoveis">Imóveis</Link>
          <Link href="/admin/imoveis/novo">+ Novo imóvel</Link>
          <Link href="/admin/leads">Leads</Link>
          <Link href="/" target="_blank">
            Abrir site ↗
          </Link>
        </nav>
      </div>

      {!demo ? (
        <form action={logout}>
          <button className="admin-logout" type="submit">
            Sair
          </button>
        </form>
      ) : null}
    </aside>
  );
}
