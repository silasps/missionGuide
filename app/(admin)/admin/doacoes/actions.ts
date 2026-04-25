"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

export async function createDonation(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  const missionaryId = String(formData.get("missionary_id") || "").trim();
  const amountRaw = String(formData.get("amount") || "").trim();
  const note = String(formData.get("note") || "").trim();

  const amount = amountRaw ? parseFloat(amountRaw.replace(",", ".")) : null;

  if (!missionaryId) throw new Error("Missionário não informado.");

  await supabase.from("donations").insert({
    donor_id: profile.id,
    missionary_id: missionaryId,
    amount: amount || null,
    note: note || null,
  });

  revalidatePath("/admin/doacoes");
  redirect("/admin/doacoes");
}
