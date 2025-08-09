'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChatMessage } from './ChatMessage'
import UnifiedRoomGenerator from '@/components/rooms/UnifiedRoomGenerator'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface RealTimeChatProps {
  roomId: string
  userId?: string
  className?: string
  maxHeight?: string
}

interface ChatRoom {
  id: string
  name: string
  description: string
  emoji_theme: string
  room_type: string
  max_participants: number
  current_participants: number
  is_active: boolean
  created_at: string
}

interface ChatMessageData {
  id: string
  content: string
  message_type: string
  created_at: string
  user_id: string | null
}

export const RealTimeChat = ({
  roomId,
  userId,
  className,
  maxHeight = '400px'
}: RealTimeChatProps) => {
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch room and messages data
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/chat/${roomId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch chat room')
        }
        
        const data = await response.json()
        setRoom(data.room)
        setMessages(data.messages || [])
      } catch (err) {
        console.error('Error fetching room data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load chat room')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRoomData()
  }, [roomId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      // For demo purposes, add message to local state
      // In production, this would send to the server and update via real-time subscription
      const newMsg: ChatMessageData = {
        id: Date.now().toString(),
        content: newMessage,
        message_type: 'text',
        created_at: new Date().toISOString(),
        user_id: userId || 'demo-user'
      }
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handlePromoteToRoom = async (roomSpec: any) => {
    try {
      const response = await fetch('/api/rooms/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...roomSpec,
          originalChatId: roomId,
          requestedBy: userId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit room promotion request')
      }
      
      // Could show success message or redirect
      console.log('Room promotion request submitted successfully')
    } catch (err) {
      console.error('Failed to submit room promotion:', err)
    }
  }

  // Generate chat context for promotion modal
  const getChatContext = () => {
    const uniqueUsers = new Set(messages.map(m => m.user_id)).size
    const recentTopics = messages
      .slice(-20)
      .map(m => m.content)
      .join(' ')
      .split(' ')
      .filter(word => word.length > 5)
      .slice(0, 5)
    
    return {
      id: roomId,
      messageCount: messages.length,
      participants: uniqueUsers,
      recentTopics,
      keyMessages: messages.slice(-5).map(m => m.content)
    }
  }

  if (loading) {
    return (
      <Card className={cn('p-4', className)}>
        <Flex align="center" justify="center" className="h-32">
          <Text variant="caption" className="text-gray-500">Loading chat...</Text>
        </Flex>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn('p-4', className)}>
        <Flex align="center" justify="center" className="h-32">
          <Text variant="caption" className="text-red-600">
            Error loading chat: {error}
          </Text>
        </Flex>
      </Card>
    )
  }

  return (
    <>
      <Card className={cn('flex flex-col', className)}>
      {/* Header with Promote Button */}
      <CardHeader className="pb-2">
        <Flex justify="between" align="center">
          <CardTitle className="text-lg">Chat Discussion</CardTitle>
          {messages.length >= 10 && userId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPromoteModal(true)}
              className="text-sm"
            >
              🚀 Promote to Room
            </Button>
          )}
        </Flex>
        {messages.length >= 10 && (
          <Text variant="caption" className="text-green-600">
            This conversation is active enough to become a Focus Room!
          </Text>
        )}
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-4 pt-0">
        <div 
          className="space-y-4 overflow-y-auto pr-2"
          style={{ maxHeight }}
        >
          {messages.length === 0 ? (
            <Flex align="center" justify="center" className="h-32">
              <Text variant="caption" className="text-gray-500">
                No messages yet. Start the conversation! 💬
              </Text>
            </Flex>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                content={message.content}
                author={{
                  id: message.user_id || 'anonymous',
                  name: message.user_id ? `User ${message.user_id.slice(0, 8)}` : 'Anonymous',
                  avatarUrl: '😊'
                }}
                createdAt={new Date(message.created_at)}
                conversationId={roomId}
                currentUserId={userId}
                showActions={false}
                className="mb-3"
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Message Input */}
      {userId ? (
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <Flex gap="sm" align="end">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  disabled={sending}
                />
              </div>
              <Button 
                type="submit" 
                disabled={!newMessage.trim() || sending}
                className="px-6"
              >
                {sending ? '...' : 'Send'}
              </Button>
            </Flex>
            <Text variant="caption" className="text-gray-500">
              Press Enter to send, Shift+Enter for new line
            </Text>
          </form>
        </div>
      ) : (
        <div className="border-t p-4 bg-gray-50">
          <Text variant="caption" className="text-center text-gray-500">
            <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
              Log in to participate
            </Link> or browse the conversation anonymously
          </Text>
        </div>
      )}
      </Card>

      {/* Promote to Room Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Promote Chat to Focus Room</h2>
                <button 
                  onClick={() => setShowPromoteModal(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <UnifiedRoomGenerator
                entryPoint="chat-promotion"
                chatContext={getChatContext()}
                onRoomRequest={handlePromoteToRoom}
                onClose={() => setShowPromoteModal(false)}
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
