import { Sk } from '@/components/ui/skeleton'

// Sem esqueleto dedicado, caía no fallback de [username]/loading.tsx
// (avatar + grid de cards) — forma bem diferente desta tela centralizada
// de formulário, dando sensação de travamento na troca de página.
export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Sk className="h-7 w-56 mx-auto" />
          <Sk className="h-4 w-72 mx-auto" />
        </div>
        <div className="space-y-3">
          <Sk className="h-24 w-full rounded-xl" />
          <Sk className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
