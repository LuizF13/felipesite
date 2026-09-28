import { createLead } from "@/app/actions";

export function LeadForm({
  propertyId,
  compact = false,
}: {
  propertyId?: string;
  compact?: boolean;
}) {
  return (
    <form action={createLead} className={compact ? "lead-form compact" : "lead-form"}>
      {propertyId ? <input type="hidden" name="property_id" value={propertyId} /> : null}

      <div className="form-grid">
        <label>
          <span>Nome</span>
          <input name="name" required placeholder="Seu nome" />
        </label>

        <label>
          <span>WhatsApp</span>
          <input name="whatsapp" required placeholder="+351 / +44 / +39..." />
        </label>

        {!compact ? (
          <>
            <label>
              <span>E-mail</span>
              <input name="email" type="email" placeholder="voce@email.com" />
            </label>

            <label>
              <span>País onde mora</span>
              <input name="country" placeholder="Portugal, Itália..." />
            </label>

            <label>
              <span>Faixa de investimento</span>
              <select name="budget_range" defaultValue="Ainda estou avaliando">
                <option>Até R$ 500 mil</option>
                <option>R$ 500 mil a R$ 1 milhão</option>
                <option>R$ 1 milhão a R$ 2 milhões</option>
                <option>Acima de R$ 2 milhões</option>
                <option>Ainda estou avaliando</option>
              </select>
            </label>

            <label>
              <span>Objetivo</span>
              <select name="goal" defaultValue="Ainda estou avaliando">
                <option>Valorização patrimonial</option>
                <option>Renda</option>
                <option>Uso futuro</option>
                <option>Diversificação patrimonial</option>
                <option>Ainda estou avaliando</option>
              </select>
            </label>

            <label className="full">
              <span>O que você procura?</span>
              <textarea name="message" rows={4} placeholder="Conte brevemente..." />
            </label>
          </>
        ) : null}
      </div>

      <button className="button button-dark form-submit" type="submit">
        Quero falar com a equipe →
      </button>

      <p className="form-note">
        Ao enviar, você autoriza o contato da equipe sobre esta solicitação.
      </p>
    </form>
  );
}
