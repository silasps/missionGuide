import { getTranslations } from 'next-intl/server'
import { formatCurrency } from '@/lib/utils'
import { Pledge } from '@/types/database'

/** Resumo de impacto do parceiro — soma por moeda (multi-currency finances,
 *  não dá pra somar valores em moedas diferentes num único total) das
 *  doações confirmadas + contagem de projetos únicos apoiados. */
export async function ImpactSummary({ pledges }: { pledges: Pledge[] }) {
  const t = await getTranslations('PartnerFinance')
  const confirmed = pledges.filter(p => p.status === 'confirmed')
  if (confirmed.length === 0) return null

  const totalsByCurrency = new Map<string, number>()
  for (const p of confirmed) {
    totalsByCurrency.set(p.currency, (totalsByCurrency.get(p.currency) ?? 0) + p.reported_amount)
  }
  const projectCount = new Set(confirmed.map(p => p.highlight_id).filter(Boolean)).size

  return (
    <div className="rounded-2xl border bg-card p-4 space-y-3">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <div>
          <p className="text-xl font-semibold">
            {[...totalsByCurrency.entries()].map(([currency, amount]) => formatCurrency(amount, currency)).join(' · ')}
          </p>
          <p className="text-xs text-muted-foreground">{t('impactTotalGiven')}</p>
        </div>
        <div>
          <p className="text-xl font-semibold">{projectCount}</p>
          <p className="text-xs text-muted-foreground">{t('impactProjectsSupported')}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground italic">{t('impactEncouragement')}</p>
    </div>
  )
}
