import Link from "next/link";
import { AppIcon } from "@/components/app-icon";
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

  const metrics = [
    {
      label: "Disponíveis",
      value: available,
      help: "imóveis ativos para negociação",
      icon: "check" as const,
      tone: "green",
    },
    {
      label: "Reservados",
      value: reserved,
      help: "imóveis aguardando conclusão",
      icon: "clock" as const,
      tone: "gold",
    },
    {
      label: "Vendidos",
      value: sold,
      help: "histórico de comercializações",
      icon: "sold" as const,
      tone: "slate",
    },
    {
      label: "Leads novos",
      value: newLeads,
      help: "contatos aguardando atendimento",
      icon: "lead" as const,
      tone: "blue",
    },
  ];

  return (
    <>
      <div className="admin-heading admin-heading-refined">
        <div>
          <p className="eyebrow dark">Visão geral</p>
          <h1>Dashboard</h1>
          <p className="admin-heading-copy">
            Acompanhe imóveis, disponibilidade e novos contatos em um só lugar.
          </p>
        </div>

        <Link className="button button-dark" href="/admin/imoveis/novo">
          <AppIcon name="plus" size={18} />
          Novo imóvel
        </Link>
      </div>

      <div className="dashboard-cards dashboard-cards-refined">
        {metrics.map((metric) => (
          <article className="dashboard-metric" key={metric.label}>
            <div className={`metric-icon metric-${metric.tone}`}>
              <AppIcon name={metric.icon} size={21} />
            </div>
            <div>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.help}</small>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Portfólio</span>
              <h2>Imóveis recentes</h2>
            </div>
            <Link href="/admin/imoveis">Ver todos →</Link>
          </div>

          <div className="admin-list admin-property-list">
            {properties.length ? (
              properties.slice(0, 6).map((property) => (
                <Link href={`/admin/imoveis/${property.id}`} key={property.id}>
                  <div className="admin-property-row">
                    <div className="admin-property-thumb">
                      {property.cover_image_url ? (
                        <img src={property.cover_image_url} alt="" />
                      ) : (
                        <AppIcon name="building" size={20} />
                      )}
                    </div>
                    <div>
                      <strong>{property.name}</strong>
                      <span>
                        {property.city} · {statusLabel(property.status)}
                      </span>
                    </div>
                  </div>

                  <span className={property.is_published ? "publish-pill is-live" : "publish-pill"}>
                    {property.is_published ? "Publicado" : "Oculto"}
                  </span>
                </Link>
              ))
            ) : (
              <div className="admin-empty-inline">
                Nenhum imóvel cadastrado ainda.
              </div>
            )}
          </div>
        </section>

        <aside className="admin-panel quick-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Atalhos</span>
              <h2>Ações rápidas</h2>
            </div>
          </div>

          <div className="quick-actions">
            <Link href="/admin/imoveis/novo">
              <span className="quick-action-icon">
                <AppIcon name="plus" size={20} />
              </span>
              <div>
                <strong>Cadastrar imóvel</strong>
                <span>Fotos, valores, status e publicação.</span>
              </div>
            </Link>

            <Link href="/admin/leads">
              <span className="quick-action-icon">
                <AppIcon name="users" size={20} />
              </span>
              <div>
                <strong>Ver novos leads</strong>
                <span>{newLeads} contato(s) aguardando análise.</span>
              </div>
            </Link>

            <Link href="/imoveis" target="_blank">
              <span className="quick-action-icon">
                <AppIcon name="external" size={20} />
              </span>
              <div>
                <strong>Abrir catálogo</strong>
                <span>Confira como os imóveis aparecem ao cliente.</span>
              </div>
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
