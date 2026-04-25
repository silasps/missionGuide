"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CURRENCIES = ["BRL", "USD", "EUR", "GBP", "ARS", "CLP", "PYG", "UYU", "CAD", "JPY"];

type RatesResponse = {
  result: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
};

export default function CurrencyConverter() {
  const [base, setBase] = useState("USD");
  const [target, setTarget] = useState("BRL");
  const [amount, setAmount] = useState("1");
  const [data, setData] = useState<RatesResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    fetch(`https://open.er-api.com/v6/latest/${base}`)
      .then((response) => response.json())
      .then((json: RatesResponse) => {
        if (!active) return;
        if (json.result !== "success") {
          setError("Não foi possível buscar a cotação agora.");
          return;
        }
        setData(json);
      })
      .catch(() => {
        if (active) setError("Não foi possível buscar a cotação agora.");
      });

    return () => {
      active = false;
    };
  }, [base]);

  const converted = useMemo(() => {
    const value = Number(amount.replace(",", "."));
    const rate = data?.rates?.[target];
    if (!Number.isFinite(value) || !rate) return null;
    return value * rate;
  }, [amount, data, target]);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/financeiro" className="text-sm text-slate-400 hover:text-white">
        Voltar para financeiro
      </Link>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Câmbio</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Conversor de moedas</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Valor</label>
            <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-slate-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">De</label>
            <select value={base} onChange={(event) => setBase(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-slate-500">
              {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Para</label>
            <select value={target} onChange={(event) => setTarget(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-slate-500">
              {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
            </select>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-400">Resultado</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {converted === null ? "..." : new Intl.NumberFormat("pt-BR", { style: "currency", currency: target }).format(converted)}
            </p>
          </div>
        </div>

        {data ? (
          <p className="mt-5 text-sm text-slate-400">
            Atualizado em {new Date(data.time_last_update_utc).toLocaleString("pt-BR")}. Fonte: open.er-api.com.
          </p>
        ) : null}
        {error ? <p className="mt-5 text-sm text-red-300">{error}</p> : null}
      </div>
    </div>
  );
}
