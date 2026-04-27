"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AdminThemeToggle from "@/components/admin-theme-toggle";
import LogoutButton from "@/components/logout-button";
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

const linkClass = "admin-nav-link flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-white/90 [&>svg]:text-emerald-300";

export default function AdminMenuButton({ missionaryMode }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("admin-menu-open", open);

    return () => {
      document.documentElement.classList.remove("admin-menu-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 text-white hover:bg-white/10 lg:hidden"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open ? (
        <>
          <button
            type="button"
            data-admin-menu-open="true"
            className="fixed inset-x-0 bottom-0 top-20 z-[9998] bg-slate-950/65 backdrop-blur-2xl"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            style={{ WebkitBackdropFilter: "blur(24px)", backdropFilter: "blur(24px)" }}
          />

          <div
            ref={menuRef}
            className="admin-menu-panel fixed left-0 right-0 top-20 z-[9999] border-b border-white/10 bg-black/95 p-3 shadow-2xl backdrop-blur"
          >
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
                    <p className="col-span-2 mb-1 mt-2 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">Missão</p>
                    <Link href="/admin" className={linkClass}><LayoutDashboard size={16} />Dashboard</Link>
                    <Link href="/admin/publicacoes" className={linkClass}><FolderKanban size={16} />Publicações</Link>
                    <Link href="/admin/publicacoes/nova" className={linkClass}><PlusCircle size={16} />Nova publicação</Link>
                    <Link href="/admin/destaques" className={linkClass}><Star size={16} />Destaques</Link>
                    <Link href="/admin/parceiros" className={linkClass}><Handshake size={16} />Parceiros</Link>
                    <Link href="/admin/pedidos-oracao" className={linkClass}><HandHelping size={16} />Pedidos de oração</Link>
                    <Link href="/admin/ia" className={linkClass}><Sparkles size={16} />Criar com IA</Link>
                  </>
                ) : null}

                <p className="col-span-2 mb-1 mt-2 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">Conta</p>
                <AdminThemeToggle className={linkClass} />
                <LogoutButton className={linkClass} />
              </nav>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
