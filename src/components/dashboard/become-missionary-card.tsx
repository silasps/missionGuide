'use client'

import { useTranslations } from 'next-intl'
import { Compass, Loader2 } from 'lucide-react'
import { becomeMissionary } from '@/app/dashboard/actions'
import { usePendingAction } from '@/hooks/use-pending-action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Convite pra virar missionário — reaproveitado nas áreas onde um apoiador
// realmente passa (meus-projetos, descoberta), não só escondido em
// Configurações → Conta (feedback direto do usuário).
//
// `compact` existe pra telas onde o parceiro está no meio de outra tarefa
// (ex: acompanhando os projetos que apoia) — a maioria dos parceiros não
// quer virar missionário, então ali o convite fica como uma linha discreta,
// não um card do mesmo peso visual do conteúdo principal.
export function BecomeMissionaryCard({ className, compact = false }: { className?: string; compact?: boolean }) {
  const t = useTranslations('BecomeMissionary')
  const { isPending, run } = usePendingAction()

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 py-3 px-1 text-sm text-muted-foreground', className)}>
        <span className="flex items-center gap-2">
          <Compass className="h-3.5 w-3.5 shrink-0" />
          {t('cardTitle')}
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(true, async () => { await becomeMissionary() })}
          className="shrink-0 font-medium text-foreground hover:underline disabled:opacity-50"
        >
          {isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin inline" />}
          {t('cta')}
        </button>
      </div>
    )
  }

  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Compass className="h-4 w-4 shrink-0" />
          {t('cardTitle')}
        </CardTitle>
        <CardDescription>{t('cardDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => run(true, async () => { await becomeMissionary() })}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('cta')}
        </Button>
      </CardContent>
    </Card>
  )
}
