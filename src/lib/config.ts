export const siteConfig = {
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "Nome da Imobiliária",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "5547999999999",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
