import Link from 'next/link'

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

  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
        {interlocuteurNom.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">
            {interlocuteurEntreprise ?? interlocuteurNom}
          </h3>
          {formattedDate && (
            <span className="shrink-0 text-xs text-gray-400">
              {formattedDate}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-1">{projetTitre}</p>

        {lastMessage && (
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
        )}
      </div>

      {unreadCount > 0 && (
        <span className="shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  )
}
