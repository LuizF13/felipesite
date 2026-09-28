import { siteConfig } from "@/lib/config";
import type { Property } from "@/lib/types";

export function buildBusinessContext(properties: Property[]) {
  const inventory = properties.slice(0, 40).map((property) => ({
    name: property.name,
    city: property.city,
    neighborhood: property.neighborhood,
    type: property.property_type,
    status: property.status,
    bedrooms: property.bedrooms,
    suites: property.suites,
    garages: property.garages,
    private_area: property.private_area,
    price_cents: property.price_cents,
    price_on_request: property.price_on_request,
    developer: property.developer,
    delivery: property.delivery_label,
    amenities: property.amenities,
    slug: property.slug,
  }));

  return {
    company: siteConfig.companyName,
    positioning:
      "Imobiliária e consultoria imobiliária no Brasil voltada especialmente a brasileiros que vivem na Europa e querem analisar oportunidades no litoral de Santa Catarina.",
    regions: ["Itapema - SC", "Porto Belo - SC"],
    services: [
      "curadoria de oportunidades imobiliárias",
      "apresentação de imóveis e empreendimentos",
      "atendimento a brasileiros que vivem na Europa",
      "acompanhamento local da negociação",
      "informações sobre imóveis publicados no site",
      "encaminhamento para atendimento humano da equipe",
    ],
    whatsapp: siteConfig.whatsapp,
    inventory,
  };
}
