import Link from "next/link";
import { getCurrentProfile } from "@/lib/current-profile";
import FollowButton from "@/components/follow-button";

type ProfileCard = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  is_public: boolean;
};

export default async function DescobrirPage() {
  const { supabase, profile } = await getCurrentProfile();

  const [{ data: people, error }, { data: follows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, city, state, is_public")
      .neq("id", profile.id)
      .order("display_name", { ascending: true }),
    supabase.from("follows").select("following_id").eq("follower_id", profile.id),
  ]);

  if (error) throw new Error(error.message);

  const followingIds = new Set((follows ?? []).map((item) => item.following_id));
  const profiles = (people ?? []) as ProfileCard[];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Descobrir missionários</h1>
        <p className="mt-2 text-sm text-slate-400">
          Encontre pessoas para seguir e acompanhar no seu feed.
        </p>
      </div>

      {profiles.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {profiles.map((person) => (
            <article key={person.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex gap-4">
                {person.avatar_url ? (
                  <img src={person.avatar_url} alt={person.display_name ?? ""} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-700 text-lg font-semibold text-white">
                    {String(person.display_name || "?").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-white">{person.display_name || person.username}</p>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                      {person.is_public ? "Público" : "Privado"}
                    </span>
                  </div>
                  {(person.city || person.state) ? (
                    <p className="mt-1 text-xs text-slate-400">{[person.city, person.state].filter(Boolean).join(", ")}</p>
                  ) : null}
                  {person.bio ? <p className="mt-2 line-clamp-2 text-sm text-slate-400">{person.bio}</p> : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {person.username ? (
                  <Link href={`/m/${person.username}`} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800">
                    Ver perfil
                  </Link>
                ) : null}
                <FollowButton missionaryId={person.id} isFollowing={followingIds.has(person.id)} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          Nenhum missionário disponível por enquanto.
        </div>
      )}
    </div>
  );
}
