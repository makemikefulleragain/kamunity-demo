'use client'

import { useState, useEffect, useRef } from 'react'
import { Button, Text } from '@/components/ui'
import { Send, Users } from 'lucide-react'

interface Message {
  id: string
  content: string
  user_id: string
  username: string
  emoji_avatar: string
  created_at: string
}

interface MockRealTimeChatProps {
  roomId: string
}

// Mock messages based on our seeded data
const mockMessages: Record<string, Message[]> = {
  'room-urban-farming': [
    {
      id: '1',
      content: 'Hey everyone! I\'ve been experimenting with vertical farming in my apartment. Anyone else tried this?',
      user_id: 'user-1',
      username: 'sarahc',
      emoji_avatar: '🌱',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: '2',
      content: 'That sounds amazing! I\'ve been thinking about starting a community garden in our neighborhood.',
      user_id: 'user-2',
      username: 'marcusj',
      emoji_avatar: '🔬',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
    },
    {
      id: '3',
      content: 'I love this idea! Urban farming could really help with food security in cities.',
      user_id: 'user-3',
      username: 'elenar',
      emoji_avatar: '🎨',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
    },
    {
      id: '4',
      content: 'Has anyone looked into hydroponic systems? I\'m curious about the setup costs.',
      user_id: 'user-4',
      username: 'davidk',
      emoji_avatar: '💡',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString()
    },
    {
      id: '5',
      content: 'I actually built a small hydroponic setup last month! Happy to share what I learned.',
      user_id: 'user-5',
      username: 'priyap',
      emoji_avatar: '🚀',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString()
    },
    {
      id: '6',
      content: 'This is exactly what we need! Maybe we could organize a workshop?',
      user_id: 'user-6',
      username: 'alext',
      emoji_avatar: '🌍',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    },
    {
      id: '7',
      content: 'A workshop sounds perfect! We could cover different techniques and share resources.',
      user_id: 'user-1',
      username: 'sarahc',
      emoji_avatar: '🌱',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString()
    },
    {
      id: '8',
      content: 'I can help with the technical side - sensors, automation, that kind of stuff.',
      user_id: 'user-4',
      username: 'davidk',
      emoji_avatar: '💡',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
    },
    {
      id: '9',
      content: 'And I could help with the community outreach and organizing!',
      user_id: 'user-3',
      username: 'elenar',
      emoji_avatar: '🎨',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    },
    {
      id: '10',
      content: 'This is turning into something really exciting! Should we start planning this properly?',
      user_id: 'user-2',
      username: 'marcusj',
      emoji_avatar: '🔬',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
    },
    {
      id: '11',
      content: 'Yes! I think we have enough interest and expertise to make this happen.',
      user_id: 'user-5',
      username: 'priyap',
      emoji_avatar: '🚀',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: '12',
      content: 'This feels like it could be bigger than just a workshop - maybe a whole urban farming initiative?',
      user_id: 'user-6',
      username: 'alext',
      emoji_avatar: '🌍',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  ],
  'room-ai-education': [
    {
      id: '1',
      content: 'Has anyone tried using AI tools in their teaching? I\'m curious about the practical applications.',
      user_id: 'user-2',
      username: 'marcusj',
      emoji_avatar: '🔬',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
      id: '2',
      content: 'I\'ve been experimenting with AI-powered lesson planning. It\'s been really helpful!',
      user_id: 'user-4',
      username: 'davidk',
      emoji_avatar: '💡',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
    },
    {
      id: '3',
      content: 'What about student privacy concerns? That\'s been holding me back.',
      user_id: 'user-1',
      username: 'sarahc',
      emoji_avatar: '🌱',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
    },
    {
      id: '4',
      content: 'Good point! We definitely need to be careful about data protection.',
      user_id: 'user-5',
      username: 'priyap',
      emoji_avatar: '🚀',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString()
    },
    {
      id: '5',
      content: 'I\'ve found some great tools that work locally without sending data to external servers.',
      user_id: 'user-3',
      username: 'elenar',
      emoji_avatar: '🎨',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString()
    },
    {
      id: '6',
      content: 'That sounds promising! Could you share some examples?',
      user_id: 'user-6',
      username: 'alext',
      emoji_avatar: '🌍',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    },
    {
      id: '7',
      content: 'Sure! I\'ll put together a list of privacy-friendly AI tools for education.',
      user_id: 'user-3',
      username: 'elenar',
      emoji_avatar: '🎨',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    }
  ],
  'room-climate-action': [
    {
      id: '1',
      content: 'What are some actionable things we can do about climate change at the local level?',
      user_id: 'user-6',
      username: 'alext',
      emoji_avatar: '🌍',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: '2',
      content: 'I\'ve been thinking about organizing a neighborhood solar panel group buy.',
      user_id: 'user-5',
      username: 'priyap',
      emoji_avatar: '🚀',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
    },
    {
      id: '3',
      content: 'That\'s brilliant! Bulk purchasing could make it much more affordable.',
      user_id: 'user-1',
      username: 'sarahc',
      emoji_avatar: '🌱',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
    },
    // ... continuing with more messages to reach 15 total
    {
      id: '15',
      content: 'I think we have the momentum to start a real climate action group in our area!',
      user_id: 'user-2',
      username: 'marcusj',
      emoji_avatar: '🔬',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    }
  ]
}

export function MockRealTimeChat({ roomId }: MockRealTimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load mock messages for this room
    const roomMessages = mockMessages[roomId] || []
    setMessages(roomMessages)
  }, [roomId])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      user_id: 'current-user',
      username: 'you',
      emoji_avatar: '😊',
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-gray-600" />
          <Text className="text-sm text-gray-600">
            {messages.length > 0 ? `${new Set(messages.map(m => m.user_id)).size} participants` : 'Loading...'}
          </Text>
        </div>
        
        {messages.length >= 10 && (
          <Button 
            onClick={() => setIsPromoteModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
          >
            🚀 Promote to Room
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Text>No messages yet. Start the conversation!</Text>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                {message.emoji_avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Text className="font-medium text-sm">{message.username}</Text>
                  <Text className="text-xs text-gray-500">
                    {formatTime(message.created_at)}
                  </Text>
                </div>
                <Text className="text-sm text-gray-800">{message.content}</Text>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>

      {/* Promote to Room Modal */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Promote Chat to Focus Room</h3>
            <p className="text-gray-600 mb-6">
              Transform this active chat into a structured Focus Room for deeper collaboration.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsPromoteModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <a href="/rooms/generate" className="flex-1">
                <Button className="w-full">
                  Create Room
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
