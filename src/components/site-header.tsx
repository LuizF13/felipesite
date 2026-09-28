import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  return (
    <header className={solid ? "site-header site-header-solid" : "site-header"}>
      <div className="container nav">
        <Link href="/" className="brand">
          {siteConfig.companyName}
        </Link>

        <nav className="nav-links" aria-label="Navegação principal">
          <Link href="/#regiao">A região</Link>
          <Link href="/imoveis">Imóveis</Link>
          <Link href="/#como-funciona">Como funciona</Link>
          <Link href="/#contato" className="button button-light">
            Falar com a equipe
          </Link>
        </nav>
      </div>
    </header>
  );
}
