'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { UserRole } from '@/types/database'
import { setPreviewRole } from '@/app/dashboard/actions'
import { usePendingAction } from '@/hooks/use-pending-action'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ShieldCheck } from 'lucide-react'

interface Props {
  effectiveRole: UserRole
  isPreviewing: boolean
}

// Só renderizado quando isSuperAdmin(user.email) — ver dashboard/layout.tsx.
// Único botão flutuante "Área admin": ao abrir, mostra o "visualizar como"
// (não impersona ninguém, só decide qual nav renderizar para o PRÓPRIO
// perfil ativo do superadmin — ver system.architecture.md §7) e o atalho
// pra ir de fato pra /superadmin. Substitui o AdminLinkBadge global dentro
// de /dashboard (ver admin-link-badge-button.tsx), que ficaria duplicado.
export function SuperadminRoleSwitcher({ effectiveRole, isPreviewing }: Props) {
  const t = useTranslations('Superadmin')
  const { pendingValue, run } = usePendingAction<UserRole | 'reset'>()

  function switchTo(role: UserRole) {
    run(role, () => setPreviewRole(role))
  }

  function reset() {
    run('reset', () => setPreviewRole(null))
  }

  return (
    <Popover>
      <PopoverTrigger
        className="fixed bottom-20 right-4 md:bottom-4 z-50 flex items-center gap-1.5 rounded-full border bg-card shadow-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        <span className="hidden sm:inline">{t('adminArea')}</span>
      </PopoverTrigger>
      <PopoverContent align="end" side="top" className="w-56 p-3">
        <p className="text-xs text-muted-foreground mb-2">{t('viewingAs')}</p>
        <div className="flex items-center gap-1.5 mb-1">
          <Button
            size="xs"
            variant={effectiveRole === 'missionary' ? 'default' : 'ghost'}
            disabled={pendingValue !== null}
            onClick={() => switchTo('missionary')}
          >
            {t('missionary')}
          </Button>
          <Button
            size="xs"
            variant={effectiveRole === 'partner' ? 'default' : 'ghost'}
            disabled={pendingValue !== null}
            onClick={() => switchTo('partner')}
          >
            {t('partner')}
          </Button>
        </div>
        {isPreviewing && (
          <Button
            size="xs"
            variant="outline"
            className="w-full mb-2"
            disabled={pendingValue !== null}
            onClick={reset}
          >
            {t('reset')}
          </Button>
        )}
        <div className="border-t pt-2">
          <Link
            href="/superadmin"
            className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            {t('adminArea')}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
