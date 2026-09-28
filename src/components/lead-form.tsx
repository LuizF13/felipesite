"use client";

import { useState } from "react";
import { postJson } from "@/lib/xhr-client";

export function LeadForm({
  propertyId,
  propertyName,
  compact = false,
}: {
  propertyId?: string;
  propertyName?: string;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [doneUrl, setDoneUrl] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");

    try {
      const data = await postJson<{ whatsappUrl: string }>("/api/leads/contact", {
        propertyId,
        propertyName,
        name: form.get("name"),
        whatsapp: form.get("whatsapp"),
        email: form.get("email"),
        country: form.get("country"),
        budgetRange: form.get("budget_range"),
        goal: form.get("goal"),
        message: form.get("message"),
      });

      setDoneUrl(data.whatsappUrl);
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className={compact ? "lead-form compact" : "lead-form"}>
      <div className="form-grid">
        <label>
          <span>Nome</span>
          <input name="name" required placeholder="Seu nome" />
        </label>

        <label>
          <span>WhatsApp</span>
          <input name="whatsapp" required placeholder="+351 / +1 / +55..." />
        </label>

        {!compact ? (
          <>
            <label>
              <span>E-mail</span>
              <input name="email" type="email" placeholder="voce@email.com" />
            </label>

            <label>
              <span>País onde mora</span>
              <input name="country" placeholder="Portugal, EUA, Itália..." />
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
        ) : (
          <input type="hidden" name="message" value={propertyName ? `Tenho interesse em ${propertyName}` : ""} />
        )}
      </div>

      <button className="button button-dark form-submit" type="submit" disabled={loading}>
        {loading ? "Preparando atendimento..." : "Enviar e abrir WhatsApp →"}
      </button>

      {doneUrl ? (
        <a className="form-whatsapp-link" href={doneUrl} target="_blank" rel="noreferrer">
          Abrir WhatsApp novamente
        </a>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      <p className="form-note">
        Seu contato fica registrado para a equipe e o WhatsApp abre com a mensagem pronta.
      </p>
    </form>
  );
}
