import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MissionaryProfileHeader from "@/components/missionary-profile-header";
import MissionaryPublicNav from "@/components/missionary-public-nav";

type Props = {
  params: Promise<{ username: string; id: string }>;
};

export default async function MissionaryHighlightPage({ params }: Props) {
  const { username, id } = await params;
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

  const { data: item, error } = await supabase
    .from("highlights")
    .select("*")
    .eq("id", id)
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MissionaryProfileHeader profile={profile} />
      <MissionaryPublicNav username={profile.username} />

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <article>
          {item.cover_url ? (
            <img
              src={item.cover_url}
              alt={item.title}
              className="w-full rounded-3xl border border-slate-200 object-cover shadow-sm"
            />
          ) : null}

          <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
            {item.title}
          </h1>

          {item.description ? (
            <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">
              {item.description}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/m/${profile.username}/parceria?desafio=${item.id}#form-parceria`}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Apoiar este desafio
            </Link>

            {item.cta_url ? (
              <Link
                href={item.cta_url}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {item.cta_label || "Saiba mais"}
              </Link>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}
