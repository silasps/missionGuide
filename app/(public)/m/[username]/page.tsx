import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MissionaryProfileHeader from "@/components/missionary-profile-header";
import MissionaryPublicNav from "@/components/missionary-public-nav";
import HighlightsRow from "@/components/highlights-row";
import SocialPostCard from "@/components/social-post-card";
import FollowButton from "@/components/follow-button";

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
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  let isFollowing = false;
  let currentProfileId: string | null = null;

  if (user) {
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    currentProfileId = currentProfile?.id ?? null;

    if (currentProfileId && currentProfileId !== profile.id) {
      const { data: follow } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", currentProfileId)
        .eq("following_id", profile.id)
        .maybeSingle();

      isFollowing = !!follow;
    }
  }

  const canViewPosts = profile.is_public || currentProfileId === profile.id || isFollowing;

  const { data: highlights, error: highlightsError } = await supabase
    .from("highlights")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (highlightsError) {
    throw new Error(highlightsError.message);
  }

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(canViewPosts ? 6 : 0);

  if (postsError) {
    throw new Error(postsError.message);
  }

  const followButton =
    currentProfileId && currentProfileId !== profile.id ? (
      <FollowButton missionaryId={profile.id} isFollowing={isFollowing} />
    ) : null;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MissionaryProfileHeader profile={profile} followButton={followButton} />
      <MissionaryPublicNav username={profile.username} />
      <HighlightsRow highlights={highlights ?? []} username={profile.username} />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Atualizações recentes
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Veja o que está acontecendo nesta missão.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Formas de participar
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Caminhe com esta missão por meio de oração, relacionamento e apoio.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/m/${profile.username}/parceria`}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Seja parceiro
                </Link>

                <Link
                  href={`/m/${profile.username}/orar`}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Enviar oração
                </Link>
              </div>
            </div>
          </div>

          {!canViewPosts ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-10 text-slate-500">
              Este perfil é privado. Siga este missionário para acompanhar as publicações.
            </div>
          ) : posts?.length ? (
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
              Ainda não há publicações publicadas.
            </div>
          )}

          <div className="mt-8">
            <Link
              href={`/m/${profile.username}/publicacoes`}
              className="text-sm font-semibold text-slate-900"
            >
              Ver todas as publicações
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
