import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  return (
    <header className={solid ? "site-header site-header-solid" : "site-header"}>
      <div className="container nav">
        <Link href="/" className="brand" aria-label="Hope Business - início">
          <BrandLogo />
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
