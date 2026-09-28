import Link from "next/link";
import { getAllPropertiesAdmin, getLeadsAdmin } from "@/lib/properties";
import { statusLabel } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [properties, leads] = await Promise.all([
    getAllPropertiesAdmin(),
    getLeadsAdmin(),
  ]);

  const available = properties.filter((item) => item.status === "available").length;
  const reserved = properties.filter((item) => item.status === "reserved").length;
  const sold = properties.filter((item) => item.status === "sold").length;
  const newLeads = leads.filter((item) => item.status === "new").length;

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow dark">Administração</p>
          <h1>Dashboard</h1>
        </div>
        <Link className="button button-dark" href="/admin/imoveis/novo">
          + Novo imóvel
        </Link>
      </div>

      <div className="dashboard-cards">
        <article><span>Disponíveis</span><strong>{available}</strong></article>
        <article><span>Reservados</span><strong>{reserved}</strong></article>
        <article><span>Vendidos</span><strong>{sold}</strong></article>
        <article><span>Leads novos</span><strong>{newLeads}</strong></article>
      </div>

      <div className="admin-panel">
        <div className="panel-heading">
          <h2>Imóveis recentes</h2>
          <Link href="/admin/imoveis">Ver todos →</Link>
        </div>

        <div className="admin-list">
          {properties.slice(0, 6).map((property) => (
            <Link href={`/admin/imoveis/${property.id}`} key={property.id}>
              <div>
                <strong>{property.name}</strong>
                <span>{property.city} · {statusLabel(property.status)}</span>
              </div>
              <span>{property.is_published ? "Publicado" : "Oculto"} →</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
