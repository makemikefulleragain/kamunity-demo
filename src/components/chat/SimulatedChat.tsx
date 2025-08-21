'use client'

import React, { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Send, Bot, User } from 'lucide-react'
import { ChatMessage } from '@/data/goldenThreads'

interface SimulatedChatProps {
  messages: ChatMessage[]
  chatId: string
  showInput?: boolean
  kaiSuggestionInterval?: number // Messages between Kai suggestions
}

export default function SimulatedChat({ 
  messages, 
  chatId, 
  showInput = true,
  kaiSuggestionInterval = 5 
}: SimulatedChatProps) {
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userMessage, setUserMessage] = useState('')
  const [messageCount, setMessageCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulate messages appearing over time
  useEffect(() => {
    if (currentIndex < messages.length) {
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => [...prev, messages[currentIndex]])
        setCurrentIndex(prev => prev + 1)
      }, 1500) // New message every 1.5 seconds

      return () => clearTimeout(timer)
    }
  }, [currentIndex, messages])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedMessages])

  // Kai periodic suggestions
  useEffect(() => {
    if (messageCount > 0 && messageCount % kaiSuggestionInterval === 0) {
      const kaiSuggestions = [
        "Great discussion! 🌟 Have you considered creating a Focus Room to organize these ideas?",
        "I notice strong engagement here! 📊 Would you like me to help track the impact of this initiative?",
        "Excellent collaboration! 🤝 I can help you create an action plan with clear milestones.",
        "This momentum is perfect for next steps! 🚀 Shall we identify key stakeholders to involve?",
        "Wonderful energy! 💡 I can suggest resources from similar successful projects."
      ]

      const kaiMessage: ChatMessage = {
        id: `kai-${Date.now()}`,
        author: 'Kai',
        content: kaiSuggestions[Math.floor(Math.random() * kaiSuggestions.length)],
        timestamp: new Date(),
        isKai: true
      }

      setTimeout(() => {
        setDisplayedMessages(prev => [...prev, kaiMessage])
      }, 2000)
    }
  }, [messageCount, kaiSuggestionInterval])

  const handleSendMessage = () => {
    if (!userMessage.trim()) return

    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      author: 'You',
      content: userMessage,
      timestamp: new Date()
    }

    setDisplayedMessages(prev => [...prev, newMessage])
    setUserMessage('')
    setMessageCount(prev => prev + 1)
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isKai ? 'bg-blue-50 -mx-4 px-4 py-3' : ''}`}
          >
            <div className="flex-shrink-0">
              {message.isKai ? (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm">
                  {message.author}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-800 mt-1">{message.content}</p>
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {message.reactions.map((reaction, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-gray-600">{reaction.count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {showInput && (
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
