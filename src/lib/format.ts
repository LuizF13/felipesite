import type { PropertyStatus } from "@/lib/types";

export function formatPrice(priceCents: number | null, onRequest = false) {
  if (onRequest || priceCents === null) return "Consulte condições";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function statusLabel(status: PropertyStatus) {
  return {
    available: "Disponível",
    reserved: "Reservado",
    sold: "Vendido",
    unavailable: "Indisponível",
    draft: "Rascunho",
  }[status];
}

export function leadStatusLabel(status: string) {
  return {
    new: "Novo",
    contacted: "Em atendimento",
    proposal: "Proposta",
    won: "Fechado",
    lost: "Perdido",
  }[status] || status;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
