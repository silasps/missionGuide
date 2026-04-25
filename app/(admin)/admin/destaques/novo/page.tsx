import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createHighlight } from "../actions";
import Link from "next/link";
import ImageUploadCropField from "@/components/image-upload-crop-field";

export default async function NovoDestaquePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Admin / Destaques</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Novo destaque</h1>
        </div>

        <Link
          href="/admin/destaques"
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Voltar
        </Link>
      </div>

      <form action={createHighlight} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <ImageUploadCropField
          label="Imagem do destaque"
          name="cover_url"
          bucket="highlight-images"
          folder="highlights"
          cropShape="round"
          aspect={1}
          outputWidth={800}
          outputHeight={800}
          suggestedSize="quadrada, ex: 1200x1200"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Título
          </label>
          <input
            name="title"
            required
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Ex: Desafio Oceania"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Descrição
          </label>
          <textarea
            name="description"
            rows={6}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Explique o desafio"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Texto do botão
            </label>
            <input
              name="cta_label"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="Ex: Saiba mais"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              URL do botão
            </label>
            <input
              name="cta_url"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Ordem
            </label>
            <input
              type="number"
              name="sort_order"
              defaultValue={0}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
            <input type="checkbox" name="is_featured" defaultChecked />
            Mostrar na home
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
            <input type="checkbox" name="is_active" defaultChecked />
            Ativo
          </label>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          Salvar destaque
        </button>
      </form>
    </div>
  );
}