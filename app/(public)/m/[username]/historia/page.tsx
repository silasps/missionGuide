import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MissionaryProfileHeader from "@/components/missionary-profile-header";
import MissionaryPublicNav from "@/components/missionary-public-nav";
import HighlightsRow from "@/components/highlights-row";
import SocialPostCard from "@/components/social-post-card";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function MissionaryPublicPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_public", true)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!profile) notFound();

  const { data: highlights, error: highlightsError } = await supabase
    .from("highlights")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (highlightsError) throw new Error(highlightsError.message);

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);

  if (postsError) throw new Error(postsError.message);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MissionaryProfileHeader profile={profile} />
      <MissionaryPublicNav username={profile.username} />
      <HighlightsRow highlights={highlights ?? []} username={profile.username} />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Publicações recentes</h2>
              <p className="mt-2 text-sm text-slate-500">
                Veja as últimas atualizações desta missão.
              </p>
            </div>

            <Link
              href={`/m/${profile.username}/publicacoes`}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Ver publicações
            </Link>
          </div>

          {posts?.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <SocialPostCard
                  key={post.id}
                  username={profile.username}
                  post={post}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-10 text-slate-500">
              Nenhuma publicação foi publicada ainda.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}