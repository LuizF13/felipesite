import type { Property } from "@/lib/types";

export const demoProperties: Property[] = [
  {
    id: "demo-marina-one",
    slug: "marina-one-residence",
    name: "Marina One Residence",
    city: "Itapema",
    neighborhood: "Meia Praia",
    property_type: "Apartamento",
    status: "available",
    is_published: true,
    is_featured: true,
    sort_order: 1,
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    garages: 3,
    private_area: 185,
    total_area: null,
    price_cents: 389000000,
    price_on_request: false,
    developer: "Incorporadora selecionada",
    delivery_label: "2028",
    description:
      "Empreendimento demonstrativo de alto padrão em Itapema. Os dados desta unidade são apenas para visualizar o funcionamento do catálogo antes da conexão com o banco real.",
    cover_image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    amenities: ["Piscina", "Academia", "Rooftop", "Salão de festas"],
    property_images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85", position: 0 },
      { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", position: 1 },
      { url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85", position: 2 }
    ]
  },
  {
    id: "demo-ocean",
    slug: "porto-belo-ocean",
    name: "Porto Belo Ocean",
    city: "Porto Belo",
    neighborhood: "Perequê",
    property_type: "Apartamento",
    status: "available",
    is_published: true,
    is_featured: true,
    sort_order: 2,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    garages: 2,
    private_area: 142,
    total_area: null,
    price_cents: 245000000,
    price_on_request: false,
    developer: "Incorporadora selecionada",
    delivery_label: "2029",
    description:
      "Projeto demonstrativo em Porto Belo, usado para validar o design e os fluxos do catálogo.",
    cover_image_url:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85",
    amenities: ["Piscina", "Vista para o mar", "Espaço gourmet"],
    property_images: [
      { url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85", position: 0 },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85", position: 1 }
    ]
  },
  {
    id: "demo-reserva",
    slug: "reserva-atlantica",
    name: "Reserva Atlântica",
    city: "Itapema",
    neighborhood: "Centro",
    property_type: "Cobertura",
    status: "reserved",
    is_published: true,
    is_featured: true,
    sort_order: 3,
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    garages: 4,
    private_area: 270,
    total_area: null,
    price_cents: 620000000,
    price_on_request: false,
    developer: "Incorporadora selecionada",
    delivery_label: "Pronto",
    description: "Cobertura demonstrativa de alto padrão para apresentação do status reservado.",
    cover_image_url:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    amenities: ["Vista para o mar", "Piscina", "Mobiliado"],
    property_images: [
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85", position: 0 }
    ]
  },
  {
    id: "demo-vendido",
    slug: "vista-mar-exclusive",
    name: "Vista Mar Exclusive",
    city: "Itapema",
    neighborhood: "Meia Praia",
    property_type: "Apartamento",
    status: "sold",
    is_published: true,
    is_featured: false,
    sort_order: 4,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    garages: 2,
    private_area: 155,
    total_area: null,
    price_cents: null,
    price_on_request: true,
    developer: "Incorporadora selecionada",
    delivery_label: "2027",
    description:
      "Imóvel demonstrativo já comercializado. No site real, imóveis vendidos podem permanecer públicos como histórico e prova de atuação.",
    cover_image_url:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=85",
    amenities: ["Área de lazer", "Academia"],
    property_images: [
      { url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=85", position: 0 }
    ]
  }
];
