import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { getCurrentProfile } from "@/lib/current-profile";

type Props = {
  searchParams: Promise<{ deleted?: string }>;
};

export default async function PublicacoesAdminPage({ searchParams }: Props) {
  const { deleted } = await searchParams;
  const { supabase, profile } = await getCurrentProfile();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Publicações</h1>
          <p className="mt-2 text-sm text-slate-400">
            Gerencie os conteúdos que aparecem na área pública.
          </p>
        </div>

        <Link
          href="/admin/publicacoes/nova"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          Nova publicação
        </Link>
      </div>

      {deleted === "1" ? (
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          Publicação excluída com sucesso.
        </div>
      ) : null}

      {posts?.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl"
            >
              {post.cover_url ? (
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-slate-950 text-slate-500">
                  Sem capa
                </div>
              )}

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                    {post.post_type}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      post.status === "published"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    {post.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-white">
                  {post.title}
                </h2>

                {post.excerpt ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {post.excerpt}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Sem resumo.</p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/admin/publicacoes/${post.id}/editar`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    <Pencil size={15} />Editar
                  </Link>

                  {post.status === "published" && profile.username ? (
                    <Link
                      href={`/m/${profile.username}/publicacoes/${post.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      <ExternalLink size={15} />Ver público
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-slate-400">
          Nenhuma publicação ainda.
        </div>
      )}
    </div>
  );
}
