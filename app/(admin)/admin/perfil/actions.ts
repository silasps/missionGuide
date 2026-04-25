"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugifyUsername } from "@/lib/username";

function parseTimeline(raw: string) {
  if (!raw.trim()) return null;

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items = lines.map((line) => {
    const [year, ...rest] = line.split("|");
    return {
      year: year?.trim() || "",
      text: rest.join("|").trim() || "",
    };
  });

  return items.length ? items : null;
}

async function generateUniqueUsername(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseName: string,
  currentUserId: string
) {
  const base = slugifyUsername(baseName || "missionario") || "missionario";

  const { data: existing } = await supabase
    .from("profiles")
    .select("id, username")
    .ilike("username", `${base}%`);

  const taken = new Set(
    (existing || [])
      .filter((item) => item.id !== currentUserId)
      .map((item) => String(item.username || "").toLowerCase())
  );

  if (!taken.has(base)) return base;

  let counter = 2;
  while (taken.has(`${base}-${counter}`)) {
    counter++;
  }

  return `${base}-${counter}`;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = String(formData.get("display_name") || "").trim();
  const rawUsername = String(formData.get("username") || "").trim().toLowerCase();

  let username = slugifyUsername(rawUsername);
  if (!username) {
    username = await generateUniqueUsername(supabase, displayName, user.id);
  } else {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing && existing.id !== user.id) {
      redirect("/admin/perfil?error=username-exists");
    }
  }

  const bio = String(formData.get("bio") || "").trim();
  const story = String(formData.get("story") || "").trim();
  const callingStory = String(formData.get("calling_story") || "").trim();
  const storyIntro = String(formData.get("story_intro") || "").trim();
  const storyCoverUrl = String(formData.get("story_cover_url") || "").trim();
  const timelineRaw = String(formData.get("timeline_raw") || "").trim();

  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const instagramUrl = String(formData.get("instagram_url") || "").trim();
  const youtubeUrl = String(formData.get("youtube_url") || "").trim();
  const whatsappUrl = String(formData.get("whatsapp_url") || "").trim();
  const donationUrl = String(formData.get("donation_url") || "").trim();

  const pixKey = String(formData.get("pix_key") || "").trim();
  const pixKeyType = String(formData.get("pix_key_type") || "").trim();
  const pixRecipientName = String(formData.get("pix_recipient_name") || "").trim();
  const supportTitle = String(formData.get("support_title") || "").trim();
  const supportText = String(formData.get("support_text") || "").trim();
  const avatarUrl = String(formData.get("avatar_url") || "").trim();

  const timelineJson = parseTimeline(timelineRaw);

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      display_name: displayName || null,
      bio: bio || null,
      story: story || null,
      calling_story: callingStory || null,
      story_intro: storyIntro || null,
      story_cover_url: storyCoverUrl || null,
      timeline_json: timelineJson,
      avatar_url: avatarUrl || null,
      city: city || null,
      state: state || null,
      instagram_url: instagramUrl || null,
      youtube_url: youtubeUrl || null,
      whatsapp_url: whatsappUrl || null,
      donation_url: donationUrl || null,
      pix_key: pixKey || null,
      pix_key_type: pixKeyType || null,
      pix_recipient_name: pixRecipientName || null,
      support_title: supportTitle || null,
      support_text: supportText || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/perfil");
  revalidatePath(`/m/${username}`);
  revalidatePath(`/m/${username}/historia`);
  revalidatePath(`/m/${username}/parceria`);
  revalidatePath(`/m/${username}/publicacoes`);

  redirect("/admin/perfil?success=profile-saved");
}