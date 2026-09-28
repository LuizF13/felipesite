"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function createLead(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();

  if (!name || !whatsapp) {
    redirect("/?lead=missing#contato");
  }

  if (!isSupabaseConfigured) {
    redirect("/obrigado?demo=1");
  }

  const supabase = await createClient();

  const propertyIdRaw = String(formData.get("property_id") || "").trim();

  const { error } = await supabase.from("leads").insert({
    property_id: propertyIdRaw || null,
    name,
    whatsapp,
    email: String(formData.get("email") || "").trim() || null,
    country: String(formData.get("country") || "").trim() || null,
    budget_range: String(formData.get("budget_range") || "").trim() || null,
    goal: String(formData.get("goal") || "").trim() || null,
    message: String(formData.get("message") || "").trim() || null,
    status: "new",
  });

  if (error) {
    console.error("lead:", error.message);
    redirect("/?lead=error#contato");
  }

  redirect("/obrigado");
}
