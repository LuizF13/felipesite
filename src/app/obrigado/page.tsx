import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/config";

type SearchParams = Promise<{ demo?: string }>;

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const message =
    "Olá! Acabei de enviar meus dados pelo site e gostaria de continuar o atendimento.";

  return (
    <>
      <SiteHeader solid />
      <main>
        <section className="thank-you">
          <div className="container narrow">
            <p className="eyebrow dark">Recebido</p>
            <h1 className="section-title">Obrigado pelo contato.</h1>
            <p className="lead">
              {params.demo
                ? "O site está em modo demonstração porque o Supabase ainda não foi conectado. O fluxo final já está preparado."
                : "Seus dados foram enviados para a equipe. Você também pode continuar a conversa pelo WhatsApp."}
            </p>

            <div className="hero-actions">
              <a
                className="button button-dark"
                target="_blank"
                rel="noreferrer"
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`}
              >
                Continuar no WhatsApp →
              </a>
              <Link className="button button-outline" href="/imoveis">
                Ver imóveis
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
