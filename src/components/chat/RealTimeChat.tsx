'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChatMessage } from './ChatMessage'
import { EnhancedChatHeader } from './EnhancedChatHeader'
import { ChatFiltersAndTools } from './ChatFiltersAndTools'
import { QuickPoll, CreatePollModal } from './QuickPoll'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Layout'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
// Icons imported by enhanced components

interface RealTimeChatProps {
  roomId: string
  userId?: string
  className?: string
  maxHeight?: string
}

interface ChatStats {
  activeUsers: number
  messageCount: number
  engagementLevel: 'low' | 'medium' | 'high'
  recentActivity: string
}

interface Poll {
  id: string
  question: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  userVote?: string
  createdBy: string
  createdAt: string
}

type ChatFilter = 'all' | 'hot' | 'questions' | 'ideas' | 'polls'

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
  
  // Enhanced features state
  const [activeFilter, setActiveFilter] = useState<ChatFilter>('all')
  const [showCreatePoll, setShowCreatePoll] = useState(false)
  const [polls, setPolls] = useState<Poll[]>([])
  const [chatStats, setChatStats] = useState<ChatStats>({
    activeUsers: 0,
    messageCount: 0,
    engagementLevel: 'low',
    recentActivity: 'No recent activity'
  })
  const [aiSummary, setAiSummary] = useState<string>('')
  
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

  // Generate AI summary and stats when messages change
  useEffect(() => {
    const generateAISummary = () => {
      if (messages.length === 0) {
        setAiSummary('No messages yet')
        return
      }

      const recentMessages = messages.slice(-10)
      const allText = recentMessages.map(m => m.content.toLowerCase()).join(' ')
      
      // Static keyword analysis
      const hotKeywords = ['urgent', 'important', 'breaking', 'crisis', 'trending']
      const questionKeywords = ['how', 'what', 'why', 'when', 'where', '?']
      const ideaKeywords = ['should', 'could', 'what if', 'propose', 'suggest', 'idea']
      
      const hasHotTopics = hotKeywords.some(keyword => allText.includes(keyword))
      const hasQuestions = questionKeywords.some(keyword => allText.includes(keyword))
      const hasIdeas = ideaKeywords.some(keyword => allText.includes(keyword))
      
      let summary = `Active discussion with ${messages.length} messages. `
      
      if (hasHotTopics) summary += 'Hot topics being discussed. '
      if (hasQuestions) summary += 'Questions being asked. '
      if (hasIdeas) summary += 'Ideas being shared. '
      
      if (messages.length >= 10) {
        summary += 'Ready for promotion to Focus Room.'
      } else {
        summary += `${10 - messages.length} more messages until Focus Room eligibility.`
      }
      
      setAiSummary(summary)
    }

    const updateChatStats = () => {
      const uniqueUsers = new Set(messages.map(m => m.user_id)).size
      const recentMessages = messages.filter(m => {
        const messageTime = new Date(m.created_at).getTime()
        const now = Date.now()
        return now - messageTime < 3600000 // Last hour
      })
      
      let engagementLevel: 'low' | 'medium' | 'high' = 'low'
      if (recentMessages.length > 10) engagementLevel = 'high'
      else if (recentMessages.length > 5) engagementLevel = 'medium'
      
      const lastMessage = messages[messages.length - 1]
      const lastActivity = lastMessage 
        ? `${Math.floor((Date.now() - new Date(lastMessage.created_at).getTime()) / 60000)} min ago`
        : 'No recent activity'
      
      setChatStats({
        activeUsers: uniqueUsers,
        messageCount: messages.length,
        engagementLevel,
        recentActivity: lastActivity
      })
    }

    if (messages.length > 0) {
      generateAISummary()
      updateChatStats()
    }
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
      handleSendMessage(e as React.FormEvent)
    }
  }

  // Filter messages based on active filter
  const getFilteredMessages = () => {
    if (activeFilter === 'all') return messages
    
    return messages.filter(message => {
      const content = message.content.toLowerCase()
      
      switch (activeFilter) {
        case 'hot':
          return ['urgent', 'important', 'breaking', 'crisis', 'trending'].some(keyword => 
            content.includes(keyword)
          )
        case 'questions':
          return content.includes('?') || 
                 ['how', 'what', 'why', 'when', 'where'].some(keyword => content.includes(keyword))
        case 'ideas':
          return ['should', 'could', 'what if', 'propose', 'suggest', 'idea'].some(keyword => 
            content.includes(keyword)
          )
        case 'polls':
          return ['vote', 'choose', 'prefer', 'poll'].some(keyword => content.includes(keyword))
        default:
          return true
      }
    })
  }

  // Handle poll creation
  const handleCreatePoll = (question: string, options: string[]) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.map((text, index) => ({
        id: `option-${index}`,
        text,
        votes: 0
      })),
      totalVotes: 0,
      createdBy: userId ? `User ${userId.slice(0, 8)}` : 'Anonymous',
      createdAt: new Date().toISOString()
    }
    
    setPolls(prev => [...prev, newPoll])
    setShowCreatePoll(false)
  }

  // Handle poll voting
  const handlePollVote = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => 
            option.id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          ),
          totalVotes: poll.totalVotes + 1,
          userVote: optionId
        }
      }
      return poll
    }))
  }

  // Handle engagement tool actions
  const handleToolAction = (action: string) => {
    switch (action) {
      case 'poll':
        setShowCreatePoll(true)
        break
      case 'image':
        // TODO: Implement image upload
        console.log('Image upload clicked')
        break
      case 'camera':
        // TODO: Implement camera capture
        console.log('Camera capture clicked')
        break
      default:
        break
    }
  }

  // Filter messages based on active filter
  const getFilteredMessages = () => {
    if (activeFilter === 'all') return messages
    
    const filterKeywords = {
      hot: ['urgent', 'important', 'breaking', 'crisis', 'trending'],
      questions: ['how', 'what', 'why', 'when', 'where', '?'],
      ideas: ['should', 'could', 'what if', 'propose', 'suggest', 'idea'],
      polls: [] // Polls are handled separately
    }
    
    const keywords = filterKeywords[activeFilter as keyof typeof filterKeywords] || []
    
    return messages.filter(message => {
      const content = message.content.toLowerCase()
      return keywords.some(keyword => content.includes(keyword))
    })
  }

  // Calculate message statistics for filters
  const getMessageStats = () => {
    const filterKeywords = {
      hotTopics: ['urgent', 'important', 'breaking', 'crisis', 'trending'],
      questions: ['how', 'what', 'why', 'when', 'where', '?'],
      ideas: ['should', 'could', 'what if', 'propose', 'suggest', 'idea']
    }
    
    const stats = {
      hotTopics: 0,
      questions: 0,
      ideas: 0,
      polls: polls.length
    }
    
    messages.forEach(message => {
      const content = message.content.toLowerCase()
      
      if (filterKeywords.hotTopics.some(keyword => content.includes(keyword))) {
        stats.hotTopics++
      }
      if (filterKeywords.questions.some(keyword => content.includes(keyword))) {
        stats.questions++
      }
      if (filterKeywords.ideas.some(keyword => content.includes(keyword))) {
        stats.ideas++
      }
    })
    
    return stats
  }



  // Generate chat context for promotion modal
  const generateChatContext = () => {
    const uniqueUsers = new Set(messages.map(m => m.user_id)).size
    const recentTopics = messages
      .slice(-10)
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

  // Get filtered and processed messages for display
  const filteredMessages = getFilteredMessages()
  const displayMessages = [...filteredMessages]
  
  // Insert polls into message stream
  polls.forEach(poll => {
    displayMessages.push({
      id: `poll-${poll.id}`,
      content: '', // Will be rendered as poll component
      message_type: 'poll',
      created_at: poll.createdAt,
      user_id: poll.createdBy,
      poll // Add poll data
    } as ChatMessageData & { poll: Poll })
  })
  
  // Sort by creation time
  displayMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

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
        {/* Enhanced Header */}
        <EnhancedChatHeader
          roomName={room?.name || 'Chat Discussion'}
          aiSummary={aiSummary}
          stats={chatStats}
          onPromote={() => setShowPromoteModal(true)}
          canPromote={messages.length >= 10 && !!userId}
          topicContext={room?.description ? {
            originalTitle: room.name,
            originalContent: room.description,
            sourceType: 'news' as const
          } : undefined}
        />
        
        {/* Chat Filters and Tools */}
        <ChatFiltersAndTools
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onCreatePoll={() => setShowCreatePoll(true)}
          onUploadImage={() => console.log('Image upload clicked')}
          messageStats={getMessageStats()}
        />

        {/* Messages Area */}
        <CardContent className="flex-1 p-4 pt-0">
          <div 
            className="space-y-4 overflow-y-auto pr-2"
            style={{ maxHeight }}
          >
            {displayMessages.length === 0 ? (
              <Flex align="center" justify="center" className="h-32">
                <Text variant="caption" className="text-gray-500">
                  {activeFilter === 'all' 
                    ? 'No messages yet. Start the conversation! 💬'
                    : `No ${activeFilter} messages found. Try a different filter.`
                  }
                </Text>
              </Flex>
            ) : (
              displayMessages.map((message) => {
                // Render polls differently
                if (message.message_type === 'poll' && (message as ChatMessageData & { poll: Poll }).poll) {
                  return (
                    <QuickPoll
                      key={message.id}
                      poll={(message as ChatMessageData & { poll: Poll }).poll}
                      onVote={handlePollVote}
                      currentUserId={userId}
                    />
                  )
                }
                
                return (
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
                )
              })
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
            <Flex justify="between" align="center">
              <Text variant="caption" className="text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </Text>
              <Text variant="caption" className="text-gray-500">
                {activeFilter !== 'all' && `Showing ${filteredMessages.length} ${activeFilter} messages`}
              </Text>
            </Flex>
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

      {/* Promote Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Promote Chat to Focus Room</h3>
            <p className="text-gray-600 mb-6">
              Transform this active chat into a structured Focus Room for deeper collaboration.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPromoteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Link href="/rooms/generate" className="flex-1">
                <Button className="w-full">
                  Create Room
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Poll Modal */}
      <CreatePollModal
        isOpen={showCreatePoll}
        onClose={() => setShowCreatePoll(false)}
        onCreatePoll={handleCreatePoll}
      />
    </>
  )
}
