import ImageUploadCropField from "@/components/image-upload-crop-field";
import { getCurrentProfile } from "@/lib/current-profile";
import { updateProfile } from "./actions";

function timelineToTextarea(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      const year = typeof item?.year === "string" ? item.year : "";
      const text = typeof item?.text === "string" ? item.text : "";
      return `${year} | ${text}`;
    })
    .join("\n");
}

type Props = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function PerfilAdminPage({ searchParams }: Props) {
  const { error, success } = await searchParams;
  const { profile } = await getCurrentProfile();

{error === "username-exists" ? (
  <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
    Esse username já existe. Tente outro.
  </div>
) : null}

{success === "profile-saved" ? (
  <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
    Perfil salvo com sucesso.
  </div>
) : null}

  return (
    <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <div className="mb-8">
          <p className="text-sm text-slate-400">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Perfil público</h1>
          <p className="mt-2 text-sm text-slate-400">
            Configure identidade, história e formas de participação.
          </p>
        </div>

        <form
          action={updateProfile}
          className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          <ImageUploadCropField
            label="Foto do perfil"
            name="avatar_url"
            bucket="profile-avatars"
            folder="avatars"
            currentUrl={profile.avatar_url ?? ""}
            cropShape="round"
            aspect={1}
            outputWidth={600}
            outputHeight={600}
            suggestedSize="quadrada, ex: 1200x1200"
          />

          <ImageUploadCropField
            label="Imagem de capa da história"
            name="story_cover_url"
            bucket="story-images"
            folder="stories"
            currentUrl={profile.story_cover_url ?? ""}
            cropShape="rect"
            aspect={16 / 9}
            outputWidth={1600}
            outputHeight={900}
            suggestedSize="retangular, ex: 1600x900"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Nome público
              </label>
              <input
                name="display_name"
                defaultValue={profile.display_name ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="Ex: Família Silva"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Username público
              </label>
              <input
                name="username"
                defaultValue={profile.username ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="ex: familia-silva"
              />
              <p className="mt-2 text-xs text-slate-500">
                Se deixar em branco, o sistema gera automaticamente a partir do nome público.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={profile.bio ?? ""}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="Uma apresentação curta do seu ministério"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Introdução da história
            </label>
            <textarea
              name="story_intro"
              rows={4}
              defaultValue={profile.story_intro ?? ""}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="Texto de abertura para a página de história"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Nossa história
            </label>
            <textarea
              name="story"
              rows={6}
              defaultValue={profile.story ?? ""}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="Conte sua história, sua família, sua caminhada..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Chamado / como Deus trouxe vocês até aqui
            </label>
            <textarea
              name="calling_story"
              rows={6}
              defaultValue={profile.calling_story ?? ""}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="Compartilhe a palavra, o processo e o direcionamento..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Linha do tempo
            </label>
            <textarea
              name="timeline_raw"
              rows={6}
              defaultValue={timelineToTextarea(profile.timeline_json)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none focus:border-slate-500"
              placeholder={"2020 | Recebemos o chamado\n2021 | Mudamos para o campo\n2023 | Iniciamos o projeto local"}
            />
            <p className="mt-2 text-xs text-slate-500">
              Use uma linha por item, no formato: ano | descrição
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Cidade
              </label>
              <input
                name="city"
                defaultValue={profile.city ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="Cidade"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Estado
              </label>
              <input
                name="state"
                defaultValue={profile.state ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="Estado"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Instagram
              </label>
              <input
                name="instagram_url"
                defaultValue={profile.instagram_url ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                YouTube
              </label>
              <input
                name="youtube_url"
                defaultValue={profile.youtube_url ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                WhatsApp
              </label>
              <input
                name="whatsapp_url"
                defaultValue={profile.whatsapp_url ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="https://wa.me/..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Link de apoio
              </label>
              <input
                name="donation_url"
                defaultValue={profile.donation_url ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Título do bloco de apoio
              </label>
              <input
                name="support_title"
                defaultValue={profile.support_title ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="Ex: Apoie esta missão"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Nome do recebedor Pix
              </label>
              <input
                name="pix_recipient_name"
                defaultValue={profile.pix_recipient_name ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="Ex: João Silva / Missão Silva"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Texto do bloco de apoio
            </label>
            <textarea
              name="support_text"
              rows={4}
              defaultValue={profile.support_text ?? ""}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="Explique como a pessoa pode participar e apoiar"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Tipo da chave Pix
              </label>
              <select
                name="pix_key_type"
                defaultValue={profile.pix_key_type ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              >
                <option value="">Selecione</option>
                <option value="telefone">Telefone</option>
                <option value="email">E-mail</option>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="aleatoria">Chave aleatória</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Chave Pix
              </label>
              <input
                name="pix_key"
                defaultValue={profile.pix_key ?? ""}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="Digite a chave Pix"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Salvar perfil
          </button>
        </form>
      </div>

      <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <p className="text-sm text-slate-400">Preview</p>

        <div className="mt-5">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || "Perfil"}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white">
              {String(profile.display_name || "SM").slice(0, 2).toUpperCase()}
            </div>
          )}

          <h2 className="mt-5 text-2xl font-bold text-white">
            {profile.display_name || "Sistema Missionário"}
          </h2>

          {profile.username ? (
            <p className="mt-2 text-sm text-slate-500">/m/{profile.username}</p>
          ) : null}

          <p className="mt-3 text-sm leading-7 text-slate-400">
            {profile.bio || "Apresentação pública ainda não configurada."}
          </p>
        </div>
      </aside>
    </div>
  );
}
