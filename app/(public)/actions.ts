"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappRegex = /^(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4})-?\d{4}$/;

export async function createPrayerRequest(formData: FormData) {
  const supabase = await createClient();

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const requestText = String(formData.get("request_text") || "").trim();
  const isPrivate = String(formData.get("is_private") || "") === "true";

  if (!requestText) {
    throw new Error("Pedido de oração é obrigatório.");
  }

  if (email && !emailRegex.test(email)) {
    throw new Error("E-mail inválido.");
  }

  if (whatsapp && !whatsappRegex.test(whatsapp)) {
    throw new Error("WhatsApp inválido.");
  }

  const { data: publicProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("is_public", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("prayer_requests").insert({
    profile_id: publicProfile?.id ?? null,
    full_name: fullName || null,
    email: email || null,
    whatsapp: whatsapp || null,
    request_text: requestText,
    is_private: isPrivate,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}