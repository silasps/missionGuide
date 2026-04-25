"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/current-profile";
import { slugify } from "@/lib/slug";

function normalizeStatus(value: string) {
  return value === "published" ? "published" : "draft";
}

function normalizePostType(value: string) {
  if (["text", "image", "video", "carousel"].includes(value)) return value;
  return "text";
}

export async function createPost(formData: FormData) {
  const { supabase, user, profile } = await getCurrentProfile();

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const postType = normalizePostType(String(formData.get("post_type") || "text").trim());
  const status = normalizeStatus(String(formData.get("status") || "draft").trim());
  const coverUrl = String(formData.get("cover_url") || "").trim();

  if (!title) {
    throw new Error("Título é obrigatório.");
  }

  const baseSlug = slugify(title);
  const uniqueSlug = `${baseSlug}-${Date.now()}`;
  const publishedAt = status === "published" ? new Date().toISOString() : null;

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    profile_id: profile.id,
    title,
    slug: uniqueSlug,
    excerpt: excerpt || null,
    content: content || null,
    cover_url: coverUrl || null,
    post_type: postType,
    status,
    published_at: publishedAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/publicacoes");
  revalidatePath("/");
  if (profile.username) {
    revalidatePath(`/m/${profile.username}`);
    revalidatePath(`/m/${profile.username}/publicacoes`);
  }

  redirect("/admin/publicacoes");
}

export async function updatePost(postId: string, formData: FormData) {
  const { supabase, user, profile } = await getCurrentProfile();

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const postType = normalizePostType(String(formData.get("post_type") || "text").trim());
  const status = normalizeStatus(String(formData.get("status") || "draft").trim());
  const coverUrl = String(formData.get("cover_url") || "").trim();

  if (!title) {
    throw new Error("Título é obrigatório.");
  }

  const publishedAt = status === "published" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      excerpt: excerpt || null,
      content: content || null,
      cover_url: coverUrl || null,
      post_type: postType,
      status,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("user_id", user.id)
    .eq("profile_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/publicacoes");
  revalidatePath("/");
  if (profile.username) {
    revalidatePath(`/m/${profile.username}`);
    revalidatePath(`/m/${profile.username}/publicacoes`);
  }

  redirect("/admin/publicacoes");
}

export async function deletePost(postId: string) {
  const { supabase, profile } = await getCurrentProfile();

  const { data: existingPost, error: existingError } = await supabase
    .from("posts")
    .select("id")
    .eq("id", postId)
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existingPost) {
    throw new Error("Publicação não encontrada para exclusão.");
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("profile_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/publicacoes");
  revalidatePath("/admin/publicacoes", "page");
  revalidatePath("/");

  if (profile.username) {
    revalidatePath(`/m/${profile.username}`);
    revalidatePath(`/m/${profile.username}/publicacoes`);
    revalidatePath(`/m/${profile.username}/publicacoes`, "page");
  }

  redirect("/admin/publicacoes?deleted=1");
}