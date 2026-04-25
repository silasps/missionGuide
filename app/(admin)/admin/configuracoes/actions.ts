"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";

export async function toggleMissionaryMode(enabled: boolean) {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ missionary_mode: enabled })
    .eq("id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/configuracoes");
  revalidatePath("/admin");
  revalidatePath("/admin/feed");
}
