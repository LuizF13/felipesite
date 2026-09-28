import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice, statusLabel } from "@/lib/format";
import { getPropertyBySlug } from "@/lib/properties";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  return {
    title: property?.name || "Imóvel",
    description:
      property?.description ||
      "Conheça esta oportunidade imobiliária selecionada pela nossa equipe.",
  };
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  const images =
    property.property_images?.length
      ? [...property.property_images]
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((image) => image.url)
      : property.cover_image_url
        ? [property.cover_image_url]
        : [];

  return (
    <>
      <SiteHeader solid />

      <main>
        <section className="property-detail-head">
          <div className="container">
            <Link className="back-link" href="/imoveis">
              ← Voltar aos imóveis
            </Link>

            <div className="detail-title-row">
              <div>
                <p className="eyebrow dark">
                  {property.city}
                  {property.neighborhood ? ` · ${property.neighborhood}` : ""}
                </p>
                <h1 className="section-title">{property.name}</h1>
              </div>

              <span className={`status-badge static status-${property.status}`}>
                {statusLabel(property.status)}
              </span>
            </div>

            <div className="gallery">
              {(images.length ? images : [
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
              ])
                .slice(0, 3)
                .map((image, index) => (
                  <img src={image} alt={`${property.name} - imagem ${index + 1}`} key={image} />
                ))}
            </div>
          </div>
        </section>

        <section className="detail-section">
          <div className="container detail-grid">
            <div>
              <h2 className="content-title">Sobre o empreendimento</h2>
              <p className="lead">
                {property.description || "Informações em atualização pela equipe."}
              </p>

              <h2 className="content-title">Informações</h2>
              <div className="spec-grid">
                <div><small>Tipo</small><strong>{property.property_type}</strong></div>
                <div><small>Área privativa</small><strong>{property.private_area ? `${property.private_area} m²` : "Consultar"}</strong></div>
                <div><small>Dormitórios</small><strong>{property.bedrooms}</strong></div>
                <div><small>Suítes</small><strong>{property.suites}</strong></div>
                <div><small>Banheiros</small><strong>{property.bathrooms}</strong></div>
                <div><small>Vagas</small><strong>{property.garages}</strong></div>
                <div><small>Entrega</small><strong>{property.delivery_label || "Consultar"}</strong></div>
                <div><small>Incorporadora</small><strong>{property.developer || "Consultar"}</strong></div>
              </div>

              {property.amenities?.length ? (
                <>
                  <h2 className="content-title">Diferenciais</h2>
                  <div className="amenities">
                    {property.amenities.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <aside className="detail-aside">
              <p className="eyebrow dark">
                {property.status === "sold" ? "Imóvel comercializado" : "Condições"}
              </p>

              <div className="detail-price">
                {property.status === "sold"
                  ? "Vendido"
                  : formatPrice(property.price_cents, property.price_on_request)}
              </div>

              <p>
                {property.status === "sold"
                  ? "Este imóvel já foi comercializado. Deixe seu contato para receber opções semelhantes."
                  : "Deixe seu contato para receber materiais, disponibilidade e condições atualizadas."}
              </p>

              <LeadForm propertyId={property.id} compact />
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
