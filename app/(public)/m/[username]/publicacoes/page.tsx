import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MissionaryProfileHeader from "@/components/missionary-profile-header";
import MissionaryPublicNav from "@/components/missionary-public-nav";
import SocialPostCard from "@/components/social-post-card";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function MissionaryPostsPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!profile) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  let canViewPosts = profile.is_public;

  if (user) {
    if (user.id === profile.id) {
      canViewPosts = true;
    } else {
      const { data: follow } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", profile.id)
        .maybeSingle();

      canViewPosts = Boolean(follow);
    }
  }

  if (!canViewPosts) notFound();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MissionaryProfileHeader profile={profile} />
      <MissionaryPublicNav username={profile.username} />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Publicações
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Todas as atualizações públicas desta missão.
          </p>
        </div>

        {posts?.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <SocialPostCard
                key={post.id}
                username={profile.username}
                post={post}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-slate-500">
            Nenhuma publicação disponível.
          </div>
        )}
      </section>
    </main>
  );
}
