import Link from "next/link";
import { formatPrice, statusLabel } from "@/lib/format";
import { getAllPropertiesAdmin } from "@/lib/properties";

export default async function AdminPropertiesPage() {
  const properties = await getAllPropertiesAdmin();

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow dark">Catálogo</p>
          <h1>Imóveis</h1>
        </div>
        <Link className="button button-dark" href="/admin/imoveis/novo">
          + Novo imóvel
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imóvel</th>
              <th>Cidade</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Site</th>
              <th>Destaque</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>
                  <div className="table-property">
                    <img
                      src={
                        property.cover_image_url ||
                        property.property_images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=70"
                      }
                      alt=""
                    />
                    <div>
                      <strong>{property.name}</strong>
                      <small>{property.neighborhood}</small>
                    </div>
                  </div>
                </td>
                <td>{property.city}</td>
                <td>{formatPrice(property.price_cents, property.price_on_request)}</td>
                <td>{statusLabel(property.status)}</td>
                <td>{property.is_published ? "Publicado" : "Oculto"}</td>
                <td>{property.is_featured ? "Sim" : "—"}</td>
                <td>
                  <Link className="small-button" href={`/admin/imoveis/${property.id}`}>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
