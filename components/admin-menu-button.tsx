"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  FolderKanban,
  HandHelping,
  Handshake,
  Heart,
  Home,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  Star,
  UserCircle2,
  Users,
  X,
} from "lucide-react";

type Props = {
  missionaryMode: boolean;
};

const linkClass = "flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900";

export default function AdminMenuButton({ missionaryMode }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-200 hover:bg-slate-900 lg:hidden"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <div className="fixed left-0 right-0 top-[73px] z-[9999] border-b border-slate-800 bg-slate-950 p-3 shadow-2xl">
          <div className="mx-auto max-w-md">
            <nav className="grid grid-cols-2 gap-1" onClick={() => setOpen(false)}>
              <Link href="/admin/feed" className={linkClass}><Home size={16} />Feed</Link>
              <Link href="/admin/seguindo" className={linkClass}><Users size={16} />Seguindo</Link>
              <Link href="/admin/descobrir" className={linkClass}><Search size={16} />Descobrir</Link>
              <Link href="/admin/doacoes" className={linkClass}><Heart size={16} />Minhas doações</Link>
              <Link href="/admin/financeiro" className={linkClass}><BadgeDollarSign size={16} />Financeiro</Link>
              <Link href="/admin/perfil" className={linkClass}><UserCircle2 size={16} />Meu perfil</Link>
              <Link href="/admin/configuracoes" className={linkClass}><Settings size={16} />Configurações</Link>

              {missionaryMode ? (
                <>
                  <p className="col-span-2 mb-1 mt-2 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Missão</p>
                  <Link href="/admin" className={linkClass}><LayoutDashboard size={16} />Dashboard</Link>
                  <Link href="/admin/publicacoes" className={linkClass}><FolderKanban size={16} />Publicações</Link>
                  <Link href="/admin/publicacoes/nova" className={linkClass}><PlusCircle size={16} />Nova publicação</Link>
                  <Link href="/admin/destaques" className={linkClass}><Star size={16} />Destaques</Link>
                  <Link href="/admin/parceiros" className={linkClass}><Handshake size={16} />Parceiros</Link>
                  <Link href="/admin/pedidos-oracao" className={linkClass}><HandHelping size={16} />Pedidos de oração</Link>
                  <Link href="/admin/ia" className={linkClass}><Sparkles size={16} />Criar com IA</Link>
                </>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
