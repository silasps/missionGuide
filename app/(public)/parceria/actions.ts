"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createPartner(formData: FormData) {
  const supabase = await createClient();

  const profileId = String(formData.get("profile_id") || "");
  const missionaryUsername = String(formData.get("missionary_username") || "");

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const highlightId = String(formData.get("highlight_id") || "").trim();

  if (!profileId) {
    throw new Error("Missionário não identificado.");
  }

  if (!fullName) {
    throw new Error("Nome é obrigatório.");
  }

  const { error } = await supabase.from("partners").insert({
    profile_id: profileId,
    highlight_id: highlightId || null,
    full_name: fullName,
    email: email || null,
    phone: phone || null,
    city: city || null,
    state: state || null,
    message: message || null,
    status: "lead",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/m/${missionaryUsername}`);
  revalidatePath(`/m/${missionaryUsername}/parceria`);

  redirect(`/m/${missionaryUsername}/parceria?sucesso=true`);
}