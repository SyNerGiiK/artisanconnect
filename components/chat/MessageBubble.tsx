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
        className={`max-w-[75%] rounded-ac px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
          isOwn
            ? 'rounded-br-md bg-ac-primary text-white'
            : 'rounded-bl-md border border-ac-border bg-ac-surface text-ac-text'
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-[11px] font-semibold text-ac-text-muted">
            {auteurNom}
          </p>
        )}
        <p className="whitespace-pre-line text-sm leading-relaxed">{contenu}</p>
        <p
          className={`mt-1 text-[11px] ${
            isOwn ? 'text-white/75' : 'text-ac-text-muted'
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  )
}
