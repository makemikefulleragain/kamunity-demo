'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Message {
  id: string
  content: string
  user_id: string
  room_id: string
  message_type: 'text' | 'system' | 'emoji'
  created_at: string
  user?: {
    id: string
    name: string
    username: string
    emoji_avatar: string
  }
}

interface UseRealTimeChatProps {
  roomId: string
  userId?: string
}

export const useRealTimeChat = ({ roomId, userId }: UseRealTimeChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:users(id, name, username, emoji_avatar)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }, [roomId])

  // Send a new message
  const sendMessage = useCallback(async (content: string) => {
    if (!userId || !content.trim()) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          user_id: userId,
          room_id: roomId,
          message_type: 'text'
        })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      throw err
    }
  }, [userId, roomId])

  // Set up real-time subscription
  useEffect(() => {
    if (!roomId) return

    const newChannel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Fetch the complete message with user data
          const { data: messageWithUser } = await supabase
            .from('messages')
            .select(`
              *,
              user:users(id, name, username, emoji_avatar)
            `)
            .eq('id', payload.new.id)
            .single()

          if (messageWithUser) {
            setMessages(prev => [...prev, messageWithUser])
          }
        }
      )
      .subscribe()



    return () => {
      newChannel.unsubscribe()
    }
  }, [roomId])

  // Initial fetch
  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Join room as participant
  useEffect(() => {
    if (!userId || !roomId) return

    const joinRoom = async () => {
      try {
        // Insert or update room participant
        await supabase
          .from('room_participants')
          .upsert({
            user_id: userId,
            room_id: roomId,
            last_active: new Date().toISOString()
          })
      } catch (err) {
        console.error('Failed to join room:', err)
      }
    }

    joinRoom()
  }, [userId, roomId])

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages
  }
}
