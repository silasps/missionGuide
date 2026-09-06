import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { MyProjectsList } from '@/components/dashboard/partner/my-projects-list'
import { AchievementFeed } from '@/components/dashboard/partner/achievement-feed'

export default async function MyProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const t = await getTranslations('PartnerFinance')

  const [{ data: pledged }, { data: recurring }] = await Promise.all([
    supabase.from('pledges').select('highlight_id').eq('reporter_user_id', user.id).eq('status', 'confirmed').not('highlight_id', 'is', null),
    supabase.from('recurring_pledges').select('highlight_id').eq('reporter_user_id', user.id).eq('status', 'active').not('highlight_id', 'is', null),
  ])

  const highlightIds = Array.from(new Set([
    ...(pledged ?? []).map((p) => p.highlight_id as string),
    ...(recurring ?? []).map((r) => r.highlight_id as string),
  ]))

  const { data: highlights } = highlightIds.length > 0
    ? await supabase
        .from('highlights')
        .select('*, profile:profiles(id, username, display_name, accent_color)')
        .in('id', highlightIds)
    : { data: [] }

  const prayerCount = (highlights ?? []).filter((h) => h.goal_type.includes('prayer')).length

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">{t('myProjectsTitle')}</h1>
        {highlightIds.length > 0 && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {t('projectsSummary', { count: highlightIds.length, prayerCount })}
          </p>
        )}
      </div>
      <AchievementFeed userId={user.id} types={['prayer_answered', 'prayer_point_completed', 'project_completed']} />
      <MyProjectsList projects={highlights ?? []} />
    </div>
  )
}
