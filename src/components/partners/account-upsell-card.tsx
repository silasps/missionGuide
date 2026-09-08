'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  missionaryName: string
  redirectParam: string
  whatsappGroupUrl?: string | null
}

// Card não-bloqueante mostrado nas telas de parceria pra quem não tem
// conta — reaproveitado por ScheduledPledgeForm, RecurringPledgeForm e
// PartnershipWizard (oração/embaixador/voluntariado). Nunca é a única
// opção na tela: sempre ao lado de um jeito de continuar sem conta.
export function AccountUpsellCard({ missionaryName, redirectParam, whatsappGroupUrl }: Props) {
  const t = useTranslations('AccountUpsell')

  return (
    <Card className="bg-support/10 border-support/30">
      <CardContent className="py-4 space-y-2">
        <p className="text-sm">{t('prompt', { name: missionaryName })}</p>
        <div className="flex gap-2">
          <Link href={`/cadastro?redirect=${redirectParam}`} className="flex-1">
            <Button type="button" variant="support" className="w-full">{t('cta')}</Button>
          </Link>
          <Link href={`/login?redirect=${redirectParam}`} className="flex-1">
            <Button type="button" variant="outline" className="w-full">{t('alreadyHaveAccount')}</Button>
          </Link>
        </div>
        {whatsappGroupUrl && (
          <Link href={whatsappGroupUrl} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="outline" className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              {t('whatsappGroupCta', { name: missionaryName })}
            </Button>
          </Link>
        )}
        <p className="text-xs text-muted-foreground">{t('note')}</p>
      </CardContent>
    </Card>
  )
}
