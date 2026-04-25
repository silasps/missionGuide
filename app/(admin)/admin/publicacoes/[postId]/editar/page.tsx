import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePost, deletePost } from "../../actions";
import ImageUploadCropField from "@/components/image-upload-crop-field";
import DeletePostButton from "@/components/delete-post-button";

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function EditarPublicacaoPage({ params }: Props) {
  const { postId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!post) {
    notFound();
  }

  const updateWithId = updatePost.bind(null, post.id);
  const deleteWithId = deletePost.bind(null, post.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Admin / Publicações</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Editar publicação</h1>
        </div>

        <Link
          href="/admin/publicacoes"
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Voltar
        </Link>
      </div>

      <form action={updateWithId} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <ImageUploadCropField
          label="Capa da publicação"
          name="cover_url"
          bucket="post-covers"
          folder="posts"
          currentUrl={post.cover_url ?? ""}
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
            defaultValue={post.title}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Resumo
          </label>
          <textarea
            name="excerpt"
            rows={3}
            defaultValue={post.excerpt ?? ""}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Conteúdo
          </label>
          <textarea
            name="content"
            rows={10}
            defaultValue={post.content ?? ""}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Tipo
            </label>
            <select
              name="post_type"
              defaultValue={post.post_type}
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
              defaultValue={post.status}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Salvar alterações
          </button>
        </div>
      </form>

      <div className="mt-4">
        <DeletePostButton action={deleteWithId} />
      </div>
    </div>
  );
}