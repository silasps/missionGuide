"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeftRight, ArrowUpDown, BarChart3, Building2, Home, Pencil, Search, Settings, Trash2, X } from "lucide-react";
import {
  addAccount,
  addCategory,
  addTransaction,
  createQuickCategory,
  deleteAccount,
  deleteCategory,
  deleteTransaction,
  updateAccount,
  updateCategory,
  updateTransaction,
} from "./actions";

export type FinanceCategory = {
  id: string;
  name: string;
};

export type FinanceAccount = {
  id: string;
  name: string;
  kind: string;
  currency: string;
};

export type FinanceTransaction = {
  id: string;
  date: string;
  description: string;
  location: string | null;
  notes: string | null;
  amount: number | null;
  currency: string;
  category_id: string | null;
  account_id: string | null;
  type: "income" | "expense";
  mode: "normal" | "initial_balance" | "credit_purchase" | "fixed_expense";
  due_date: string | null;
  tithe_eligible: boolean | null;
  finance_categories?: FinanceCategory | FinanceCategory[] | null;
  finance_accounts?: FinanceAccount | FinanceAccount[] | null;
};

type Props = {
  categories: FinanceCategory[];
  accounts: FinanceAccount[];
  transactions: FinanceTransaction[];
  metrics: {
    income: number;
    expenses: number;
    balance: number;
    projectedBalance: number;
    tithe: number;
    topExpenses: { name: string; amount: number }[];
  };
  filters: {
    from: string;
    to: string;
    category: string;
    type: string;
    currency: string;
    month: string;
  };
};

const CURRENCIES = [
  { code: "BRL", label: "Real (BRL)" },
  { code: "USD", label: "Dólar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
];

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function money(value: number | null, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value ?? 0);
}

function currencySymbol(currency = "BRL") {
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  return "R$";
}

function decimalSeparator(currency = "BRL") {
  return currency === "USD" ? "." : ",";
}

function formatAmountInput(value: string, currency = "BRL") {
  const digits = value.replace(/\D/g, "");
  const cents = digits.padStart(3, "0");
  const integerPart = cents.slice(0, -2).replace(/^0+(?=\d)/, "") || "0";
  return `${integerPart}${decimalSeparator(currency)}${cents.slice(-2)}`;
}

function dateBR(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function categoryName(transaction: FinanceTransaction) {
  const category = transaction.finance_categories;
  if (!category) return "Sem categoria";
  if (Array.isArray(category)) return category[0]?.name ?? "Sem categoria";
  return category.name;
}

function accountName(transaction: FinanceTransaction) {
  const account = transaction.finance_accounts;
  if (!account) return "Sem conta";
  if (Array.isArray(account)) return account[0]?.name ?? "Sem conta";
  return account.name;
}

function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-x-hidden overflow-y-auto bg-slate-950/80 px-3 py-5 backdrop-blur sm:px-4 sm:py-6">
      <div className="mx-auto w-full max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:max-w-2xl">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TransactionForm({
  categories,
  accounts,
  transaction,
  onEditAccounts,
  initialBalance,
}: {
  categories: FinanceCategory[];
  accounts: FinanceAccount[];
  transaction?: FinanceTransaction;
  onEditAccounts: () => void;
  initialBalance?: boolean;
}) {
  const [type, setType] = useState<"income" | "expense">(transaction?.type ?? (initialBalance ? "income" : "expense"));
  const mode = transaction?.mode ?? (initialBalance ? "initial_balance" : "normal");
  const [currency, setCurrency] = useState(transaction?.currency ?? accounts[0]?.currency ?? "BRL");
  const [amount, setAmount] = useState(
    transaction?.amount ? formatAmountInput(String(Math.round(Number(transaction.amount) * 100)), transaction.currency) : "",
  );
  const initialCategory = initialBalance
    ? categories.find((category) => category.name === "Saldo inicial")?.id
    : undefined;
  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [categoryId, setCategoryId] = useState(transaction?.category_id ?? initialCategory ?? "");
  const [quickCategoryOpen, setQuickCategoryOpen] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(Boolean(transaction?.location || transaction?.notes));
  const [pendingCategory, startCategoryTransition] = useTransition();
  const action = transaction ? updateTransaction.bind(null, transaction.id) : addTransaction;

  function handleAccountChange(accountId: string) {
    const account = accounts.find((item) => item.id === accountId);
    if (account?.currency) {
      setCurrency(account.currency);
      setAmount((current) => current ? formatAmountInput(current, account.currency) : "");
    }
  }

  function createCategoryFromModal() {
    startCategoryTransition(async () => {
      const category = await createQuickCategory(quickCategoryName);
      setCategoryOptions((current) => [...current, category]);
      setCategoryId(category.id);
      setQuickCategoryName("");
      setQuickCategoryOpen(false);
    });
  }

  return (
    <form action={action} className="grid w-full min-w-0 max-w-full gap-3 overflow-hidden md:grid-cols-2">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="due_date" value={transaction?.due_date ?? ""} />
      <div className="w-full min-w-0 rounded-2xl bg-orange-500/10 p-1 md:col-span-2">
        <div className="grid grid-cols-2 gap-1">
          <label className={`flex min-w-0 items-center justify-center truncate rounded-xl px-2 py-2.5 text-sm font-semibold ${type === "income" ? "bg-white text-blue-900" : "text-slate-500"}`}>
            <input className="sr-only" type="radio" name="type" value="income" checked={type === "income"} onChange={() => setType("income")} />
            ↑ Entrada
          </label>
          <label className={`flex min-w-0 items-center justify-center truncate rounded-xl px-2 py-2.5 text-sm font-semibold ${type === "expense" ? "bg-white text-red-700" : "text-slate-500"}`}>
            <input className="sr-only" type="radio" name="type" value="expense" checked={type === "expense"} onChange={() => setType("expense")} />
            ↓ Saída
          </label>
        </div>
      </div>
      <div className="w-full min-w-0 rounded-2xl border border-orange-500/40 bg-slate-950 p-4 shadow-[0_0_0_1px_rgba(249,115,22,0.12)] md:col-span-2">
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-orange-300">Valor</label>
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-lg font-bold text-white">
            {currencySymbol(currency)}
          </span>
          <input name="amount" type="text" inputMode="numeric" value={amount} onChange={(event) => setAmount(formatAmountInput(event.target.value, currency))} required placeholder={`0${decimalSeparator(currency)}00`} className="w-full min-w-0 flex-1 rounded-xl border border-transparent bg-white px-4 py-3 text-3xl font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:border-orange-400 sm:text-4xl" />
        </div>
      </div>
      <div className="min-w-0">
        <label className="mb-2 block text-sm font-medium text-slate-300">Data</label>
        <input name="date" type="date" defaultValue={transaction?.date ?? today()} required className="block w-full min-w-0 max-w-full appearance-none rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-slate-500" />
      </div>
      <div className="min-w-0">
        <label className="mb-2 block text-sm font-medium text-slate-300">Descrição</label>
        <input name="description" defaultValue={transaction?.description ?? ""} required placeholder={type === "income" ? "Apoiador, igreja ou descrição..." : "Ex: mercado, oferta, gasolina"} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500" />
      </div>
      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-slate-300">Categoria</label>
          <button type="button" onClick={() => setQuickCategoryOpen(true)} className="inline-flex items-center gap-1 rounded-xl bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-300 hover:bg-orange-500/20">
            + Nova
          </button>
        </div>
        <div className="flex min-w-0 gap-2">
          <select name="category_id" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required className="w-full min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-slate-500">
            <option value="">Selecione</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-slate-300">Conta / banco / cartão</label>
          <button type="button" onClick={onEditAccounts} className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white">
            <Building2 size={13} />Editar
          </button>
        </div>
        <select name="account_id" defaultValue={transaction?.account_id ?? accounts[0]?.id ?? ""} onChange={(event) => handleAccountChange(event.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-slate-500">
          <option value="">Selecione</option>
          {accounts.map((account) => <option key={account.id} value={account.id}>{account.name} ({account.currency})</option>)}
        </select>
      </div>
      {type === "income" ? (
        <label className="flex items-center gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-slate-200 md:col-span-2">
          <input name="tithe_eligible" type="checkbox" defaultChecked={transaction?.tithe_eligible ?? true} />
          Considerar esta entrada no cálculo do dízimo
        </label>
      ) : null}
      <div className="border-t border-slate-700 pt-4 md:col-span-2">
        <button type="button" onClick={() => setDetailsOpen((value) => !value)} className="text-sm font-semibold text-slate-400 hover:text-white">
          {detailsOpen ? "▾ Ocultar detalhes" : "▸ Adicionar observações"}
        </button>
      </div>
      {detailsOpen ? (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Local / origem</label>
            <input name="location" defaultValue={transaction?.location ?? ""} placeholder={type === "income" ? "Ex: transferência, depósito..." : "Ex: mercado, farmácia..."} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Observações</label>
            <textarea name="notes" defaultValue={transaction?.notes ?? ""} rows={3} placeholder="Detalhes adicionais..." className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500" />
          </div>
        </>
      ) : null}
      <button type="submit" className="w-full rounded-xl bg-orange-500 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-950/30 hover:bg-orange-600 md:col-span-2">
        Salvar
      </button>
      {quickCategoryOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-x-hidden bg-slate-950/80 px-3 backdrop-blur">
          <div className="w-full max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:max-w-sm sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Nova categoria</h3>
              <button type="button" onClick={() => setQuickCategoryOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Fechar">
                <X size={17} />
              </button>
            </div>
            <div className="space-y-4">
              <input autoFocus value={quickCategoryName} onChange={(event) => setQuickCategoryName(event.target.value)} placeholder="Nome da categoria" className="w-full rounded-xl border border-slate-700 bg-white px-3 py-3 text-sm text-slate-950 placeholder:text-slate-400 outline-none focus:border-orange-400" />
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setQuickCategoryOpen(false)} className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white">Cancelar</button>
                <button type="button" onClick={createCategoryFromModal} disabled={pendingCategory} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}

export default function FinancePanel({ categories, accounts, transactions, metrics, filters }: Props) {
  const [activeView, setActiveView] = useState<"home" | "entries" | "transfers" | "settings">("home");
  const [entryFilter, setEntryFilter] = useState<"all" | "income" | "expense" | "card">("all");
  const [entrySearchOpen, setEntrySearchOpen] = useState(false);
  const [entrySearch, setEntrySearch] = useState("");
  const [transactionModal, setTransactionModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [accountModal, setAccountModal] = useState(false);
  const [accountRequiredModal, setAccountRequiredModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editing, setEditing] = useState<FinanceTransaction | null>(null);
  const maxExpense = useMemo(
    () => Math.max(...metrics.topExpenses.map((item) => item.amount), 1),
    [metrics.topExpenses],
  );
  const monthDate = new Date(`${filters.month}-02T00:00:00`);
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString().slice(0, 10);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).toISOString().slice(0, 10);
  const prevMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1).toISOString().slice(0, 7);
  const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).toISOString().slice(0, 7);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(monthDate);
  const viewButtonClass = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[11px] font-semibold";
  const entrySearchTerm = entrySearch.trim().toLowerCase();
  const visibleTransactions = transactions.filter((transaction) => {
    const isInMonth = transaction.date >= monthStart && transaction.date <= monthEnd;
    const isCard = transaction.mode === "credit_purchase" || (Array.isArray(transaction.finance_accounts)
      ? transaction.finance_accounts[0]?.kind === "credit_card"
      : transaction.finance_accounts?.kind === "credit_card");
    const matchesQuickFilter =
      entryFilter === "all" ||
      transaction.type === entryFilter ||
      (entryFilter === "card" && isCard);
    const searchable = [
      transaction.description,
      transaction.location,
      transaction.notes,
      categoryName(transaction),
      accountName(transaction),
    ].join(" ").toLowerCase();

    return isInMonth && matchesQuickFilter && (!entrySearchTerm || searchable.includes(entrySearchTerm));
  });
  const transactionsByDate = visibleTransactions.reduce<Record<string, FinanceTransaction[]>>((acc, transaction) => {
    acc[transaction.date] = [...(acc[transaction.date] ?? []), transaction];
    return acc;
  }, {});
  const entryDates = Object.keys(transactionsByDate).sort((a, b) => b.localeCompare(a));

  function openTransactionModal() {
    if (!accounts.length) {
      setAccountRequiredModal(true);
      return;
    }
    setTransactionModal(true);
  }

  return (
    <div className="-mx-4 -my-6 min-h-screen bg-slate-950 pb-24 text-white sm:-mx-6">
      {activeView !== "entries" ? (
        <div className="bg-slate-950 px-4 py-4 text-white sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <Link href={`/admin/financeiro?month=${prevMonth}&currency=${filters.currency}`} className="rounded-full px-3 py-2 text-orange-300">‹</Link>
            <h1 className="text-xl font-bold capitalize">{monthLabel}</h1>
            <Link href={`/admin/financeiro?month=${nextMonth}&currency=${filters.currency}`} className="rounded-full px-3 py-2 text-orange-300">›</Link>
            <form className="ml-auto">
              <input type="hidden" name="month" value={filters.month} />
              <select name="currency" defaultValue={filters.currency} className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-bold text-white" onChange={(event) => event.currentTarget.form?.requestSubmit()}>
                {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
              </select>
            </form>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {activeView === "home" ? (
          <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Entradas</p><p className="mt-2 text-xl font-bold text-emerald-300">{money(metrics.income, filters.currency)}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Saídas</p><p className="mt-2 text-xl font-bold text-red-300">{money(metrics.expenses, filters.currency)}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Saldo</p><p className="mt-2 text-xl font-bold text-white">{money(metrics.balance, filters.currency)}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Dízimo</p><p className="mt-2 text-xl font-bold text-amber-300">{money(metrics.tithe, filters.currency)}</p></div>
      </div>
      <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Saldo previsto</p>
        <p className="mt-2 text-xl font-bold text-white">{money(metrics.projectedBalance, filters.currency)}</p>
      </div>

      <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <div className="mb-5 flex items-center gap-2">
          <BarChart3 size={18} className="text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Gastos por categoria</h2>
        </div>
        {metrics.topExpenses.length ? (
          <div className="space-y-4">
            {metrics.topExpenses.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex justify-between gap-3 text-sm"><span>{item.name}</span><span className="font-semibold">{money(item.amount, filters.currency)}</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-orange-500/10"><div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.max((item.amount / maxExpense) * 100, 4)}%` }} /></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-400">Nenhuma saída lançada neste mês.</p>
        )}
      </section>
      <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Carteira</h2>
          <button onClick={() => setAccountModal(true)} className="text-sm font-bold text-orange-400">Gerenciar →</button>
        </div>
        {accounts.length ? (
          <div className="mt-5 space-y-3">
            {accounts.map((account) => <div key={account.id} className="flex items-center justify-between rounded-xl bg-slate-950 p-3 text-sm"><span>{account.name}</span><span className="font-semibold text-orange-300">{account.kind === "credit_card" ? "Cartão" : "Conta"}</span></div>)}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4">
            <p className="font-semibold text-white">Nenhuma conta cadastrada</p>
            <p className="mt-1 text-sm text-slate-400">Adicione uma conta, banco ou cartão para começar a lançar entradas e saídas.</p>
            <button onClick={() => setAccountModal(true)} className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
              + Criar conta
            </button>
          </div>
        )}
      </section>
          </>
        ) : null}

        {activeView === "entries" ? (
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Lançamentos</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEntrySearchOpen((value) => !value)}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border text-slate-200 ${
                    entrySearchOpen ? "border-orange-500/60 bg-orange-500/20" : "border-slate-700 bg-slate-900"
                  }`}
                  aria-label="Buscar lançamentos"
                >
                  <Search size={19} />
                </button>
                <button onClick={openTransactionModal} className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 hover:bg-orange-500/20">
                  + Novo
                </button>
              </div>
            </div>

            {entrySearchOpen ? (
              <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
                  <Search size={18} className="shrink-0 text-slate-400" />
                  <input
                    value={entrySearch}
                    onChange={(event) => setEntrySearch(event.target.value)}
                    placeholder="Buscar por local, categoria, apoiador..."
                    className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                  />
                </div>
                <button onClick={() => setDetailModal(true)} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white">
                  Filtro avançado
                </button>
              </div>
            ) : null}

            <div className="mb-5 grid grid-cols-4 border-b border-slate-800">
              {[
                { key: "all", label: "Todos" },
                { key: "income", label: "↑ Entradas" },
                { key: "expense", label: "↓ Saídas" },
                { key: "card", label: "Cartão" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setEntryFilter(item.key as typeof entryFilter)}
                  className={`min-h-12 border-b-2 px-1 text-sm font-semibold transition sm:text-base ${
                    entryFilter === item.key
                      ? "border-orange-400 text-orange-300"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
              <Link href={`/admin/financeiro?month=${prevMonth}&currency=${filters.currency}`} className="text-2xl text-slate-400 hover:text-white">‹</Link>
              <p className="text-lg font-bold capitalize text-white">{monthLabel}</p>
              <Link href={`/admin/financeiro?month=${nextMonth}&currency=${filters.currency}`} className="text-2xl text-slate-400 hover:text-white">›</Link>
            </div>

            <div className="space-y-6">
              {entryDates.map((date) => (
                <div key={date}>
                  <div className="mb-3 flex items-center gap-3">
                    <p className="shrink-0 font-mono text-sm font-semibold tracking-widest text-slate-400">{dateBR(date)}</p>
                    <div className="h-px flex-1 bg-slate-800" />
                  </div>
                  <div className="space-y-3">
                    {transactionsByDate[date].map((transaction) => {
                      const isIncome = transaction.type === "income";
                      return (
                        <div
                          key={transaction.id}
                          className={`grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:grid-cols-[1fr_auto_auto] sm:items-center ${
                            isIncome ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-red-400"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <span className={`h-2.5 w-2.5 rounded-full ${isIncome ? "bg-emerald-400" : "bg-red-400"}`} />
                              <p className="truncate text-lg font-semibold text-white">{transaction.description}</p>
                            </div>
                            <p className="mt-1 truncate pl-5 text-sm text-slate-400">
                              {categoryName(transaction)} · {accountName(transaction)}
                            </p>
                          </div>
                          <div className="pl-5 text-left sm:pl-0 sm:text-right">
                            <p className={`text-xl font-bold ${isIncome ? "text-emerald-300" : "text-red-300"}`}>
                              {isIncome ? "+" : "-"}{money(transaction.amount, transaction.currency)}
                            </p>
                            <p className="text-xs font-semibold text-slate-500">{transaction.currency}</p>
                          </div>
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setEditing(transaction)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Editar lançamento">
                              <Pencil size={15} />
                            </button>
                            <form action={deleteTransaction.bind(null, transaction.id)}>
                              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-red-300" aria-label="Excluir lançamento">
                                <Trash2 size={15} />
                              </button>
                            </form>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {!entryDates.length ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900 p-6 text-center text-sm text-slate-400">
                  Nenhum lançamento encontrado neste mês.
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {activeView === "transfers" ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <h2 className="text-xl font-semibold">Transferências</h2>
            <p className="mt-2 text-sm text-slate-400">Base pronta para mover valores entre contas. A lógica contábil da transferência entra na próxima etapa.</p>
            <button onClick={() => setAccountModal(true)} className="mt-5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">Gerenciar contas</button>
          </section>
        ) : null}

        {activeView === "settings" ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <h2 className="text-xl font-semibold">Ajustes</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button onClick={() => setAccountModal(true)} className="rounded-2xl border border-slate-800 p-4 text-left font-semibold">Contas</button>
              <button onClick={() => setCategoryModal(true)} className="rounded-2xl border border-slate-800 p-4 text-left font-semibold">Categorias</button>
              <Link href="/admin/financeiro/cambio" className="rounded-2xl border border-slate-800 p-4 text-left font-semibold">Câmbio</Link>
            </div>
          </section>
        ) : null}
      </div>

      {(activeView === "home" || activeView === "entries") ? (
        <button onClick={openTransactionModal} className="fixed bottom-20 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-semibold text-white shadow-xl">+</button>
      ) : null}

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 px-2 py-1.5 backdrop-blur">
        <div className="mx-auto flex max-w-3xl">
          <button onClick={() => setActiveView("home")} className={`${viewButtonClass} ${activeView === "home" ? "text-orange-300" : "text-slate-400"}`}><Home size={19} />Início</button>
          <button onClick={() => setActiveView("entries")} className={`${viewButtonClass} ${activeView === "entries" ? "text-orange-300" : "text-slate-400"}`}><ArrowUpDown size={19} />Lançamentos</button>
          <button onClick={() => setActiveView("transfers")} className={`${viewButtonClass} ${activeView === "transfers" ? "text-orange-300" : "text-slate-400"}`}><ArrowLeftRight size={19} />Transferências</button>
          <Link href="/admin/financeiro/ajustes" className={`${viewButtonClass} ${activeView === "settings" ? "text-orange-300" : "text-slate-400"}`}><Settings size={19} />Ajustes</Link>
        </div>
      </nav>

      <Modal title="Novo lançamento" open={transactionModal} onClose={() => setTransactionModal(false)}>
        <TransactionForm categories={categories} accounts={accounts} onEditAccounts={() => setAccountModal(true)} />
      </Modal>

      <Modal title="Cadastre uma conta" open={accountRequiredModal} onClose={() => setAccountRequiredModal(false)}>
        <div className="space-y-4 text-slate-300">
          <p>
            Antes de fazer um lançamento financeiro, é necessário inserir pelo menos uma conta,
            banco ou cartão. Assim o sistema sabe de onde o dinheiro entra ou sai.
          </p>
          <button
            type="button"
            onClick={() => {
              setAccountRequiredModal(false);
              setAccountModal(true);
            }}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900"
          >
            Inserir conta agora
          </button>
        </div>
      </Modal>

      <Modal title="Categorias" open={categoryModal} onClose={() => setCategoryModal(false)}>
        <div className="space-y-5">
          <section className="rounded-2xl border border-orange-500/25 bg-orange-500/10 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-white">Cadastrar nova categoria</h3>
              <p className="mt-1 text-xs text-slate-400">Use nomes curtos para facilitar a leitura nos lançamentos.</p>
            </div>
            <form action={addCategory} className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <input name="name" required placeholder="Ex: Alimentação, Luz, Oferta" className="min-w-0 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500" />
              <button type="submit" className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Adicionar</button>
            </form>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">Categorias cadastradas</h3>
              <span className="text-xs text-slate-500">{categories.length} {categories.length === 1 ? "item" : "itens"}</span>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <form key={category.id} action={updateCategory.bind(null, category.id)} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-2">
                  <div className="min-w-0">
                    <input name="name" defaultValue={category.name} required className="min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-white outline-none focus:border-slate-700" />
                    <p className="px-2 text-xs text-slate-500">Categoria de lançamento</p>
                  </div>
                  <div className="flex gap-1">
                    <button type="submit" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-orange-500/10 hover:text-orange-300" aria-label="Salvar categoria">
                      <Pencil size={15} />
                    </button>
                    <button formAction={deleteCategory.bind(null, category.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-300" aria-label="Excluir categoria">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </section>
        </div>
      </Modal>

      <Modal title="Contas, bancos e cartões" open={accountModal} onClose={() => setAccountModal(false)}>
        <div className="space-y-5">
          <section className="rounded-2xl border border-orange-500/25 bg-orange-500/10 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-white">Cadastrar nova conta</h3>
              <p className="mt-1 text-xs text-slate-400">Use para adicionar banco, dinheiro em mãos ou cartão.</p>
            </div>
            <form action={addAccount} className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_120px_100px_auto]">
              <input name="name" required placeholder="Ex: Nubank, Caixa, Visa" className="min-w-0 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500" />
              <select name="kind" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
                <option value="bank">Conta</option>
                <option value="cash">Dinheiro</option>
                <option value="credit_card">Cartão</option>
              </select>
              <select name="currency" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
                {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
              </select>
              <button type="submit" className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Adicionar</button>
            </form>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">Contas cadastradas</h3>
              <span className="text-xs text-slate-500">{accounts.length} {accounts.length === 1 ? "item" : "itens"}</span>
            </div>
            <div className="space-y-2">
              {accounts.map((account) => (
                <form key={account.id} action={updateAccount.bind(null, account.id)} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-2">
                  <div className="min-w-0">
                    <input name="name" defaultValue={account.name} required className="min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-white outline-none focus:border-slate-700" />
                    <div className="grid min-w-0 gap-2 px-2 pt-1 sm:grid-cols-[120px_100px]">
                      <select name="kind" defaultValue={account.kind} className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-slate-300">
                        <option value="bank">Conta</option>
                        <option value="cash">Dinheiro</option>
                        <option value="credit_card">Cartão</option>
                      </select>
                      <select name="currency" defaultValue={account.currency} className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-slate-300">
                        {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button type="submit" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-orange-500/10 hover:text-orange-300" aria-label="Salvar conta">
                      <Pencil size={15} />
                    </button>
                    <button formAction={deleteAccount.bind(null, account.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-300" aria-label="Excluir conta">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </form>
              ))}
              {!accounts.length ? (
                <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                  Nenhuma conta cadastrada ainda.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </Modal>

      <Modal title="Relatório detalhado" open={detailModal} onClose={() => setDetailModal(false)}>
        <form className="mb-5 grid gap-3 md:grid-cols-5">
          <input type="date" name="from" defaultValue={filters.from} className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
          <input type="date" name="to" defaultValue={filters.to} className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
          <select name="currency" defaultValue={filters.currency} className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-white">
            {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
          </select>
          <select name="category" defaultValue={filters.category} className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-white">
            <option value="">Todas categorias</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <select name="type" defaultValue={filters.type} className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-white">
            <option value="">Entrada e saída</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>
          <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 md:w-fit">Filtrar</button>
        </form>
        <div className="divide-y divide-slate-800">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="grid gap-3 py-4 md:grid-cols-[90px_1fr_auto_auto] md:items-center">
              <p className="text-sm text-slate-400">{dateBR(transaction.date)}</p>
              <div><p className="font-medium text-white">{transaction.description}</p><p className="text-xs text-slate-500">{categoryName(transaction)} · {transaction.type === "income" ? "Entrada" : "Saída"} · {transaction.currency}</p></div>
              <p className={transaction.type === "income" ? "font-semibold text-orange-300" : "font-semibold text-red-300"}>{money(transaction.amount, transaction.currency)}</p>
              <div className="flex gap-1">
                <button onClick={() => setEditing(transaction)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Editar"><Pencil size={15} /></button>
                <form action={deleteTransaction.bind(null, transaction.id)}><button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-red-300" aria-label="Excluir"><Trash2 size={15} /></button></form>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal title="Editar lançamento" open={Boolean(editing)} onClose={() => setEditing(null)}>
        {editing ? <TransactionForm categories={categories} accounts={accounts} transaction={editing} onEditAccounts={() => setAccountModal(true)} /> : null}
      </Modal>
    </div>
  );
}
