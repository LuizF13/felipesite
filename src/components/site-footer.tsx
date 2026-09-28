import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div>
          <strong>{siteConfig.companyName}</strong>
          <br />
          Brasil ↔ Europa
        </div>

        <div className="footer-links">
          <Link href="/imoveis">Imóveis</Link>
          <Link href="/login">Área administrativa</Link>
          <span>CRECI [NÚMERO]</span>
        </div>
      </div>
    </footer>
  );
}
