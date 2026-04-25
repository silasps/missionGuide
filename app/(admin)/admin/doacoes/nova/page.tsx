import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import { createDonation } from "@/app/(admin)/admin/doacoes/actions";
import Link from "next/link";

export default async function NovaDoacaoPage() {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  const { data: follows } = await supabase
    .from("follows")
    .select("following_id, profiles!follows_following_id_fkey(id, display_name, username)")
    .eq("follower_id", profile.id);

  const missionaries = follows?.map((f) => f.profiles as any) ?? [];

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <Link
          href="/admin/doacoes"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Voltar
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-white">Registrar doação</h1>
        <p className="mt-2 text-sm text-slate-400">
          Registre uma doação que você fez para um missionário.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <form action={createDonation} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Missionário
            </label>
            {missionaries.length > 0 ? (
              <select
                name="missionary_id"
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-slate-500"
              >
                <option value="">Selecione</option>
                {missionaries.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.display_name || m.username}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-slate-400">
                Você precisa seguir um missionário para registrar uma doação.{" "}
                <Link href="/" className="underline text-white">
                  Descobrir missionários
                </Link>
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Valor (R$)
            </label>
            <input
              name="amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Observação
            </label>
            <textarea
              name="note"
              rows={3}
              placeholder="Opcional — ex: transferência Pix em janeiro"
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-slate-500"
            />
          </div>

          {missionaries.length > 0 && (
            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:opacity-90"
            >
              Salvar doação
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
