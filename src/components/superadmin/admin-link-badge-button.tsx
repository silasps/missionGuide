'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'

interface Props {
  label: string
}

// Client só pra checar a rota atual — dentro de /dashboard o botão some
// porque o SuperadminRoleSwitcher já cobre o mesmo atalho.
export function AdminLinkBadgeButton({ label }: Props) {
  const pathname = usePathname()
  if (pathname.startsWith('/dashboard')) return null

  return (
    <Link
      href="/superadmin"
      className="fixed bottom-20 right-4 md:bottom-4 z-50 flex items-center gap-1.5 rounded-full border bg-card shadow-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
    >
      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}
