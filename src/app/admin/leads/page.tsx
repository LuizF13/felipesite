import { updateLeadStatus } from "@/app/admin/actions";
import { leadStatusLabel } from "@/lib/format";
import { getLeadsAdmin } from "@/lib/properties";

export default async function AdminLeadsPage() {
  const leads = await getLeadsAdmin();

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow dark">CRM inicial</p>
          <h1>Leads</h1>
        </div>
      </div>

      {leads.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table leads-table">
            <thead>
              <tr>
                <th>Contato</th>
                <th>País</th>
                <th>Faixa</th>
                <th>Objetivo</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong>{lead.name}</strong>
                    <small>{lead.whatsapp}</small>
                    {lead.email ? <small>{lead.email}</small> : null}
                  </td>
                  <td>{lead.country || "—"}</td>
                  <td>{lead.budget_range || "—"}</td>
                  <td>{lead.goal || "—"}</td>
                  <td>{new Date(lead.created_at).toLocaleDateString("pt-BR")}</td>
                  <td>
                    <form action={updateLeadStatus.bind(null, lead.id)}>
                      <select name="status" defaultValue={lead.status}>
                        <option value="new">Novo</option>
                        <option value="contacted">Em atendimento</option>
                        <option value="proposal">Proposta</option>
                        <option value="won">Fechado</option>
                        <option value="lost">Perdido</option>
                      </select>
                      <button className="small-button" type="submit">
                        Salvar
                      </button>
                    </form>
                    <small>{leadStatusLabel(lead.status)}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          Ainda não há leads no banco. Assim que o formulário público receber um
          contato, ele aparecerá aqui.
        </div>
      )}
    </>
  );
}
