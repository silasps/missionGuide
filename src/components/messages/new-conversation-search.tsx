'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search } from 'lucide-react'

interface Contact {
  userId: string
  name: string
  avatarUrl: string | null
}

export function NewConversationSearch({ contacts, basePath }: { contacts: Contact[]; basePath: string }) {
  const t = useTranslations('Messages')
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const showList = focused || query.trim().length > 0
  const matches = query.trim()
    ? contacts.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : contacts

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={t('searchPlaceholder')}
        className="w-full pl-9 pr-3 py-2 rounded-xl border bg-card text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {showList && (
        <div className="absolute inset-x-0 top-full mt-2 z-30 space-y-1.5 p-1.5 rounded-2xl border bg-card shadow-lg max-h-80 overflow-y-auto">
          {matches.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">{t('noMatches')}</p>
          )}
          {matches.map(c => (
            <Link
              key={c.userId}
              href={`${basePath}/${c.userId}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-9 w-9 shrink-0">
                {c.avatarUrl && <AvatarImage src={c.avatarUrl} alt={c.name} />}
                <AvatarFallback className="text-xs">{getInitials(c.name)}</AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm truncate">{c.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
