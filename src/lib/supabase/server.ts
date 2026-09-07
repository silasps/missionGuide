import { cache } from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// auth.getUser() sempre faz um round-trip de rede de verdade (verifica o
// token contra o servidor da Supabase, ao contrário de getSession() que só
// decodifica o JWT local) — várias telas/layouts na mesma navegação chamavam
// isso direto e de forma independente (dashboard/layout.tsx,
// financeiro/layout.tsx, a própria page.tsx...), pagando esse custo várias
// vezes na mesma request. cache() do React memoiza por request: a partir da
// primeira chamada, as próximas reaproveitam o mesmo resultado sem round-trip
// novo. Motivado por lentidão real reportada ao trocar de aba no Financeiro.
export const getCachedUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - cookies set via proxy
          }
        },
      },
    }
  )
}

export async function createServiceClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
