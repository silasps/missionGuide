import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import FollowButton from "@/components/follow-button";

export default async function SeguindoPage() {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  const { data: follows } = await supabase
    .from("follows")
    .select("following_id, profiles!follows_following_id_fkey(id, username, display_name, bio, avatar_url, city, state)")
    .eq("follower_id", profile.id)
    .order("created_at", { ascending: false });

  const following = follows?.map((f) => f.profiles as any) ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Seguindo</h1>
        <p className="mt-2 text-sm text-slate-400">
          Missionários que você acompanha.
        </p>
      </div>

      {following.length > 0 ? (
        <div className="flex flex-col gap-4">
          {following.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <div className="flex items-center gap-4">
                {person.avatar_url ? (
                  <img
                    src={person.avatar_url}
                    alt={person.display_name ?? ""}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-700 text-lg font-semibold text-white">
                    {String(person.display_name || "?").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">
                    {person.display_name || person.username}
                  </p>
                  {(person.city || person.state) && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {[person.city, person.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {person.bio && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                      {person.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 pl-4 sm:flex-row sm:items-center">
                <Link
                  href={`/m/${person.username}`}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Ver perfil
                </Link>
                <FollowButton missionaryId={person.id} isFollowing={true} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
          <p className="text-lg font-semibold text-white">
            Você não segue ninguém ainda
          </p>
          <p className="mt-2 text-sm">
            Encontre missionários e clique em Seguir para acompanhar as atualizações.
          </p>
          <Link
            href="/admin/descobrir"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Descobrir missionários
          </Link>
        </div>
      )}
    </div>
  );
}
