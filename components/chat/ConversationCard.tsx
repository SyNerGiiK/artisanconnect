import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'

type ConversationCardProps = {
  id: string
  projetTitre: string
  interlocuteurNom: string
  interlocuteurEntreprise?: string | null
  lastMessage?: string | null
  lastMessageDate?: string | null
  unreadCount: number
  href: string
}

export default function ConversationCard({
  projetTitre,
  interlocuteurNom,
  interlocuteurEntreprise,
  lastMessage,
  lastMessageDate,
  unreadCount,
  href,
}: ConversationCardProps) {
  const formattedDate = lastMessageDate
    ? new Date(lastMessageDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  const displayName = interlocuteurEntreprise ?? interlocuteurNom

  return (
    <Link
      href={href}
      className="group flex items-start gap-3.5 rounded-ac border border-ac-border bg-ac-surface p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:border-ac-primary-border hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
    >
      <Avatar name={displayName} size={44} />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="truncate font-bold text-ac-text transition-colors group-hover:text-ac-primary-text">
            {displayName}
          </h3>
          {formattedDate && (
            <span className="shrink-0 text-xs text-ac-text-muted">{formattedDate}</span>
          )}
        </div>

        <p className="mb-1 text-xs font-semibold text-ac-text-muted">{projetTitre}</p>

        {lastMessage && (
          <p className="truncate text-sm text-ac-text-sub">{lastMessage}</p>
        )}
      </div>

      {unreadCount > 0 && (
        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-ac-primary px-2 text-xs font-bold text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  )
}
