"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/format";

function intValue(formData: FormData, key: string) {
  const value = Number(formData.get(key) || 0);
  return Number.isFinite(value) ? Math.trunc(value) : 0;
}

function decimalValue(formData: FormData, key: string) {
  const raw = String(formData.get(key) || "").trim();
  if (!raw) return null;
  const value = Number(raw.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function parsePriceCents(formData: FormData) {
  const raw = String(formData.get("price_reais") || "").trim();
  if (!raw) return null;
  const normalized = raw.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : null;
}

function parseAmenities(formData: FormData) {
  return String(formData.get("amenities") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function uploadImages(
  supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>["supabase"]>,
  propertyId: string,
  files: File[]
) {
  const uploaded: Array<{ url: string; path: string }> = [];

  for (const file of files) {
    if (!file.size || !file.type.startsWith("image/")) continue;

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `properties/${propertyId}/${randomUUID()}.${safeExtension}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from("property-media")
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("property-media").getPublicUrl(path);

    uploaded.push({ url: publicUrl, path });
  }

  if (uploaded.length) {
    const { data: existing } = await supabase
      .from("property_images")
      .select("position")
      .eq("property_id", propertyId)
      .order("position", { ascending: false })
      .limit(1);

    let position = (existing?.[0]?.position ?? -1) + 1;

    const { error } = await supabase.from("property_images").insert(
      uploaded.map((item) => ({
        property_id: propertyId,
        url: item.url,
        storage_path: item.path,
        position: position++,
      }))
    );

    if (error) throw new Error(error.message);
  }

  return uploaded;
}

export async function createProperty(formData: FormData) {
  const admin = await requireAdmin();
  if (admin.demo || !admin.supabase) redirect("/admin/imoveis?demo=1");

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Nome obrigatório.");

  const slug =
    String(formData.get("slug") || "").trim() ||
    `${slugify(name)}-${Date.now().toString().slice(-6)}`;

  const payload = {
    slug,
    name,
    city: String(formData.get("city") || "").trim(),
    neighborhood: String(formData.get("neighborhood") || "").trim() || null,
    address: String(formData.get("address") || "").trim() || null,
    property_type: String(formData.get("property_type") || "Apartamento"),
    status: String(formData.get("status") || "draft"),
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    sort_order: intValue(formData, "sort_order"),
    bedrooms: intValue(formData, "bedrooms"),
    suites: intValue(formData, "suites"),
    bathrooms: intValue(formData, "bathrooms"),
    garages: intValue(formData, "garages"),
    private_area: decimalValue(formData, "private_area"),
    total_area: decimalValue(formData, "total_area"),
    price_cents: parsePriceCents(formData),
    price_on_request: formData.get("price_on_request") === "on",
    developer: String(formData.get("developer") || "").trim() || null,
    delivery_label: String(formData.get("delivery_label") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    video_url: String(formData.get("video_url") || "").trim() || null,
    cover_image_url: String(formData.get("cover_image_url") || "").trim() || null,
    amenities: parseAmenities(formData),
  };

  const { data, error } = await admin.supabase
    .from("properties")
    .insert(payload)
    .select("id, slug, cover_image_url")
    .single();

  if (error) throw new Error(error.message);

  const files = formData
    .getAll("images")
    .filter((item): item is File => item instanceof File && item.size > 0);

  const uploaded = await uploadImages(admin.supabase, data.id, files);

  if (!data.cover_image_url && uploaded[0]) {
    await admin.supabase
      .from("properties")
      .update({ cover_image_url: uploaded[0].url })
      .eq("id", data.id);
  }

  revalidatePath("/");
  revalidatePath("/imoveis");
  redirect(`/admin/imoveis/${data.id}?created=1`);
}

export async function updateProperty(id: string, formData: FormData) {
  const admin = await requireAdmin();
  if (admin.demo || !admin.supabase) redirect(`/admin/imoveis/${id}?demo=1`);

  const payload = {
    slug: String(formData.get("slug") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    neighborhood: String(formData.get("neighborhood") || "").trim() || null,
    address: String(formData.get("address") || "").trim() || null,
    property_type: String(formData.get("property_type") || "Apartamento"),
    status: String(formData.get("status") || "draft"),
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    sort_order: intValue(formData, "sort_order"),
    bedrooms: intValue(formData, "bedrooms"),
    suites: intValue(formData, "suites"),
    bathrooms: intValue(formData, "bathrooms"),
    garages: intValue(formData, "garages"),
    private_area: decimalValue(formData, "private_area"),
    total_area: decimalValue(formData, "total_area"),
    price_cents: parsePriceCents(formData),
    price_on_request: formData.get("price_on_request") === "on",
    developer: String(formData.get("developer") || "").trim() || null,
    delivery_label: String(formData.get("delivery_label") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    video_url: String(formData.get("video_url") || "").trim() || null,
    cover_image_url: String(formData.get("cover_image_url") || "").trim() || null,
    amenities: parseAmenities(formData),
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.supabase
    .from("properties")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);

  const files = formData
    .getAll("images")
    .filter((item): item is File => item instanceof File && item.size > 0);

  const uploaded = await uploadImages(admin.supabase, id, files);

  if (!payload.cover_image_url && uploaded[0]) {
    await admin.supabase
      .from("properties")
      .update({ cover_image_url: uploaded[0].url })
      .eq("id", id);
  }

  revalidatePath("/");
  revalidatePath("/imoveis");
  revalidatePath("/admin/imoveis");
  redirect(`/admin/imoveis/${id}?saved=1`);
}

export async function deleteProperty(id: string) {
  const admin = await requireAdmin();
  if (admin.demo || !admin.supabase) redirect("/admin/imoveis?demo=1");

  const { data: images } = await admin.supabase
    .from("property_images")
    .select("storage_path")
    .eq("property_id", id);

  const paths = (images || [])
    .map((item) => item.storage_path)
    .filter((item): item is string => Boolean(item));

  if (paths.length) {
    await admin.supabase.storage.from("property-media").remove(paths);
  }

  const { error } = await admin.supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/imoveis");
  redirect("/admin/imoveis?deleted=1");
}

export async function setCoverImage(
  propertyId: string,
  url: string
) {
  const admin = await requireAdmin();
  if (admin.demo || !admin.supabase) return;

  const { error } = await admin.supabase
    .from("properties")
    .update({ cover_image_url: url, updated_at: new Date().toISOString() })
    .eq("id", propertyId);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/imoveis");
  revalidatePath(`/admin/imoveis/${propertyId}`);
}

export async function deletePropertyImage(
  propertyId: string,
  imageId: string,
  storagePath: string | null
) {
  const admin = await requireAdmin();
  if (admin.demo || !admin.supabase) return;

  if (storagePath) {
    await admin.supabase.storage.from("property-media").remove([storagePath]);
  }

  const { error } = await admin.supabase
    .from("property_images")
    .delete()
    .eq("id", imageId)
    .eq("property_id", propertyId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyId}`);
}

export async function updateLeadStatus(id: string, formData: FormData) {
  const admin = await requireAdmin();
  if (admin.demo || !admin.supabase) redirect("/admin/leads?demo=1");

  const status = String(formData.get("status") || "new");

  const { error } = await admin.supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
}
