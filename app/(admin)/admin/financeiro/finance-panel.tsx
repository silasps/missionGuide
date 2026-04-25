"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, ListFilter, Pencil, Plus, Tags, Trash2, X } from "lucide-react";
import {
  addCategory,
  addTransaction,
  deleteCategory,
  deleteTransaction,
  updateCategory,
  updateTransaction,
} from "./actions";

export type FinanceCategory = {
  id: string;
  name: string;
};

export type FinanceTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number | null;
  currency: string;
  category_id: string | null;
  type: "income" | "expense";
  tithe_eligible: boolean | null;
  finance_categories?: FinanceCategory | FinanceCategory[] | null;
};

type Props = {
  categories: FinanceCategory[];
  transactions: FinanceTransaction[];
  metrics: {
    income: number;
    expenses: number;
    balance: number;
    tithe: number;
    topExpenses: { name: string; amount: number }[];
  };
  filters: {
    from: string;
    to: string;
    category: string;
    type: string;
    currency: string;
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

function dateBR(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function categoryName(transaction: FinanceTransaction) {
  const category = transaction.finance_categories;
  if (!category) return "Sem categoria";
  if (Array.isArray(category)) return category[0]?.name ?? "Sem categoria";
  return category.name;
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
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/80 px-4 py-6 backdrop-blur">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
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
  transaction,
  onEditCategories,
}: {
  categories: FinanceCategory[];
  transaction?: FinanceTransaction;
  onEditCategories: () => void;
}) {
  const [type, setType] = useState<"income" | "expense">(transaction?.type ?? "expense");
  const [currency, setCurrency] = useState(transaction?.currency ?? "BRL");
  const action = transaction ? updateTransaction.bind(null, transaction.id) : addTransaction;

  useEffect(() => {
    if (!transaction) {
      setCurrency(localStorage.getItem("finance-default-currency") || "BRL");
    }
  }, [transaction]);

  function saveDefaultCurrency(formData: FormData) {
    if (formData.get("save_default_currency") === "on") {
      localStorage.setItem("finance-default-currency", String(formData.get("currency") || "BRL"));
    }
  }

  return (
    <form action={(formData) => { saveDefaultCurrency(formData); action(formData); }} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Data</label>
        <input name="date" type="date" defaultValue={transaction?.date ?? today()} required className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-slate-500" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Valor</label>
        <input name="amount" type="text" inputMode="decimal" defaultValue={transaction?.amount ? String(transaction.amount).replace(".", ",") : ""} required placeholder="0,00" className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-slate-500" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Moeda</label>
        <select name="currency" value={currency} onChange={(event) => setCurrency(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-slate-500">
          {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
        </select>
        {!transaction ? (
          <label className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <input name="save_default_currency" type="checkbox" />
            Usar como padrão nos próximos lançamentos
          </label>
        ) : null}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Descrição</label>
        <input name="description" defaultValue={transaction?.description ?? ""} required placeholder="Ex: mercado, oferta, gasolina" className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-slate-500" />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-slate-300">Categoria</label>
          <button type="button" onClick={onEditCategories} className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white">
            <Tags size={13} />Editar
          </button>
        </div>
        <div className="flex gap-2">
          <select name="category_id" defaultValue={transaction?.category_id ?? ""} className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-slate-500">
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Tipo</label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white">
            <input type="radio" name="type" value="income" checked={type === "income"} onChange={() => setType("income")} />
            Entrada
          </label>
          <label className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white">
            <input type="radio" name="type" value="expense" checked={type === "expense"} onChange={() => setType("expense")} />
            Saída
          </label>
        </div>
      </div>
      {type === "income" ? (
        <label className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 md:col-span-2">
          <input name="tithe_eligible" type="checkbox" defaultChecked={transaction?.tithe_eligible ?? true} />
          Considerar esta entrada no cálculo do dízimo
        </label>
      ) : null}
      <button type="submit" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:opacity-90 md:w-fit">
        Salvar lançamento
      </button>
    </form>
  );
}

export default function FinancePanel({ categories, transactions, metrics, filters }: Props) {
  const [transactionModal, setTransactionModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editing, setEditing] = useState<FinanceTransaction | null>(null);
  const maxExpense = useMemo(
    () => Math.max(...metrics.topExpenses.map((item) => item.amount), 1),
    [metrics.topExpenses],
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Relatório financeiro</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Financeiro</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Acompanhe entradas, saídas, dízimo do mês e gastos por categoria.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form>
            <select name="currency" defaultValue={filters.currency} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm font-semibold text-white" onChange={(event) => event.currentTarget.form?.requestSubmit()}>
              {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
            </select>
          </form>
          <button onClick={() => setTransactionModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:opacity-90"><Plus size={16} />Lançar</button>
          <button onClick={() => setDetailModal(true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"><ListFilter size={16} />Detalhado</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-400">Entradas</p><p className="mt-2 text-xl font-bold text-emerald-300">{money(metrics.income, filters.currency)}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-400">Saídas</p><p className="mt-2 text-xl font-bold text-red-300">{money(metrics.expenses, filters.currency)}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-400">Saldo</p><p className="mt-2 text-xl font-bold text-white">{money(metrics.balance, filters.currency)}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-400">Dízimo</p><p className="mt-2 text-xl font-bold text-sky-300">{money(metrics.tithe, filters.currency)}</p></div>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <BarChart3 size={20} className="text-sky-300" />
          <h2 className="text-xl font-semibold text-white">5 maiores gastos do mês por categoria</h2>
        </div>
        {metrics.topExpenses.length ? (
          <div className="space-y-4">
            {metrics.topExpenses.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex justify-between gap-3 text-sm"><span className="text-slate-300">{item.name}</span><span className="font-semibold text-white">{money(item.amount, filters.currency)}</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.max((item.amount / maxExpense) * 100, 4)}%` }} /></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">Nenhuma saída lançada neste mês.</p>
        )}
      </section>

      <Modal title="Novo lançamento" open={transactionModal} onClose={() => setTransactionModal(false)}>
        <TransactionForm categories={categories} onEditCategories={() => setCategoryModal(true)} />
      </Modal>

      <Modal title="Categorias" open={categoryModal} onClose={() => setCategoryModal(false)}>
        <form action={addCategory} className="mb-5 flex gap-2">
          <input name="name" required placeholder="Nova categoria" className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-slate-500" />
          <button type="submit" className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900">Inserir</button>
        </form>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
              <form action={updateCategory.bind(null, category.id)} className="flex gap-2">
                <input name="name" defaultValue={category.name} required className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-500" />
                <button type="submit" className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-white">Salvar</button>
              </form>
              <form action={deleteCategory.bind(null, category.id)} className="mt-2">
                <button className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-red-300"><Trash2 size={14} />Excluir</button>
              </form>
            </div>
          ))}
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
              <p className={transaction.type === "income" ? "font-semibold text-emerald-300" : "font-semibold text-red-300"}>{money(transaction.amount, transaction.currency)}</p>
              <div className="flex gap-1">
                <button onClick={() => setEditing(transaction)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Editar"><Pencil size={15} /></button>
                <form action={deleteTransaction.bind(null, transaction.id)}><button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-red-300" aria-label="Excluir"><Trash2 size={15} /></button></form>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal title="Editar lançamento" open={Boolean(editing)} onClose={() => setEditing(null)}>
        {editing ? <TransactionForm categories={categories} transaction={editing} onEditCategories={() => setCategoryModal(true)} /> : null}
      </Modal>
    </div>
  );
}
