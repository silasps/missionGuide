import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/current-profile";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function IADesafioResultPage({ params }: Props) {
  const { id } = await params;
  const { supabase, profile } = await getCurrentProfile();

  const { data: item, error } = await supabase
    .from("ai_generations")
    .select("*")
    .eq("id", id)
    .eq("profile_id", profile.id)
    .eq("generation_type", "desafio")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!item) {
    notFound();
  }

  const context = item.prompt_context as Record<string, string> | null;
  const result = item.generated_result as
    | {
        summary?: string;
        carousel_suggestion?: string[];
        video_suggestion?: string;
      }
    | null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Copiloto IA</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            {item.title || "Rascunho de desafio"}
          </h1>
        </div>

        <Link
          href="/admin/ia"
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Voltar
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Respostas fornecidas</h2>

          <div className="mt-5 space-y-5 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white">Propósito</p>
              <p className="mt-2 whitespace-pre-wrap">{context?.purpose || "-"}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Descrição do desafio</p>
              <p className="mt-2 whitespace-pre-wrap">{context?.challenge_description || "-"}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Público alcançado</p>
              <p className="mt-2 whitespace-pre-wrap">{context?.audience || "-"}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Local</p>
              <p className="mt-2 whitespace-pre-wrap">{context?.location || "-"}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Custos</p>
              <p className="mt-2 whitespace-pre-wrap">{context?.costs || "-"}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Pedidos de oração</p>
              <p className="mt-2 whitespace-pre-wrap">{context?.prayer_points || "-"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Estrutura sugerida</h2>

          <div className="mt-5 space-y-5 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white">Resumo</p>
              <p className="mt-2 whitespace-pre-wrap">
                {result?.summary || "Sem resultado ainda."}
              </p>
            </div>

            <div>
              <p className="font-semibold text-white">Sugestão de carrossel</p>
              {result?.carousel_suggestion?.length ? (
                <ol className="mt-2 list-decimal space-y-2 pl-5">
                  {result.carousel_suggestion.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2">Sem sugestão.</p>
              )}
            </div>

            <div>
              <p className="font-semibold text-white">Sugestão de vídeo</p>
              <p className="mt-2 whitespace-pre-wrap">
                {result?.video_suggestion || "Sem sugestão."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}