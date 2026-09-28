import { demoProperties } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Lead, Property } from "@/lib/types";

const publicStatuses = ["available", "reserved", "sold"];

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

  if (error) throw new Error(error.message);
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

  if (error) throw new Error(error.message);
  return data as Property | null;
}

export async function getLeadsAdmin(): Promise<Lead[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as Lead[];
}
