import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/logout-button";
import AdminMenuButton from "@/components/admin-menu-button";
import { Home, Users, Heart, UserCircle2, Settings, LayoutDashboard, FolderKanban, PlusCircle, Star, Handshake, HandHelping, Sparkles, BadgeDollarSign, Search } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("missionary_mode, display_name")
    .eq("id", user.id)
    .maybeSingle();

  const missionaryMode = profile?.missionary_mode ?? false;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950 lg:block">
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Painel
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Sistema Missionário
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {profile?.display_name || user.email}
            </p>

            <nav className="mt-8 flex flex-col gap-1">
              <p className="mb-1 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Geral
              </p>

              <Link href="/admin/feed" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                <Home size={16} />Feed
              </Link>
              <Link href="/admin/seguindo" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                <Users size={16} />Seguindo
              </Link>
              <Link href="/admin/descobrir" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                <Search size={16} />Descobrir
              </Link>
              <Link href="/admin/doacoes" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                <Heart size={16} />Minhas doações
              </Link>
              <Link href="/admin/financeiro" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                <BadgeDollarSign size={16} />Financeiro
              </Link>
              <Link href="/admin/perfil" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                <UserCircle2 size={16} />Meu perfil
              </Link>
              <Link href="/admin/configuracoes" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                <Settings size={16} />Configurações
              </Link>

              {missionaryMode && (
                <>
                  <p className="mb-1 mt-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Missão
                  </p>
                  <Link href="/admin" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                    <LayoutDashboard size={16} />Dashboard
                  </Link>
                  <Link href="/admin/publicacoes" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                    <FolderKanban size={16} />Publicações
                  </Link>
                  <Link href="/admin/publicacoes/nova" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                    <PlusCircle size={16} />Nova publicação
                  </Link>
                  <Link href="/admin/destaques" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                    <Star size={16} />Destaques
                  </Link>
                  <Link href="/admin/parceiros" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                    <Handshake size={16} />Parceiros
                  </Link>
                  <Link href="/admin/pedidos-oracao" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                    <HandHelping size={16} />Pedidos de oração
                  </Link>
                  <Link href="/admin/ia" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900">
                    <Sparkles size={16} />Criar com IA
                  </Link>
                </>
              )}
            </nav>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <AdminMenuButton missionaryMode={missionaryMode} />
                <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {missionaryMode ? "Modo Missionário" : "Minha conta"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {profile?.display_name || user.email}
                </p>
                </div>
              </div>

              <LogoutButton />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-24 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
