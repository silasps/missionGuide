'use client'

import { useTranslations } from 'next-intl'
import { PaymentMethod, FinancialAccount } from '@/types/database'
import { PaymentMethodCard } from './payment-method-card'
import { PaymentMethodForm } from './payment-method-form'
import { StripeConnectCard } from './stripe-connect-card'

interface Props {
  profileId: string
  methods: PaymentMethod[]
  financialAccounts: FinancialAccount[]
}

export function PaymentMethodsList({ profileId, methods, financialAccounts }: Props) {
  const t = useTranslations('PaymentMethods')
  const manualMethods = methods.filter(m => m.type !== 'stripe')
  const stripeMethod = methods.find(m => m.type === 'stripe') ?? null
  const nextSortOrder = manualMethods.reduce((max, m) => Math.max(max, m.sort_order), -1) + 1
  // Uma conta arquivada saiu da lista ativa do Financeiro por decisão do dono — não
  // deve ser oferecida como destino pra um novo vínculo (Stripe ou Pix), só continua
  // valendo pra quem já estava linkado antes de ser arquivada.
  const linkableAccounts = financialAccounts.filter(a => !a.archived)

  // Antes de conectar, o Stripe não aparece em lugar nenhum aqui — some
  // dentro do "+ Novo método" (ver PaymentMethodForm/showStripeOption).
  // Depois que a conexão começa (pendente ou ativa), passa a ser só mais um
  // card dentro da mesma grade dos métodos manuais (Pix etc.), não um bloco
  // grande separado acima — pedido direto do usuário, que achava estranho
  // ele se destacar tanto dos demais.
  const totalCount = manualMethods.length + (stripeMethod ? 1 : 0)

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('intro')}</p>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-muted-foreground">{t('methodCount', { count: totalCount })}</p>
        <PaymentMethodForm profileId={profileId} nextSortOrder={nextSortOrder} financialAccounts={linkableAccounts} showStripeOption={!stripeMethod} />
      </div>
      {totalCount === 0 ? (
        <p className="rounded-lg border border-dashed border-input px-4 py-8 text-center text-sm text-muted-foreground">
          {t('empty')}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {stripeMethod && (
            <StripeConnectCard stripeMethod={stripeMethod} financialAccounts={linkableAccounts} />
          )}
          {manualMethods.map(m => (
            <PaymentMethodCard key={m.id} method={m} profileId={profileId} financialAccounts={linkableAccounts} />
          ))}
        </div>
      )}
    </div>
  )
}
