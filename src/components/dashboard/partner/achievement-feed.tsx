import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { markNotificationTypesRead } from '@/lib/notifications/mark-read'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { NotificationType } from '@/types/database'

type AchievementType = 'prayer_answered' | 'prayer_point_completed' | 'project_completed' | 'pledge_confirmed'

interface NotificationRow {
  id: string
  type: NotificationType
  payload: Record<string, unknown>
  created_at: string
}

function buildHref(n: NotificationRow): string | null {
  const p = n.payload
  if ((n.type === 'project_completed' || n.type === 'prayer_point_completed') && typeof p.username === 'string' && typeof p.slug === 'string') {
    return `/${p.username}/projetos/${p.slug}`
  }
  if (n.type === 'pledge_confirmed') return '/dashboard/financeiro-parceiro'
  if (n.type === 'prayer_answered') return '/dashboard/oracoes'
  return null
}

/** Feed compacto de "conquistas" — eventos que o parceiro não provocou (a
 *  ação foi do missionário: respondeu a oração, bateu a meta, concluiu um
 *  ponto de oração do projeto), pra reforçar que ele faz parte disso.
 *  Reaproveita a tabela `notifications` que já existe, só lendo tipos
 *  específicos por área (feedback: nada disso aparecia em lugar nenhum
 *  além do sino). */
export async function AchievementFeed({ userId, types, limit = 5 }: { userId: string; types: AchievementType[]; limit?: number }) {
  const t = await getTranslations('Achievements')
  const supabase = await createClient()

  const { data } = await supabase
    .from('notifications')
    .select('id, type, payload, created_at')
    .eq('recipient_user_id', userId)
    .in('type', types)
    .order('created_at', { ascending: false })
    .limit(limit)

  const notifications = (data ?? []) as NotificationRow[]
  if (notifications.length === 0) return null

  await markNotificationTypesRead(supabase, userId, types)

  return (
    <div className="space-y-1.5">
      {notifications.map((n) => {
        const p = n.payload
        let message: string
        switch (n.type) {
          case 'prayer_answered':
            message = t('prayerAnswered', { name: (p.display_name as string) ?? '' })
            break
          case 'prayer_point_completed':
            message = t('prayerPointCompleted', { title: (p.title as string) ?? '', highlightTitle: (p.highlight_title as string) ?? '' })
            break
          case 'project_completed':
            message = t('projectCompleted', { title: (p.title as string) ?? '' })
            break
          case 'pledge_confirmed':
            message = t('pledgeConfirmed', { amount: formatCurrency((p.amount as number) ?? 0, 'BRL'), highlightTitle: (p.highlight_title as string) ?? '' })
            break
          default:
            message = ''
        }
        const href = buildHref(n)
        const content = (
          <div className="flex items-start gap-2.5 p-3 rounded-xl border bg-card">
            <span className="text-base leading-none mt-0.5">🎉</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(n.created_at)}</p>
            </div>
          </div>
        )
        return href ? (
          <Link key={n.id} href={href} className="block hover:bg-muted/40 rounded-xl transition-colors">
            {content}
          </Link>
        ) : (
          <div key={n.id}>{content}</div>
        )
      })}
    </div>
  )
}
