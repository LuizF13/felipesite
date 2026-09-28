import type { Metadata } from "next";
import { PropertyCatalog } from "@/components/property-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Imóveis",
};

export default async function PropertiesPage() {
  const properties = await getPublishedProperties();

  return (
    <>
      <SiteHeader solid />

      <main>
        <section className="inner-hero">
          <div className="container">
            <p className="eyebrow dark">Imóveis</p>
            <h1 className="section-title">
              Encontre a oportunidade que combina com o seu momento.
            </h1>
            <p className="lead">
              Comece digitando o nome de um empreendimento, cidade ou bairro. As
              sugestões aparecem enquanto você escreve e os filtros atualizam o
              catálogo imediatamente.
            </p>
          </div>
        </section>

        <section className="catalog-section">
          <div className="container">
            <PropertyCatalog properties={properties} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
