import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/logout-button";
import AdminMenuButton from "@/components/admin-menu-button";
import AdminThemeToggle from "@/components/admin-theme-toggle";
import { Home, Users, Heart, UserCircle2, Settings, LayoutDashboard, FolderKanban, PlusCircle, Star, Handshake, HandHelping, Sparkles, BadgeDollarSign, Search, HandHeart } from "lucide-react";

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
  const navLink = "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-orange-500/10 hover:text-white [&>svg]:text-orange-400";

  return (
    <div className="admin-shell min-h-screen bg-slate-950 text-white">
      <div className="admin-shell flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-orange-500/20 bg-slate-950 lg:block">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500">
                <HandHeart size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-orange-300">
                  Painel
                </p>
                <h2 className="text-lg font-bold text-white">
                  Sistema Missionário
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {profile?.display_name || user.email}
            </p>

            <nav className="mt-8 flex flex-col gap-1">
              <p className="mb-1 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Geral
              </p>

              <Link href="/admin/feed" className={navLink}>
                <Home size={16} />Feed
              </Link>
              <Link href="/admin/seguindo" className={navLink}>
                <Users size={16} />Seguindo
              </Link>
              <Link href="/admin/descobrir" className={navLink}>
                <Search size={16} />Descobrir
              </Link>
              <Link href="/admin/doacoes" className={navLink}>
                <Heart size={16} />Minhas doações
              </Link>
              <Link href="/admin/financeiro" className={navLink}>
                <BadgeDollarSign size={16} />Financeiro
              </Link>
              <Link href="/admin/perfil" className={navLink}>
                <UserCircle2 size={16} />Meu perfil
              </Link>
              <Link href="/admin/configuracoes" className={navLink}>
                <Settings size={16} />Configurações
              </Link>

              {missionaryMode && (
                <>
                  <p className="mb-1 mt-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Missão
                  </p>
                  <Link href="/admin" className={navLink}>
                    <LayoutDashboard size={16} />Dashboard
                  </Link>
                  <Link href="/admin/publicacoes" className={navLink}>
                    <FolderKanban size={16} />Publicações
                  </Link>
                  <Link href="/admin/publicacoes/nova" className={navLink}>
                    <PlusCircle size={16} />Nova publicação
                  </Link>
                  <Link href="/admin/destaques" className={navLink}>
                    <Star size={16} />Destaques
                  </Link>
                  <Link href="/admin/parceiros" className={navLink}>
                    <Handshake size={16} />Parceiros
                  </Link>
                  <Link href="/admin/pedidos-oracao" className={navLink}>
                    <HandHelping size={16} />Pedidos de oração
                  </Link>
                  <Link href="/admin/ia" className={navLink}>
                    <Sparkles size={16} />Criar com IA
                  </Link>
                </>
              )}

              <p className="mb-1 mt-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Conta
              </p>
              <AdminThemeToggle className={navLink} />
              <LogoutButton className={navLink} />
            </nav>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="relative z-50 border-b border-orange-500/20 bg-slate-950/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <AdminMenuButton missionaryMode={missionaryMode} />
                <div>
                <p className="text-xs uppercase tracking-[0.18em] text-orange-300">
                  {missionaryMode ? "Modo Missionário" : "Minha conta"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {profile?.display_name || user.email}
                </p>
                </div>
              </div>
            </div>
          </header>

          <main className="admin-page-content flex-1 px-4 py-6 pb-24 transition sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
