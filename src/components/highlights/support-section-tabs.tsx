'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  financialLabel: string
  prayerLabel: string
  financialContent: React.ReactNode
  prayerContent: React.ReactNode
  defaultTab?: 'financial' | 'prayer'
}

/** Mesmo padrão de pill-button já usado em PrayerInbox (useState local,
 *  sem componente Tabs novo no design system) — só aparece quando o
 *  projeto tem os dois tipos de apoio com conteúdo real; um só dos dois
 *  não passa por aqui (ver [slug]/page.tsx). */
export function SupportSectionTabs({ financialLabel, prayerLabel, financialContent, prayerContent, defaultTab = 'financial' }: Props) {
  const [tab, setTab] = useState<'financial' | 'prayer'>(defaultTab)

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full bg-muted p-1 gap-1">
        {([
          { key: 'financial', label: financialLabel },
          { key: 'prayer', label: prayerLabel },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm transition-colors',
              tab === key ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div hidden={tab !== 'financial'}>{financialContent}</div>
      <div hidden={tab !== 'prayer'}>{prayerContent}</div>
    </div>
  )
}
