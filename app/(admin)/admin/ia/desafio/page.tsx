import Link from "next/link";
import { createAIDraft } from "../actions";

export default function IADesafioPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Copiloto IA</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Criar desafio com IA
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Responda as perguntas abaixo e a plataforma vai estruturar seu desafio.
          </p>
        </div>

        <Link
          href="/admin/ia"
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Voltar
        </Link>
      </div>

      <form
        action={createAIDraft}
        className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <input type="hidden" name="generation_type" value="desafio" />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Título do desafio
          </label>
          <input
            name="title"
            required
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Ex: Desafio Oceania 2026"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Qual é o propósito deste desafio?
          </label>
          <textarea
            name="purpose"
            rows={4}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Explique o propósito principal"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Descreva o desafio em si
          </label>
          <textarea
            name="challenge_description"
            rows={5}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="O que precisa acontecer? O que será feito?"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Quem será alcançado?
            </label>
            <textarea
              name="audience"
              rows={4}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="Público, comunidade, região, famílias..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Onde isso acontecerá?
            </label>
            <textarea
              name="location"
              rows={4}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              placeholder="Cidade, país, contexto local..."
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Quais custos estão envolvidos?
          </label>
          <textarea
            name="costs"
            rows={4}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Passagens, transporte, alimentação, materiais, outros..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Quais pedidos de oração estão ligados a este desafio?
          </label>
          <textarea
            name="prayer_points"
            rows={4}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
            placeholder="Como as pessoas podem orar?"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          Gerar rascunho
        </button>
      </form>
    </div>
  );
}