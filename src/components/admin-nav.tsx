import Link from "next/link";
import { logout } from "@/app/login/actions";
import { AppIcon } from "@/components/app-icon";
import { siteConfig } from "@/lib/config";

export function AdminNav({ demo = false }: { demo?: boolean }) {
  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-brand">
          {siteConfig.companyName}
          <span>Gestão imobiliária</span>
        </div>

        {demo ? <div className="demo-pill">Modo demo</div> : null}

        <p className="admin-menu-label">Painel</p>

        <nav className="admin-menu">
          <Link href="/admin">
            <AppIcon name="dashboard" size={18} />
            <span>Dashboard</span>
          </Link>

          <Link href="/admin/imoveis">
            <AppIcon name="building" size={18} />
            <span>Imóveis</span>
          </Link>

          <Link href="/admin/imoveis/novo">
            <AppIcon name="plus" size={18} />
            <span>Novo imóvel</span>
          </Link>

          <Link href="/admin/leads">
            <AppIcon name="users" size={18} />
            <span>Leads</span>
          </Link>

          <Link href="/" target="_blank">
            <AppIcon name="external" size={18} />
            <span>Abrir site</span>
          </Link>
        </nav>
      </div>

      {!demo ? (
        <form action={logout}>
          <button className="admin-logout" type="submit">
            <AppIcon name="logout" size={18} />
            <span>Sair</span>
          </button>
        </form>
      ) : null}
    </aside>
  );
}
