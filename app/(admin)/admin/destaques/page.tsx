import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DestaquesAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  const { data: highlights, error } = await supabase
    .from("highlights")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Destaques da missão</h1>
          <p className="mt-2 text-sm text-slate-400">
            Gerencie os desafios e destaques que aparecem na home e na página de parceria.
          </p>
        </div>

        <Link
          href="/admin/destaques/novo"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          Novo destaque
        </Link>
      </div>

      {highlights?.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl"
            >
              {item.cover_url ? (
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-slate-950 text-slate-500">
                  Sem capa
                </div>
              )}

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.is_active
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {item.is_active ? "Ativo" : "Inativo"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.is_featured
                        ? "bg-blue-500/15 text-blue-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {item.is_featured ? "Destaque" : "Normal"}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-white">{item.title}</h2>

                {item.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/admin/destaques/${item.id}/editar`}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Editar
                  </Link>

                  {profile?.username ? (
                    <Link
                      href={`/m/${profile.username}/destaques/${item.id}`}
                      className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Ver público
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-10 text-slate-400">
          Nenhum destaque cadastrado ainda.
        </div>
      )}
    </div>
  );
}