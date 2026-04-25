"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function toBool(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

export async function createHighlight(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const coverUrl = String(formData.get("cover_url") || "").trim();
  const ctaLabel = String(formData.get("cta_label") || "").trim();
  const ctaUrl = String(formData.get("cta_url") || "").trim();
  const sortOrder = Number(formData.get("sort_order") || 0);
  const isFeatured = toBool(formData.get("is_featured"));
  const isActive = toBool(formData.get("is_active"));

  if (!title) {
    throw new Error("Título é obrigatório.");
  }

  const { error } = await supabase.from("highlights").insert({
    profile_id: user.id,
    title,
    description: description || null,
    cover_url: coverUrl || null,
    cta_label: ctaLabel || null,
    cta_url: ctaUrl || null,
    sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
    is_featured: isFeatured,
    is_active: isActive,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/parceria");
  revalidatePath("/admin/destaques");

  redirect("/admin/destaques");
}

export async function updateHighlight(highlightId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const coverUrl = String(formData.get("cover_url") || "").trim();
  const ctaLabel = String(formData.get("cta_label") || "").trim();
  const ctaUrl = String(formData.get("cta_url") || "").trim();
  const sortOrder = Number(formData.get("sort_order") || 0);
  const isFeatured = toBool(formData.get("is_featured"));
  const isActive = toBool(formData.get("is_active"));

  if (!title) {
    throw new Error("Título é obrigatório.");
  }

  const { error } = await supabase
    .from("highlights")
    .update({
      title,
      description: description || null,
      cover_url: coverUrl || null,
      cta_label: ctaLabel || null,
      cta_url: ctaUrl || null,
      sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
      is_featured: isFeatured,
      is_active: isActive,
    })
    .eq("id", highlightId)
    .eq("profile_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/parceria");
  revalidatePath("/admin/destaques");

  redirect("/admin/destaques");
}

export async function deleteHighlight(highlightId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("highlights")
    .delete()
    .eq("id", highlightId)
    .eq("profile_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/parceria");
  revalidatePath("/admin/destaques");
}