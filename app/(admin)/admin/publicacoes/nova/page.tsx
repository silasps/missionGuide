import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "../actions";
import ImageUploadCropField from "@/components/image-upload-crop-field";

export default async function NovaPublicacaoPage() {
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
          <p className="text-sm text-slate-400">Admin / Publicações</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Nova publicação</h1>
        </div>

        <Link
          href="/admin/publicacoes"
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Voltar
        </Link>
      </div>

      <form action={createPost} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <ImageUploadCropField
          label="Capa da publicação"
          name="cover_url"
          bucket="post-covers"
          folder="posts"
          cropShape="rect"
          aspect={16 / 10}
          outputWidth={1600}
          outputHeight={1000}
          suggestedSize="retangular, ex: 1600x1000"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Título
          </label>
          <input
            name="title"
            required
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Título da publicação"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Resumo
          </label>
          <textarea
            name="excerpt"
            rows={3}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Resumo curto da publicação"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Conteúdo
          </label>
          <textarea
            name="content"
            rows={10}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Escreva aqui o conteúdo"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Tipo
            </label>
            <select
              name="post_type"
              defaultValue="text"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            >
              <option value="text">Texto</option>
              <option value="image">Imagem</option>
              <option value="video">Vídeo</option>
              <option value="carousel">Carrossel</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Status
            </label>
            <select
              name="status"
              defaultValue="draft"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          Salvar publicação
        </button>
      </form>
    </div>
  );
}