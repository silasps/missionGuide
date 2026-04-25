import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MissionaryProfileHeader from "@/components/missionary-profile-header";
import MissionaryPublicNav from "@/components/missionary-public-nav";
import { createPrayerRequest } from "@/app/(public)/actions";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function MissionaryPrayerPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MissionaryProfileHeader profile={profile} />
      <MissionaryPublicNav username={profile.username} />

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium text-slate-500">Intercessão</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Envie um pedido de oração
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Compartilhe seu pedido. Nome, e-mail e WhatsApp são opcionais.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <form action={createPrayerRequest} className="space-y-4">
              <input type="hidden" name="profile_id" value={profile.id} />
              <input type="hidden" name="missionary_username" value={profile.username} />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nome (opcional)
                </label>
                <input
                  name="full_name"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    inputMode="email"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="voce@email.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    WhatsApp (opcional)
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    inputMode="tel"
                    pattern="^(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4})-?\d{4}$"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    placeholder="(41) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pedido de oração
                </label>
                <textarea
                  name="request_text"
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                  placeholder="Escreva aqui seu pedido"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="is_private"
                  type="checkbox"
                  name="is_private"
                  value="true"
                  defaultChecked
                />
                <label htmlFor="is_private" className="text-sm text-slate-700">
                  Manter como pedido privado
                </label>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Enviar pedido
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}