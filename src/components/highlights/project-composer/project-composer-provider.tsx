'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface ProjectComposerContextValue {
  openProjectComposer: () => void
}

const ProjectComposerContext = createContext<ProjectComposerContextValue | null>(null)

export function useProjectComposer() {
  const ctx = useContext(ProjectComposerContext)
  if (!ctx) throw new Error('useProjectComposer deve ser usado dentro de ProjectComposerProvider')
  return ctx
}

interface Props {
  profileId: string
  children: ReactNode
}

// "Criar projeto" sempre cai no mesmo formulário de página cheia
// (HighlightForm, em /dashboard/projetos/novo) — antes esse provider abria
// um wizard fullscreen separado (ProjectComposerModal), reimplementação
// parcial do mesmo formulário (sem PrayerPointsEditor/GalleryEditor).
// `profileId` continua no tipo Props só pra não quebrar os 3 pontos de
// montagem existentes (dashboard/layout.tsx, [username]/page.tsx,
// [username]/projetos/[slug]/page.tsx), que não precisam mudar.
export function ProjectComposerProvider({ children }: Props) {
  const router = useRouter()

  function openProjectComposer() {
    router.push('/dashboard/projetos/novo')
  }

  return (
    <ProjectComposerContext.Provider value={{ openProjectComposer }}>
      {children}
    </ProjectComposerContext.Provider>
  )
}
