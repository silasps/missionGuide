import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: totalPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: publishedPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "published");

  const { count: draftPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "draft");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <p className="text-sm text-slate-400">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          Bem-vindo ao painel
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Aqui você organiza sua presença pública, suas publicações e os próximos
          módulos do sistema.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/perfil"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Editar perfil público
          </Link>

          <Link
            href="/admin/publicacoes"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Ver publicações
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Total de posts</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{totalPosts ?? 0}</h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Publicados</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{publishedPosts ?? 0}</h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Rascunhos</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{draftPosts ?? 0}</h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Status da página</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {(publishedPosts ?? 0) > 0 ? "Online" : "Vazia"}
          </h2>
        </div>
      </div>
    </div>
  );
}