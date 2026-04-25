import { getCurrentProfile } from "@/lib/current-profile";
import { updatePartner } from "./actions";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export default async function ParceirosAdminPage() {
  const { supabase, profile } = await getCurrentProfile();

  const { data: partners, error } = await supabase
    .from("partners")
    .select("*, highlights(title)")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-sm text-slate-400">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Parceiros</h1>
        <p className="mt-2 text-sm text-slate-400">
          Gerencie quem demonstrou interesse em apoiar sua missão.
        </p>
      </div>

      {partners?.length ? (
        <div className="grid gap-5">
          {partners.map((partner) => {
            const updateWithId = updatePartner.bind(null, partner.id);

            return (
              <article
                key={partner.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl"
              >
                <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {partner.full_name}
                        </h2>

                        <div className="mt-3 space-y-1 text-sm text-slate-400">
                          {partner.email ? <p>E-mail: {partner.email}</p> : null}
                          {partner.phone ? <p>WhatsApp: {partner.phone}</p> : null}

                          {(partner.city || partner.state) ? (
                            <p>
                              Local: {[partner.city, partner.state].filter(Boolean).join(" • ")}
                            </p>
                          ) : null}

                          <p>Cadastro: {formatDate(partner.created_at)}</p>
                          <p>Último contato: {formatDate(partner.last_contact_at)}</p>

                          <p>
                            Interesse:{" "}
                            {partner.highlight_id
                              ? partner.highlights?.title || "Desafio específico"
                              : "Apoio geral"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          partner.status === "active"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : partner.status === "contacted"
                            ? "bg-blue-500/15 text-blue-300"
                            : partner.status === "inactive"
                            ? "bg-slate-700 text-slate-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {partner.status === "lead"
                          ? "Lead"
                          : partner.status === "contacted"
                          ? "Contatado"
                          : partner.status === "active"
                          ? "Ativo"
                          : "Inativo"}
                      </span>
                    </div>

                    {partner.message ? (
                      <div className="mt-5 rounded-2xl bg-slate-950 p-4">
                        <p className="text-sm font-medium text-slate-300">Mensagem</p>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                          {partner.message}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <h3 className="text-lg font-semibold text-white">
                      Ações rápidas
                    </h3>

                    <form action={updateWithId} className="mt-5 space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">
                          Status
                        </label>
                        <select
                          name="status"
                          defaultValue={partner.status ?? "lead"}
                          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-slate-500"
                        >
                          <option value="lead">Lead</option>
                          <option value="contacted">Contatado</option>
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">
                          Observações
                        </label>
                        <textarea
                          name="notes"
                          rows={5}
                          defaultValue={partner.notes ?? ""}
                          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-slate-500"
                          placeholder="Ex: já conversei por WhatsApp, deseja apoiar mensalmente..."
                        />
                      </div>

                      <label className="flex items-center gap-3 text-sm text-slate-300">
                        <input type="checkbox" name="mark_contacted" value="true" />
                        Atualizar último contato para agora
                      </label>

                      <button
                        type="submit"
                        className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:opacity-90"
                      >
                        Salvar parceiro
                      </button>
                    </form>

                    {partner.phone ? (
                      <a
                        href={`https://wa.me/${partner.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        Abrir WhatsApp
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-slate-400">
          Nenhum parceiro cadastrado ainda.
        </div>
      )}
    </div>
  );
}
