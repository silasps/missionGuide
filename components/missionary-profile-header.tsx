import Link from "next/link";

import type { ReactNode } from "react";

type Profile = {
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
};

export default function MissionaryProfileHeader({
  profile,
  followButton,
}: {
  profile: Profile;
  followButton?: ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="mx-auto md:mx-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "Perfil"}
                className="h-28 w-28 rounded-full object-cover ring-4 ring-slate-100 sm:h-36 sm:w-36"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white ring-4 ring-slate-100 sm:h-36 sm:w-36">
                {String(profile.display_name || "SM").slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {profile.display_name || "Missionário"}
              </h1>

              <div className="flex flex-wrap gap-2">
                {followButton ?? null}

                {profile.username ? (
                  <Link
                    href={`/m/${profile.username}/parceria`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Seja parceiro
                  </Link>
                ) : null}

                {profile.instagram_url ? (
                  <Link
                    href={profile.instagram_url}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Instagram
                  </Link>
                ) : null}

                {profile.youtube_url ? (
                  <Link
                    href={profile.youtube_url}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    YouTube
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 text-sm sm:max-w-md">
              <div>
                <p className="font-bold text-slate-900">Perfil</p>
                <p className="text-slate-500">Missionário</p>
              </div>

              <div>
                <p className="font-bold text-slate-900">Cidade</p>
                <p className="text-slate-500">{profile.city || "-"}</p>
              </div>

              <div>
                <p className="font-bold text-slate-900">Estado</p>
                <p className="text-slate-500">{profile.state || "-"}</p>
              </div>
            </div>

            {profile.bio ? (
              <p className="mt-5 max-w-2xl whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-base">
                {profile.bio}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}