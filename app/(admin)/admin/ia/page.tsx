import Link from "next/link";
import { getCurrentProfile } from "@/lib/current-profile";

export default async function IAPage() {
  const { supabase, profile } = await getCurrentProfile();

  const { data: generations, error } = await supabase
    .from("ai_generations")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <p className="text-sm text-slate-400">Copiloto IA</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          Criar com IA
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Use perguntas guiadas para estruturar desafios, posts e relatórios.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/ia/desafio"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Novo desafio com IA
          </Link>

        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">Rascunhos recentes</h2>

        {generations?.length ? (
          <div className="mt-6 grid gap-4">
            {generations.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">
                      {item.title || "Sem título"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Tipo: {item.generation_type} · Status: {item.status}
                    </p>
                  </div>

                  <Link
                    href={`/admin/ia/${item.generation_type}/${item.id}`}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Abrir
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-8 text-slate-400">
            Nenhum rascunho criado ainda.
          </div>
        )}
      </div>
    </div>
  );
}