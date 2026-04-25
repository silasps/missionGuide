import Link from "next/link";
import { Home, Users, Heart, UserCircle2, Settings, LayoutDashboard, FolderKanban, PlusCircle, Star, Handshake, HandHelping, Sparkles, BadgeDollarSign, Search } from "lucide-react";

type Props = {
  missionaryMode: boolean;
};

const linkCls = "flex shrink-0 items-center justify-center rounded-full p-3 text-orange-400 transition hover:bg-orange-500/10 hover:text-orange-300";
const dividerCls = "my-auto h-4 w-px shrink-0 bg-orange-500/30";

export default function AdminMobileNav({ missionaryMode }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 overflow-x-auto border-t border-orange-500/20 bg-slate-950/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex w-max items-center gap-1 px-3 py-2 scrollbar-none">
        <Link href="/admin/feed" className={linkCls}><Home size={18} /></Link>
        <Link href="/admin/seguindo" className={linkCls}><Users size={18} /></Link>
        <Link href="/admin/descobrir" className={linkCls} title="Descobrir" aria-label="Descobrir"><Search size={18} /></Link>
        <Link href="/admin/doacoes" className={linkCls}><Heart size={18} /></Link>
        <Link href="/admin/financeiro" className={linkCls} title="Financeiro" aria-label="Financeiro"><BadgeDollarSign size={18} /></Link>
        <Link href="/admin/perfil" className={linkCls}><UserCircle2 size={18} /></Link>
        <Link href="/admin/configuracoes" className={linkCls}><Settings size={18} /></Link>

        {missionaryMode && (
          <>
            <div className={dividerCls} />
            <Link href="/admin" className={linkCls}><LayoutDashboard size={18} /></Link>
            <Link href="/admin/publicacoes" className={linkCls}><FolderKanban size={18} /></Link>
            <Link href="/admin/publicacoes/nova" className={linkCls}><PlusCircle size={18} /></Link>
            <Link href="/admin/destaques" className={linkCls}><Star size={18} /></Link>
            <Link href="/admin/parceiros" className={linkCls}><Handshake size={18} /></Link>
            <Link href="/admin/pedidos-oracao" className={linkCls}><HandHelping size={18} /></Link>
            <Link href="/admin/ia" className={linkCls}><Sparkles size={18} /></Link>
          </>
        )}
      </div>
    </nav>
  );
}
