import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import { formatDate } from "@/lib/format";

export default async function DoacoesPage() {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  const { data: donations } = await supabase
    .from("donations")
    .select("*, profiles!donations_missionary_id_fkey(id, display_name, username, avatar_url)")
    .eq("donor_id", profile.id)
    .order("created_at", { ascending: false });

  const total = donations
    ?.filter((d) => d.amount)
    .reduce((sum, d) => sum + (d.amount ?? 0), 0) ?? 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Minhas doações</h1>
          <p className="mt-2 text-sm text-slate-400">
            Histórico de contribuições que você registrou.
          </p>
        </div>
        <Link
          href="/admin/doacoes/nova"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          Registrar doação
        </Link>
      </div>

      {total > 0 && (
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total registrado</p>
          <p className="mt-1 text-3xl font-bold text-white">
            R$ {total.toFixed(2).replace(".", ",")}
          </p>
        </div>
      )}

      {donations && donations.length > 0 ? (
        <div className="flex flex-col gap-3">
          {donations.map((donation) => {
            const missionary = donation.profiles as any;
            return (
              <div
                key={donation.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex items-center gap-3">
                  {missionary?.avatar_url ? (
                    <img
                      src={missionary.avatar_url}
                      alt={missionary.display_name ?? ""}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                      {String(missionary?.display_name || "?").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {missionary?.display_name || missionary?.username}
                    </p>
                    {donation.note && (
                      <p className="mt-0.5 text-xs text-slate-400">{donation.note}</p>
                    )}
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDate(donation.created_at)}
                    </p>
                  </div>
                </div>
                {donation.amount && (
                  <p className="shrink-0 pl-4 text-base font-bold text-white">
                    R$ {donation.amount.toFixed(2).replace(".", ",")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          <p className="text-lg font-semibold text-white">Nenhuma doação registrada</p>
          <p className="mt-2 text-sm">
            Registre suas contribuições para acompanhar o histórico.
          </p>
          <Link
            href="/admin/doacoes/nova"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Registrar primeira doação
          </Link>
        </div>
      )}
    </div>
  );
}
