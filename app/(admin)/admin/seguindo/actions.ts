"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";

export async function followMissionary(missionaryId: string) {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  await supabase.from("follows").insert({
    follower_id: profile.id,
    following_id: missionaryId,
  });

  revalidatePath(`/admin/feed`);
  revalidatePath(`/admin/seguindo`);
}

export async function unfollowMissionary(missionaryId: string) {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  await supabase
    .from("follows")
    .delete()
    .eq("follower_id", profile.id)
    .eq("following_id", missionaryId);

  revalidatePath(`/admin/feed`);
  revalidatePath(`/admin/seguindo`);
}
