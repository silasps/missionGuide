import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MissionaryProfileHeader from "@/components/missionary-profile-header";
import MissionaryPublicNav from "@/components/missionary-public-nav";

type Props = {
  params: Promise<{ username: string; slug: string }>;
};

export default async function MissionaryPostDetailPage({ params }: Props) {
  const { username, slug } = await params;
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

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MissionaryProfileHeader profile={profile} />
      <MissionaryPublicNav username={profile.username} />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href={`/m/${username}/publicacoes`}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Voltar para publicações
        </Link>

        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {post.excerpt}
          </p>
        ) : null}

        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt={post.title}
            className="mt-8 w-full rounded-3xl border border-slate-200 object-cover shadow-sm"
          />
        ) : null}

        {post.content ? (
          <div className="mt-10 whitespace-pre-wrap text-base leading-8 text-slate-800">
            {post.content}
          </div>
        ) : (
          <div className="mt-10 text-slate-500">Sem conteúdo detalhado.</div>
        )}
      </section>
    </main>
  );
}
