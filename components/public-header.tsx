import Link from "next/link";
import { HandHeart, LogIn } from "lucide-react";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/admin/feed" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
            <HandHeart size={18} />
          </div>
          <p className="text-sm font-semibold text-slate-900">Sistema Missionário</p>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <LogIn size={16} />
          Entrar
        </Link>
      </div>
    </header>
  );
}
