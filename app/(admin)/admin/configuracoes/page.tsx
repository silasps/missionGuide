import { getCurrentProfile } from "@/lib/current-profile";
import { toggleMissionaryMode } from "@/app/(admin)/admin/configuracoes/actions";

export default async function ConfiguracoesPage() {
  const { profile } = await getCurrentProfile();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Configurações</h1>
        <p className="mt-2 text-sm text-slate-400">
          Gerencie as opções da sua conta.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Modo Missionário</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Ative para ter acesso a ferramentas de missionário: publicações,
              destaques, história, pedidos de oração, parceiros e criação com IA.
              Sua página pública ganha todas as seções de um perfil missionário.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await toggleMissionaryMode(!profile.missionary_mode);
            }}
          >
            <button
              type="submit"
              className={`mt-1 shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                profile.missionary_mode
                  ? "border border-slate-600 text-slate-300 hover:bg-slate-800"
                  : "bg-white text-slate-900 hover:opacity-90"
              }`}
            >
              {profile.missionary_mode ? "Desativar" : "Ativar"}
            </button>
          </form>
        </div>

        {profile.missionary_mode && (
          <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Modo Missionário ativo — você tem acesso completo às ferramentas de missão.
          </div>
        )}
      </div>
    </div>
  );
}
