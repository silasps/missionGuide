import Image from 'next/image'
import { coverThumbnailSrc } from '@/lib/media/bunny-thumbnail'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Highlight, Profile } from '@/types/database'
import { formatCurrency, cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { buttonVariants } from '@/components/ui/button'
import { HandCoins, HandHeart } from 'lucide-react'

type ProjectWithProfile = Highlight & {
  profile: Pick<Profile, 'id' | 'username' | 'display_name' | 'accent_color'>
}

// Lista somente-leitura — nunca reaproveitar HighlightsList (tem
// editar/reordenar/excluir, ações que não fazem sentido pra um parceiro).
export async function MyProjectsList({ projects }: { projects: ProjectWithProfile[] }) {
  const t = await getTranslations('PartnerFinance')

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-sm">{t('noProjectsYet')}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {projects.map((p) => {
        const isFinancial = p.goal_type.includes('financial')
        const hasPrayer = p.goal_type.includes('prayer')
        const pct = isFinancial && p.goal_amount ? Math.min(100, (p.current_amount / p.goal_amount) * 100) : null
        const slug = p.slug ?? p.id
        const projectHref = `/${p.profile.username}/projetos/${slug}`

        return (
          <div key={p.id} className="p-4 rounded-2xl border bg-card space-y-2.5 hover:bg-muted/40 transition-colors">
            <Link href={projectHref} target="_blank" className="flex items-center gap-3">
              {p.cover_url ? (
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted shrink-0">
                  <Image src={coverThumbnailSrc(p.cover_url)} alt={p.title} fill className="object-cover" style={{ objectPosition: p.cover_position }} />
                </div>
              ) : (
                <div
                  className="h-12 w-12 rounded-xl shrink-0 flex items-center justify-center text-lg"
                  style={{ backgroundColor: p.profile.accent_color + '20' }}
                >
                  🌍
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground truncate">{p.profile.display_name}</p>
              </div>
            </Link>

            {pct !== null && (
              <Link href={projectHref} target="_blank" className="block space-y-1">
                <Progress value={pct} className="h-1.5" />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(p.current_amount, p.currency)} · {pct.toFixed(0)}%
                </p>
              </Link>
            )}

            {(hasPrayer || isFinancial) && (
              <div className="flex justify-end gap-2 pt-0.5">
                {hasPrayer && (
                  <Link
                    href={`${projectHref}?tab=prayer`}
                    target="_blank"
                    title={t('quickPray')}
                    className={cn(buttonVariants({ variant: 'default', size: 'icon-sm' }))}
                  >
                    <HandHeart className="h-3.5 w-3.5" />
                  </Link>
                )}
                {isFinancial && (
                  <Link
                    href={`/${p.profile.username}/parceria?highlight_id=${p.id}&choice=financial_once`}
                    title={t('quickContribute')}
                    className={cn(buttonVariants({ variant: 'support', size: 'icon-sm' }))}
                  >
                    <HandCoins className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
