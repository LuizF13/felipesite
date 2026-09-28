import Link from "next/link";
import { formatPrice, statusLabel } from "@/lib/format";
import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const image =
    property.cover_image_url ||
    property.property_images?.[0]?.url ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return (
    <article className="property-card">
      <Link href={`/imoveis/${property.slug}`} className="property-image-link">
        {/* Remote demo images intentionally use regular img tags. */}
        <img className="property-image" src={image} alt={property.name} />
        <span className={`status-badge status-${property.status}`}>
          {statusLabel(property.status)}
        </span>
      </Link>

      <div className="property-content">
        <p className="property-location">
          {property.city}
          {property.neighborhood ? ` · ${property.neighborhood}` : ""}
        </p>

        <h3>{property.name}</h3>

        <div className="property-specs">
          <span>{property.suites} suítes</span>
          {property.private_area ? <span>{property.private_area} m²</span> : null}
          <span>{property.garages} vagas</span>
        </div>

        <div className="property-bottom">
          <div>
            <small>{property.status === "sold" ? "Status" : "A partir de"}</small>
            <strong>
              {property.status === "sold"
                ? "Vendido"
                : formatPrice(property.price_cents, property.price_on_request)}
            </strong>
          </div>

          <Link href={`/imoveis/${property.slug}`} className="text-link">
            {property.status === "sold" ? "Ver histórico →" : "Ver imóvel →"}
          </Link>
        </div>
      </div>
    </article>
  );
}
