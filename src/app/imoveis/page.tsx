import type { Metadata } from "next";
import { PropertyCard } from "@/components/property-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Imóveis",
};

type SearchParams = Promise<{
  q?: string;
  city?: string;
  type?: string;
  status?: string;
}>;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const all = await getPublishedProperties();

  const query = (params.q || "").toLowerCase();
  const city = params.city || "";
  const type = params.type || "";
  const status = params.status || "";

  const filtered = all.filter((property) => {
    const matchesQuery =
      !query ||
      property.name.toLowerCase().includes(query) ||
      property.city.toLowerCase().includes(query) ||
      (property.neighborhood || "").toLowerCase().includes(query);

    return (
      matchesQuery &&
      (!city || property.city === city) &&
      (!type || property.property_type === type) &&
      (!status || property.status === status)
    );
  });

  const cities = [...new Set(all.map((property) => property.city))].sort();
  const types = [...new Set(all.map((property) => property.property_type))].sort();

  return (
    <>
      <SiteHeader solid />

      <main>
        <section className="inner-hero">
          <div className="container">
            <p className="eyebrow dark">Imóveis</p>
            <h1 className="section-title">
              Oportunidades imobiliárias selecionadas para você.
            </h1>
            <p className="lead">
              Filtre por cidade, tipo e status. Imóveis vendidos podem continuar
              públicos como histórico, sem serem apresentados como disponíveis.
            </p>
          </div>
        </section>

        <section className="catalog-section">
          <div className="container">
            <form className="filters">
              <input
                type="search"
                name="q"
                defaultValue={params.q}
                placeholder="Buscar imóvel..."
              />

              <select name="city" defaultValue={city}>
                <option value="">Todas as cidades</option>
                {cities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select name="type" defaultValue={type}>
                <option value="">Todos os tipos</option>
                {types.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select name="status" defaultValue={status}>
                <option value="">Todos os status</option>
                <option value="available">Disponível</option>
                <option value="reserved">Reservado</option>
                <option value="sold">Vendido</option>
              </select>

              <button className="button button-dark" type="submit">
                Filtrar
              </button>
            </form>

            <p className="catalog-count">{filtered.length} imóvel(is) encontrado(s)</p>

            {filtered.length ? (
              <div className="property-grid">
                {filtered.map((property) => (
                  <PropertyCard property={property} key={property.id} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                Nenhum imóvel encontrado com os filtros selecionados.
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
