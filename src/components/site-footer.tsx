import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { BusinessChat } from "@/components/business-chat";
import { BusinessStatus } from "@/components/business-status";
import { siteConfig } from "@/lib/config";

function companyValue(value: string) {
  return value || "A informar";
}

export function SiteFooter() {
  const phone = siteConfig.phone || siteConfig.whatsapp;

  return (
    <>
      <footer className="site-footer site-footer-rich">
        <div className="container footer-main">
          <div className="footer-brand-column">
            <BrandLogo className="footer-logo" />
            <p>
              Consultoria e oportunidades imobiliárias no Brasil para quem vive
              fora do país.
            </p>
            <BusinessStatus />
          </div>

          <div className="footer-column">
            <strong>Navegação</strong>
            <Link href="/">Início</Link>
            <Link href="/imoveis">Imóveis</Link>
            <Link href="/#regiao">Região</Link>
            <Link href="/#contato">Fale conosco</Link>
          </div>

          <div className="footer-column">
            <strong>Contato</strong>
            <span>Telefone: {companyValue(phone)}</span>
            <span>E-mail: {companyValue(siteConfig.email)}</span>
            <span>Endereço: {companyValue(siteConfig.address)}</span>
            <span>CEP: {companyValue(siteConfig.cep)}</span>
          </div>

          <div className="footer-column">
            <strong>Empresa</strong>
            <span>CNPJ: {companyValue(siteConfig.cnpj)}</span>
            <span>CRECI/SC: {siteConfig.creci}</span>
            <span>Segunda a sexta: 09:00–17:00</span>
            <span>Sábado e domingo: Fechado</span>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.companyName}. Todos os direitos reservados.</span>
          <Link href="/login">Área administrativa</Link>
        </div>
      </footer>

      <BusinessChat />
    </>
  );
}
