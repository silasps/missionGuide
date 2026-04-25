"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import {
  addAccount,
  addCategory,
  deleteAccount,
  deleteCategory,
  updateAccount,
  updateCategory,
} from "../actions";

export type FinanceSettingsCategory = {
  id: string;
  name: string;
};

export type FinanceSettingsAccount = {
  id: string;
  name: string;
  kind: string;
  currency: string;
};

type Props = {
  accounts: FinanceSettingsAccount[];
  categories: FinanceSettingsCategory[];
};

const CURRENCIES = [
  { code: "BRL", label: "R$ BRL - Real" },
  { code: "USD", label: "$ USD - Dolar" },
  { code: "EUR", label: "€ EUR - Euro" },
];

const TABS = [
  { key: "accounts", label: "Contas" },
  { key: "categories", label: "Categorias" },
  { key: "preferences", label: "Preferências" },
  { key: "about", label: "Sobre" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function accountIcon(account: FinanceSettingsAccount) {
  if (account.currency === "USD") return "$";
  if (account.currency === "EUR") return "€";
  return "R$";
}

function SettingsCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export default function FinanceSettingsPanel({ accounts, categories }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("accounts");
  const [defaultCurrency, setDefaultCurrency] = useState("BRL");
  const categoryGroups = useMemo(
    () => [
      {
        title: "Categorias",
        items: categories,
      },
    ],
    [categories],
  );

  function saveDefaultCurrency() {
    localStorage.setItem("finance-default-currency", defaultCurrency);
  }

  return (
    <div className="-mx-4 -my-6 min-h-screen bg-slate-950 text-white sm:-mx-6">
      <div className="bg-slate-950 px-4 pt-4 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3">
            <Link href="/admin/financeiro" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white">
              <ArrowLeft size={16} /> Financeiro
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-1 border-b border-slate-800">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`min-h-12 border-b-2 px-1 text-center text-xs font-semibold transition sm:text-sm ${
                  activeTab === tab.key
                    ? "border-orange-400 text-orange-300"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {activeTab === "accounts" ? (
          <section>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">Contas bancárias</h1>
            </div>

            <form action={addAccount} className="mb-4 grid gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3 md:grid-cols-[1fr_140px_110px_auto]">
              <input name="name" required placeholder="Nome da conta" className="min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-500" />
              <select name="kind" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500">
                <option value="bank">Conta</option>
                <option value="cash">Dinheiro</option>
                <option value="credit_card">Cartão</option>
              </select>
              <select name="currency" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500">
                {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
              </select>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
                <Plus size={16} />Adicionar
              </button>
            </form>

            <div className="space-y-3">
              {accounts.map((account) => (
                <SettingsCard key={account.id}>
                  <form action={updateAccount.bind(null, account.id)} className="grid grid-cols-[52px_1fr_auto] items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-lg font-semibold text-orange-200">
                      {accountIcon(account)}
                    </div>
                    <div className="min-w-0">
                      <input name="name" defaultValue={account.name} required className="min-w-0 rounded-xl border border-transparent bg-transparent px-1 py-1 text-base font-semibold text-white outline-none focus:border-slate-700 sm:text-lg" />
                      <div className="mt-1 grid gap-2 sm:grid-cols-[140px_110px]">
                        <select name="kind" defaultValue={account.kind} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-orange-500">
                          <option value="bank">Conta</option>
                          <option value="cash">Dinheiro</option>
                          <option value="credit_card">Cartão</option>
                        </select>
                        <select name="currency" defaultValue={account.currency} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-orange-500">
                          {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-orange-500/10 hover:text-orange-300" aria-label="Salvar conta">
                        <Pencil size={16} />
                      </button>
                      <button formAction={deleteAccount.bind(null, account.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-300" aria-label="Excluir conta">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </form>
                </SettingsCard>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "categories" ? (
          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">Categorias</h1>
            </div>

            <form action={addCategory} className="mb-5 flex gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3">
              <input name="name" required placeholder="Nova categoria" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-500" />
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
                <Plus size={16} />Adicionar
              </button>
            </form>

            <div className="space-y-4">
              {categoryGroups.map((group) => (
                <div key={group.title} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <h2 className="text-base font-semibold">{group.title}</h2>
                    <span className="text-sm text-slate-400">{group.items.length} categorias</span>
                  </div>
                  <div className="space-y-3 p-3 sm:p-4">
                    {group.items.map((category) => (
                      <SettingsCard key={category.id}>
                        <form action={updateCategory.bind(null, category.id)} className="grid grid-cols-[52px_1fr_auto] items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-lg text-orange-200">↓</div>
                          <div className="min-w-0">
                            <input name="name" defaultValue={category.name} required className="min-w-0 rounded-xl border border-transparent bg-transparent px-1 py-1 text-base font-semibold text-white outline-none focus:border-slate-700 sm:text-lg" />
                            <p className="px-1 text-xs text-slate-500">Categoria de lançamento</p>
                          </div>
                          <div className="flex gap-1">
                            <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-orange-500/10 hover:text-orange-300" aria-label="Salvar categoria">
                              <Pencil size={16} />
                            </button>
                            <button formAction={deleteCategory.bind(null, category.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-300" aria-label="Excluir categoria">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </form>
                      </SettingsCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "preferences" ? (
          <section>
            <h1 className="mb-5 text-2xl font-semibold text-white sm:text-3xl">Preferências</h1>
            <SettingsCard>
              <h2 className="text-lg font-semibold">Moeda principal</h2>
              <p className="mt-1 text-sm text-slate-400">Define a moeda exibida por padrão nos novos lançamentos.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <select value={defaultCurrency} onChange={(event) => setDefaultCurrency(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500">
                  {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
                </select>
                <button type="button" onClick={saveDefaultCurrency} className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
                  Salvar
                </button>
              </div>
            </SettingsCard>
            <a href="mailto:suporte@sistemamissionario.com?subject=Feedback%20financeiro" className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 hover:border-orange-500/60">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-white"><MessageCircle size={20} /></span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold">Enviar feedback</span>
                  <span className="block text-sm text-slate-400">Sugestões, bugs ou pedidos de moedas</span>
                </span>
              </span>
              <span className="text-lg text-orange-400">→</span>
            </a>
          </section>
        ) : null}

        {activeTab === "about" ? (
          <section>
            <h1 className="mb-5 text-2xl font-semibold text-white sm:text-3xl">Sobre</h1>
            <SettingsCard>
              <h2 className="text-lg font-semibold">Financeiro missionário</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Esta área concentra contas, categorias e preferências usadas nos lançamentos financeiros.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-400">
                <Trash2 size={16} /> Excluir uma conta ou categoria remove o vínculo dos lançamentos antigos, sem apagar os lançamentos.
              </div>
            </SettingsCard>
          </section>
        ) : null}
      </main>
    </div>
  );
}
