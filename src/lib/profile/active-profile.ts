import { cache } from 'react'
import { cookies } from 'next/headers'
import { createClient, getCachedUser } from '@/lib/supabase/server'
import { Profile } from '@/types/database'

export const ACTIVE_PROFILE_COOKIE = 'active_profile_id'

export type AccessibleProfile = Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'accent_color'>

// Perfil "ativo" da sessão de dashboard: o cookie active_profile_id decide
// qual conta está sendo administrada (a própria, ou uma gerenciada via
// profile_managers). RLS garante que só se retorna algo se o usuário
// realmente tiver acesso — cookie inválido/stale cai de volta para a
// conta própria.
//
// React cache() memoiza por request: várias telas chamam getActiveProfile()
// no mesmo carregamento (dashboard/layout.tsx, financeiro/layout.tsx, e às
// vezes a própria page.tsx) — sem isso, cada chamada refazia a viagem completa
// (auth.getUser() + query de profiles) do zero, mesmo dentro do mesmo
// request. Trocar de aba dentro do Financeiro sentia lento por causa disso
// (reportado pelo usuário testando em produção) — layout pai e layout do
// Financeiro pagavam o mesmo custo duas vezes a cada navegação.
export const getActiveProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient()
  const user = await getCachedUser()
  if (!user) return null

  const cookieStore = await cookies()
  const activeId = cookieStore.get(ACTIVE_PROFILE_COOKIE)?.value

  if (activeId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', activeId).maybeSingle()
    if (data) return data
  }

  const { data: owned } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
  return owned
})

export async function getAccessibleProfiles(): Promise<AccessibleProfile[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const [{ data: owned }, { data: managed }] = await Promise.all([
    supabase.from('profiles').select('id, username, display_name, avatar_url, accent_color').eq('user_id', user.id),
    supabase.from('profile_managers').select('profiles(id, username, display_name, avatar_url, accent_color)').eq('user_id', user.id),
  ])

  const managedProfiles = (managed ?? [])
    .map((m) => (Array.isArray(m.profiles) ? m.profiles[0] : m.profiles))
    .filter((p): p is AccessibleProfile => Boolean(p))

  return [...(owned ?? []), ...managedProfiles]
}
