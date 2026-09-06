'use client'

import { useTranslations } from 'next-intl'
import { Profile } from '@/types/database'
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog'
import { ShareButton } from '@/components/shared/share-button'

interface Props {
  profile: Profile
}

// Substitui o ProfileCTA (Parceria/Oração/Mensagem) quando quem está
// vendo o perfil é o próprio dono/gestor — equivalente aos botões
// "Editar perfil" / "Compartilhar perfil" do Instagram.
export function ProfileOwnerActions({ profile }: Props) {
  const t = useTranslations('PublicProfile')
  // Parceiro não tem seguidores nem motivo pra divulgar o próprio perfil —
  // "Compartilhar perfil" só faz sentido pra quem tem conteúdo público
  // (missionário). Feedback direto: perfil de parceiro estava copiando
  // ações do missionário sem necessidade.
  const isMissionary = profile.user_role === 'missionary'

  return (
    <div className="flex gap-3">
      <EditProfileDialog profile={profile} />
      {isMissionary && (
        <ShareButton
          className="flex-1"
          url={typeof window !== 'undefined' ? `${window.location.origin}/${profile.username}` : `/${profile.username}`}
          title={profile.display_name}
          label={t('shareProfile')}
          copiedLabel={t('linkCopied')}
        />
      )}
    </div>
  )
}
