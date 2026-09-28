export type PropertyStatus =
  | "available"
  | "reserved"
  | "sold"
  | "unavailable"
  | "draft";

export type PropertyImage = {
  id?: string;
  property_id?: string;
  url: string;
  storage_path?: string | null;
  alt_text?: string | null;
  position?: number;
};

export type Property = {
  id: string;
  slug: string;
  name: string;
  city: string;
  neighborhood: string | null;
  address?: string | null;
  property_type: string;
  status: PropertyStatus;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garages: number;
  private_area: number | null;
  total_area?: number | null;
  price_cents: number | null;
  price_on_request: boolean;
  developer: string | null;
  delivery_label: string | null;
  description: string | null;
  video_url?: string | null;
  cover_image_url: string | null;
  amenities: string[];
  created_at?: string;
  updated_at?: string;
  property_images?: PropertyImage[];
};

export type Lead = {
  id: string;
  property_id: string | null;
  name: string;
  whatsapp: string;
  email: string | null;
  country: string | null;
  budget_range: string | null;
  goal: string | null;
  message: string | null;
  status: "new" | "contacted" | "proposal" | "won" | "lost";
  created_at: string;
};
