'use client'

import { useState } from 'react'

type ChatInputProps = {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return
    onSend(trimmed)
    setMessage('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Votre message…"
        rows={1}
        className="flex-1 resize-none rounded-ac-sm border border-ac-border bg-ac-surface px-3.5 py-2.5 text-sm text-ac-text placeholder:text-ac-text-muted focus:border-ac-primary focus:outline-none focus:ring-2 focus:ring-ac-primary/20 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="shrink-0 rounded-ac-sm bg-ac-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-ac-primary-dark hover:shadow-[0_4px_14px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
      >
        Envoyer
      </button>
    </form>
  )
}
