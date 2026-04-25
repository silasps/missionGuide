import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import SocialPostCard from "@/components/social-post-card";

export default async function FeedPage() {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  const { data: follows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", profile.id);

  const followingIds = follows?.map((f) => f.following_id) ?? [];

  const { data: posts } = followingIds.length
    ? await supabase
        .from("posts")
        .select("*, profiles!inner(username, display_name, avatar_url, is_public)")
        .in("profile_id", followingIds)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(30)
    : { data: [] };

  const { data: suggested } = followingIds.length
    ? { data: [] }
    : await supabase
        .from("profiles")
        .select("id, username, display_name, bio, avatar_url, city, state")
        .eq("is_public", true)
        .eq("missionary_mode", true)
        .neq("id", profile.id)
        .limit(6);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Feed</h1>
        <p className="mt-2 text-sm text-slate-400">
          Atualizações de quem você segue.
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {posts.map((post) => {
            const p = post.profiles as any;
            return (
              <div key={post.id}>
                <div className="mb-3 flex items-center gap-3">
                  {p.avatar_url ? (
                    <img
                      src={p.avatar_url}
                      alt={p.display_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                      {String(p.display_name || "?").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <Link
                    href={`/m/${p.username}`}
                    className="text-sm font-semibold text-white hover:underline"
                  >
                    {p.display_name || p.username}
                  </Link>
                </div>
                <SocialPostCard username={p.username} post={post} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
          <p className="text-lg font-semibold text-white">Seu feed está vazio</p>
          <p className="mt-2 text-sm">
            Siga missionários para ver as atualizações deles aqui.
          </p>
          <Link
            href="/admin/descobrir"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Descobrir missionários
          </Link>
        </div>
      )}

      {suggested && suggested.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Sugestões para seguir
          </h2>
          <div className="flex flex-col gap-3">
            {suggested.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {s.avatar_url ? (
                    <img
                      src={s.avatar_url}
                      alt={s.display_name ?? ""}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                      {String(s.display_name || "?").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {s.display_name || s.username}
                    </p>
                    {(s.city || s.state) && (
                      <p className="text-xs text-slate-400">
                        {[s.city, s.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href={s.username ? `/m/${s.username}` : "/admin/descobrir"}
                  className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:opacity-90"
                >
                  Ver perfil
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
