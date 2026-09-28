import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  if (!isSupabaseConfigured) {
    return { demo: true as const, user: null, supabase: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile?.is_admin) {
    redirect("/login?error=not-admin");
  }

  return { demo: false as const, user, supabase };
}
