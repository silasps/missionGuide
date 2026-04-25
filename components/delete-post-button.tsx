"use client";

import { useState, useTransition } from "react";

type Props = {
  action: () => Promise<void>;
};

export default function DeletePostButton({ action }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-red-500 px-5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"
      >
        Excluir publicação
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">
              Excluir publicação?
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Essa ação não poderá ser desfeita. A publicação será removida da área administrativa e da página pública.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {isPending ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}