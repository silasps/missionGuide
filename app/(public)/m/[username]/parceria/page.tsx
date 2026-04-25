import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MissionaryProfileHeader from "@/components/missionary-profile-header";
import MissionaryPublicNav from "@/components/missionary-public-nav";
import { createPartner } from "@/app/(public)/parceria/actions";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ desafio?: string }>;
};

export default async function MissionaryPartnershipPage({
  params,
  searchParams,
}: Props) {
  const { username } = await params;
  const { desafio } = await searchParams;

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

  const { data: highlights, error: highlightsError } = await supabase
    .from("highlights")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (highlightsError) {
    throw new Error(highlightsError.message);
  }

  const selectedHighlight =
    highlights?.find((item) => item.id === desafio) ?? null;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MissionaryProfileHeader profile={profile} />
      <MissionaryPublicNav username={profile.username} />

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm text-slate-500">Parceria missionária</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
              Seja parceiro de {profile.display_name || "esta missão"}
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Você pode apoiar esta missão de forma contínua ou participar de um
              desafio específico.
            </p>
          </div>

          {selectedHighlight ? (
            <div className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-6">
              <p className="text-sm font-medium text-blue-700">
                Desafio selecionado
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {selectedHighlight.title}
              </h2>
              {selectedHighlight.description ? (
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {selectedHighlight.description}
                </p>
              ) : null}
            </div>
          ) : null}

          {highlights?.length ? (
            <section className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Desafios específicos</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {highlights.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    {item.cover_url ? (
                      <img
                        src={item.cover_url}
                        alt={item.title}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-slate-100 text-slate-400">
                        Sem capa
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="text-xl font-semibold">{item.title}</h3>

                      {item.description ? (
                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/m/${profile.username}/destaques/${item.id}`}
                          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          Ver desafio
                        </Link>

                        <Link
                          href={`/m/${profile.username}/parceria?desafio=${item.id}#form-parceria`}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                          Apoiar este desafio
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold">Formas de participar</h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Ore, acompanhe atualizações e, se desejar, contribua financeiramente.
              </p>

              {profile.support_title || profile.support_text ? (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {profile.support_title || "Apoie esta missão"}
                  </h3>

                  {profile.support_text ? (
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {profile.support_text}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {profile.pix_key ? (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">Pix</p>

                  {profile.pix_recipient_name ? (
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {profile.pix_recipient_name}
                    </p>
                  ) : null}

                  {profile.pix_key_type ? (
                    <p className="mt-1 text-sm text-slate-500">
                      Tipo da chave: {profile.pix_key_type}
                    </p>
                  ) : null}

                  <div className="mt-3 rounded-2xl bg-white p-4 text-sm font-medium text-slate-900 break-all">
                    {profile.pix_key}
                  </div>
                </div>
              ) : null}
            </div>

            <div
              id="form-parceria"
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-900">Quero fazer parte</h2>

              <form action={createPartner} className="mt-6 space-y-4">
                <input type="hidden" name="profile_id" value={profile.id} />
                <input type="hidden" name="missionary_username" value={profile.username} />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nome completo
                  </label>
                  <input
                    name="full_name"
                    required
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quero apoiar
                  </label>
                  <select
                    name="highlight_id"
                    defaultValue={desafio || ""}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                  >
                    <option value="">A missão de forma geral</option>
                    {highlights?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                      placeholder="voce@email.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      WhatsApp
                    </label>
                    <input
                      name="phone"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Cidade
                    </label>
                    <input
                      name="city"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Estado
                    </label>
                    <input
                      name="state"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                      placeholder="Estado"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Mensagem
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="Escreva uma mensagem"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Enviar cadastro
                </button>
              </form>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
