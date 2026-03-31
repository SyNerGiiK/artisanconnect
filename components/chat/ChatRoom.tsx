'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

type MessageRow = {
  id: string
  conversation_id: string
  auteur_id: string
  contenu: string
  lu: boolean
  created_at: string
}

type Participant = {
  id: string
  prenom: string
  nom: string
}

type ChatRoomProps = {
  conversationId: string
  currentUserId: string
  participants: Record<string, Participant>
}

export default function ChatRoom({
  conversationId,
  currentUserId,
  participants,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch initial messages
  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
      setLoading(false)
    }
    fetchMessages()
  }, [conversationId, supabase])

  // Subscribe to new messages via Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as MessageRow
          setMessages((prev) => {
            // Avoid duplicates (optimistic update already added it)
            if (prev.some((m) => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  // Mark unread messages as read
  useEffect(() => {
    const unreadIds = messages
      .filter((m) => !m.lu && m.auteur_id !== currentUserId)
      .map((m) => m.id)

    if (unreadIds.length > 0) {
      supabase
        .from('messages')
        .update({ lu: true })
        .in('id', unreadIds)
        .then()
    }
  }, [messages, currentUserId, supabase])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(contenu: string) {
    // Optimistic update
    const optimisticMessage: MessageRow = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      auteur_id: currentUserId,
      contenu,
      lu: false,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimisticMessage])

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      auteur_id: currentUserId,
      contenu,
    })

    if (error) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id))
    }
  }

  function getAuteurName(auteurId: string): string {
    const p = participants[auteurId]
    return p ? `${p.prenom} ${p.nom}` : 'Inconnu'
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Chargement des messages...
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            Aucun message pour le moment. Commencez la conversation !
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            contenu={msg.contenu}
            createdAt={msg.created_at}
            isOwn={msg.auteur_id === currentUserId}
            auteurNom={getAuteurName(msg.auteur_id)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 px-4 py-3">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}
