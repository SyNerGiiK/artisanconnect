type MessageBubbleProps = {
  contenu: string
  createdAt: string
  isOwn: boolean
  auteurNom: string
}

export default function MessageBubble({
  contenu,
  createdAt,
  isOwn,
  auteurNom,
}: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        {!isOwn && (
          <p
            className={`text-xs font-medium mb-1 ${
              isOwn ? 'text-blue-200' : 'text-gray-500'
            }`}
          >
            {auteurNom}
          </p>
        )}
        <p className="text-sm whitespace-pre-line">{contenu}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? 'text-blue-200' : 'text-gray-400'
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  )
}
