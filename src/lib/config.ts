export const siteConfig = {
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "Hope Business",
  logoPath: "/Hop.png",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "5547999999999",
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "",
  cnpj: process.env.NEXT_PUBLIC_COMPANY_CNPJ || "",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "",
  cep: process.env.NEXT_PUBLIC_COMPANY_CEP || "",
  creci: process.env.NEXT_PUBLIC_CRECI || "10644",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  businessHours: {
    monday: "09:00–17:00",
    tuesday: "09:00–17:00",
    wednesday: "09:00–17:00",
    thursday: "09:00–17:00",
    friday: "09:00–17:00",
    saturday: "Fechado",
    sunday: "Fechado",
  },
};

export const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);

export const geminiModel =
  process.env.GEMINI_MODEL || "gemini-3.8-flash";

export const geminiFallbackModels = (
  process.env.GEMINI_FALLBACK_MODELS ||
  "gemini-3.5-flash-lite,gemini-3.5-flash"
)
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);
