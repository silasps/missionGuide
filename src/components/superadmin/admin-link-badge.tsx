import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/auth/superadmin'
import { AdminLinkBadgeButton } from './admin-link-badge-button'

// Renderizado no layout raiz — aparece em QUALQUER página (pública,
// dashboard, checkout...), não só dentro de /superadmin, a pedido do
// usuário. Só existe pra quem está na allowlist SUPERADMIN_EMAILS.
// Dentro de /dashboard esse botão some (retorna null via pathname, ver
// admin-link-badge-button.tsx) porque o SuperadminRoleSwitcher já mostra o
// mesmo atalho, junto com o "visualizar como", num único botão.
export async function AdminLinkBadge() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isSuperAdmin(user?.email)) return null

  const t = await getTranslations('Superadmin')

  return <AdminLinkBadgeButton label={t('adminArea')} />
}
