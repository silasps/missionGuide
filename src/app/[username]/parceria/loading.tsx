import { Sk } from '@/components/ui/skeleton'

// Sem esqueleto dedicado, caía no fallback de [username]/loading.tsx
// (avatar + grid de cards) — forma diferente do wizard de contribuição,
// dando sensação de travamento na troca de página.
export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        <Sk className="aspect-[1.91/1] w-full rounded-2xl" />
        <Sk className="h-6 w-48 mx-auto" />
        <div className="space-y-2.5">
          <Sk className="h-14 w-full rounded-xl" />
          <Sk className="h-14 w-full rounded-xl" />
          <Sk className="h-14 w-full rounded-xl" />
        </div>
        <Sk className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
