"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/current-profile";

export async function updatePartner(partnerId: string, formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const status = String(formData.get("status") || "lead").trim();
  const notes = String(formData.get("notes") || "").trim();
  const markContacted = String(formData.get("mark_contacted") || "") === "true";

  const allowedStatuses = ["lead", "contacted", "active", "inactive"];
  const safeStatus = allowedStatuses.includes(status) ? status : "lead";

  const payload: {
    status: string;
    notes: string | null;
    last_contact_at?: string | null;
  } = {
    status: safeStatus,
    notes: notes || null,
  };

  if (markContacted) {
    payload.last_contact_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("partners")
    .update(payload)
    .eq("id", partnerId)
    .eq("profile_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/parceiros");
}