import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader solid />
      <main className="thank-you">
        <div className="container narrow">
          <p className="eyebrow dark">404</p>
          <h1 className="section-title">Página não encontrada.</h1>
          <p className="lead">O conteúdo pode ter sido removido ou ainda não está publicado.</p>
          <div className="hero-actions">
            <Link href="/" className="button button-dark">Voltar ao início</Link>
            <Link href="/imoveis" className="button button-outline">Ver imóveis</Link>
          </div>
        </div>
      </main>
    </>
  );
}
