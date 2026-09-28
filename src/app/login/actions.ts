"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  if (!isSupabaseConfigured) {
    redirect("/admin");
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=invalid");
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
