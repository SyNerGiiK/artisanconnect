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
      className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:ring-blue-200"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-base transition-colors group-hover:bg-blue-600 group-hover:text-white">
        {interlocuteurNom.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {interlocuteurEntreprise ?? interlocuteurNom}
          </h3>
          {formattedDate && (
            <span className="shrink-0 text-xs text-gray-400">
              {formattedDate}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-1.5 font-medium">{projetTitre}</p>

        {lastMessage && (
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
        )}
      </div>

      {unreadCount > 0 && (
        <span className="shrink-0 flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-bold text-white shadow-lg shadow-blue-200">
          {unreadCount}
        </span>
      )}
    </Link>
  )
}
