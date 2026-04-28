"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function FinanceClickFeedback({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [busy, setBusy] = useState(false);

  function showFeedback() {
    setBusy(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBusy(false), 550);
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      className={className}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        const actionable = target.closest("button, a");
        if (actionable && !actionable.hasAttribute("disabled")) showFeedback();
      }}
    >
      {busy ? (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-[90] flex justify-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-lg shadow-slate-900/10">
            <LoaderCircle size={15} className="animate-spin" />
            Processando...
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}
