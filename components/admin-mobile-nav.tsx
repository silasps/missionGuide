import Link from "next/link";
import { Home, Users, Heart, UserCircle2, Settings, LayoutDashboard, FolderKanban, PlusCircle, Star, Handshake, HandHelping, Sparkles, BadgeDollarSign, Search } from "lucide-react";

type Props = {
  missionaryMode: boolean;
};

const linkCls = "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700";
const dividerCls = "my-auto h-5 w-px shrink-0 bg-slate-200";

export default function AdminMobileNav({ missionaryMode }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 overflow-x-auto border-t border-slate-200 bg-white/95 shadow-[0_-12px_28px_rgb(15_23_42/0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto flex w-max items-center gap-1 px-2 py-2 scrollbar-none">
        <Link href="/admin/feed" className={linkCls}><Home size={17} /></Link>
        <Link href="/admin/seguindo" className={linkCls}><Users size={17} /></Link>
        <Link href="/admin/descobrir" className={linkCls} title="Descobrir" aria-label="Descobrir"><Search size={17} /></Link>
        <Link href="/admin/doacoes" className={linkCls}><Heart size={17} /></Link>
        <Link href="/admin/financeiro" className={linkCls} title="Financeiro" aria-label="Financeiro"><BadgeDollarSign size={17} /></Link>
        <Link href="/admin/perfil" className={linkCls}><UserCircle2 size={17} /></Link>
        <Link href="/admin/configuracoes" className={linkCls}><Settings size={17} /></Link>

        {missionaryMode && (
          <>
            <div className={dividerCls} />
            <Link href="/admin" className={linkCls}><LayoutDashboard size={17} /></Link>
            <Link href="/admin/publicacoes" className={linkCls}><FolderKanban size={17} /></Link>
            <Link href="/admin/publicacoes/nova" className={linkCls}><PlusCircle size={17} /></Link>
            <Link href="/admin/destaques" className={linkCls}><Star size={17} /></Link>
            <Link href="/admin/parceiros" className={linkCls}><Handshake size={17} /></Link>
            <Link href="/admin/pedidos-oracao" className={linkCls}><HandHelping size={17} /></Link>
            <Link href="/admin/ia" className={linkCls}><Sparkles size={17} /></Link>
          </>
        )}
      </div>
    </nav>
  );
}
