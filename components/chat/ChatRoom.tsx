'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

const PAGE_SIZE = 50

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
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  
  // Use a ref to know when to scroll to bottom automatically
  const shouldScrollToBottom = useRef(true)

  // Fetch initial messages
  useEffect(() => {
    async function fetchMessages() {
      const { data, count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1)

      if (data) {
        setMessages(data.reverse())
        if (data.length < PAGE_SIZE) setHasMore(false)
      }
      if (count !== null) setTotalCount(count)
      setLoading(false)
    }
    fetchMessages()
  }, [conversationId, supabase])

  // Load older messages
  async function loadOlderMessages() {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    
    // Do not autoscroll when loading older messages
    shouldScrollToBottom.current = false

    const prevScrollHeight = scrollContainerRef.current?.scrollHeight || 0

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(messages.length, messages.length + PAGE_SIZE - 1)

    if (data && data.length > 0) {
      setMessages((prev) => [...data.reverse(), ...prev])
      if (data.length < PAGE_SIZE) setHasMore(false)
      
      // Restore scroll position
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            scrollContainerRef.current.scrollHeight - prevScrollHeight
        }
      })
    } else {
      setHasMore(false)
    }
    setLoadingMore(false)
  }

  // Subscribe to new messages via Realtime with reconnection
  useEffect(() => {
    let lastSeenAt = new Date().toISOString()
    
    // Find the latest message to init lastSeenAt
    if (messages.length > 0) {
      lastSeenAt = messages[messages.length - 1].created_at
    }

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
          lastSeenAt = newMessage.created_at
          shouldScrollToBottom.current = true // New message came in, we should scroll down!
          
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Reconnexion: rattraper les messages manqués
          const { data: missedMessages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .gt('created_at', lastSeenAt)
            .order('created_at', { ascending: true })

          if (missedMessages && missedMessages.length > 0) {
            shouldScrollToBottom.current = true // Scroll down to show missed messages
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id))
              const newOnes = missedMessages.filter((m) => !existingIds.has(m.id))
              return [...prev, ...newOnes]
            })
            lastSeenAt = missedMessages[missedMessages.length - 1].created_at
          }
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase]) // Do not put `messages` here, otherwise it will resubscribe constantly

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

  // Auto-scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  async function handleSend(contenu: string) {
    shouldScrollToBottom.current = true // Scroll explicitly for user's own message
    
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
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {hasMore && (
          <button
            onClick={loadOlderMessages}
            disabled={loadingMore}
            className="mx-auto block text-sm text-blue-600 hover:text-blue-800 py-2"
          >
            {loadingMore ? 'Chargement...' : 'Charger les messages précédents'}
          </button>
        )}
        
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
