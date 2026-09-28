import { demoProperties } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Lead, Property } from "@/lib/types";

const publicStatuses = ["available", "reserved", "sold"];

function isMissingSchemaError(error: { code?: string; message?: string } | null) {
  if (!error) return false;

  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    error.message?.includes("Could not find the table") === true ||
    error.message?.toLowerCase().includes("schema cache") === true
  );
}

export async function getPublishedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) return demoProperties;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("is_published", true)
    .in("status", publicStatuses)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingSchemaError(error)) {
      console.warn(
        "Supabase schema not installed yet; using demo properties. Run the migration in supabase/migrations."
      );
      return demoProperties;
    }

    console.error("properties:", error.message);
    return [];
  }

  return (data || []) as Property[];
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const items = await getPublishedProperties();
  return items.filter((item) => item.is_featured).slice(0, 6);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    return demoProperties.find((item) => item.slug === slug) || null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .in("status", publicStatuses)
    .maybeSingle();

  if (error) {
    if (isMissingSchemaError(error)) {
      console.warn(
        "Supabase schema not installed yet; using demo property details."
      );
      return demoProperties.find((item) => item.slug === slug) || null;
    }

    console.error("property:", error.message);
    return null;
  }

  return data as Property | null;
}

export async function getAllPropertiesAdmin(): Promise<Property[]> {
  if (!isSupabaseConfigured) return demoProperties;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingSchemaError(error)) {
      console.warn(
        "Supabase schema not installed yet; showing demo properties in admin."
      );
      return demoProperties;
    }

    throw new Error(error.message);
  }

  return (data || []) as Property[];
}

export async function getPropertyAdmin(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    return demoProperties.find((item) => item.id === id) || null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isMissingSchemaError(error)) {
      console.warn(
        "Supabase schema not installed yet; showing demo property in admin."
      );
      return demoProperties.find((item) => item.id === id) || null;
    }

    throw new Error(error.message);
  }

  return data as Property | null;
}

export async function getLeadsAdmin(): Promise<Lead[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingSchemaError(error)) {
      console.warn("Supabase schema not installed yet; no leads available.");
      return [];
    }

    throw new Error(error.message);
  }

  return (data || []) as Lead[];
}
