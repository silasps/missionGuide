import { createClient } from '@/lib/supabase/server'
import { getActiveProfile } from '@/lib/profile/active-profile'
import { ConversationList } from '@/components/messages/conversation-list'
import { NewConversationSearch } from '@/components/messages/new-conversation-search'

export default async function MensagensPage() {
  const supabase = await createClient()
  const [{ data: { user } }, profile] = await Promise.all([
    supabase.auth.getUser(),
    getActiveProfile(),
  ])

  // Nem toda mensagem tem profile_id = meu perfil: se eu mandei mensagem pra outro
  // missionário como parceiro, a conversa pertence ao profile_id DELE. Por isso aqui
  // busca por participação (sender/recipient), não por dono do perfil.
  const [{ data: messages }, { data: partners }, { data: follows }] = await Promise.all([
    supabase.from('messages')
      .select('sender_id, recipient_id, created_at')
      .or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
      .order('created_at', { ascending: false }),
    supabase.from('partners').select('user_id, name').eq('profile_id', profile!.id).not('user_id', 'is', null),
    supabase.from('follows').select('profile:profiles(user_id, display_name, avatar_url)').eq('follower_user_id', user!.id),
  ])

  // Quem eu sigo, pra poder buscar e iniciar uma conversa nova mesmo sem
  // histórico ainda (feedback: não tinha como contatar quem eu ainda não
  // tinha trocado mensagem).
  const followedContacts = (follows ?? [])
    .map((f) => {
      const p = Array.isArray(f.profile) ? f.profile[0] : f.profile
      return p?.user_id ? { userId: p.user_id as string, name: p.display_name as string, avatarUrl: p.avatar_url as string | null } : null
    })
    .filter((c): c is { userId: string; name: string; avatarUrl: string | null } => !!c && c.userId !== user!.id)
  const nameByUserId = new Map((partners ?? []).map(p => [p.user_id as string, p.name]))

  const seen = new Map<string, string>()
  for (const m of messages ?? []) {
    const otherId = m.sender_id === user!.id ? m.recipient_id : m.sender_id
    if (!seen.has(otherId)) seen.set(otherId, m.created_at)
  }

  const otherUserIds = [...seen.keys()]
  const { data: senderProfiles } = otherUserIds.length
    ? await supabase.from('profiles').select('user_id, display_name, avatar_url').in('user_id', otherUserIds)
    : { data: [] }
  const displayNameByUserId = new Map((senderProfiles ?? []).map(p => [p.user_id as string, p.display_name]))
  const avatarByUserId = new Map((senderProfiles ?? []).map(p => [p.user_id as string, p.avatar_url]))

  const conversations = [...seen.entries()].map(([otherUserId, lastMessageAt]) => ({
    otherUserId,
    name: nameByUserId.get(otherUserId) ?? displayNameByUserId.get(otherUserId) ?? 'Parceiro',
    avatarUrl: avatarByUserId.get(otherUserId) ?? null,
    lastMessageAt,
  }))

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Mensagens</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Conversas cifradas com seus parceiros</p>
      </div>
      <NewConversationSearch contacts={followedContacts} basePath="/dashboard/mensagens" />
      <ConversationList conversations={conversations} basePath="/dashboard/mensagens" />
    </div>
  )
}
