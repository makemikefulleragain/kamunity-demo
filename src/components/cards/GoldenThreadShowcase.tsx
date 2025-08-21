'use client'

import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import RichDataCard from './RichDataCard'
import { goldenThreads } from '@/data/goldenThreads'
import { useRouter } from 'next/navigation'

interface GoldenThreadShowcaseProps {
  threadId?: string
  compact?: boolean
}

export default function GoldenThreadShowcase({ threadId, compact = false }: GoldenThreadShowcaseProps) {
  const router = useRouter()
  
  // Get specific thread or first one
  const thread = threadId 
    ? goldenThreads.find(t => t.id === threadId) 
    : goldenThreads[0]
    
  if (!thread) return null

  const newsCard = {
    id: thread.news.id,
    title: thread.news.title,
    description: thread.news.summary,
    metrics: [
      { label: 'Engagement', value: thread.news.engagement, trend: 'up' as const },
      { label: 'Comments', value: thread.news.comments }
    ],
    tags: [thread.category],
    timestamp: thread.news.publishedAt,
    relatedItems: [
      { type: 'chat', label: 'Join Discussion', href: `/chat/${thread.chat.id}` },
      { type: 'room', label: 'Focus Room', href: `/rooms/${thread.room.id}` }
    ]
  }

  const chatCard = {
    id: thread.chat.id,
    title: thread.chat.title,
    description: `Active discussion with ${thread.chat.participants} participants`,
    metrics: [
      { label: 'Participants', value: thread.chat.participants },
      { label: 'Messages', value: thread.chat.messages.length }
    ],
    timestamp: thread.chat.createdAt,
    relatedItems: [
      { type: 'news', label: 'Original Article', href: `/news/${thread.news.id}` },
      { type: 'room', label: 'Join Room', href: `/rooms/${thread.room.id}` }
    ]
  }

  const roomCard = {
    id: thread.room.id,
    title: thread.room.name,
    description: thread.room.description,
    metrics: [
      { label: 'Members', value: thread.room.members },
      { label: 'Impact', value: thread.room.impactScore, trend: 'up' as const }
    ],
    tags: thread.room.objectives.slice(0, 2),
    timestamp: thread.room.createdAt,
    relatedItems: thread.club ? [
      { type: 'chat', label: 'Discussion', href: `/chat/${thread.chat.id}` },
      { type: 'club', label: thread.club.name, href: `/clubs/${thread.club.id}` }
    ] : [
      { type: 'chat', label: 'Discussion', href: `/chat/${thread.chat.id}` }
    ]
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Golden Thread</h3>
          <span className="text-sm text-gray-600">- {thread.title}</span>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => router.push(`/news/${thread.news.id}`)}
            className="flex-shrink-0 px-4 py-2 bg-white rounded-lg border hover:shadow-md transition-all"
          >
            <div className="text-xs text-gray-600 mb-1">📰 News</div>
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {thread.news.title}
            </div>
          </button>
          
          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          
          <button
            onClick={() => router.push(`/chat/${thread.chat.id}`)}
            className="flex-shrink-0 px-4 py-2 bg-white rounded-lg border hover:shadow-md transition-all"
          >
            <div className="text-xs text-gray-600 mb-1">💬 Chat</div>
            <div className="text-sm font-medium text-gray-900">
              {thread.chat.participants} participants
            </div>
          </button>
          
          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          
          <button
            onClick={() => router.push(`/rooms/${thread.room.id}`)}
            className="flex-shrink-0 px-4 py-2 bg-white rounded-lg border hover:shadow-md transition-all"
          >
            <div className="text-xs text-gray-600 mb-1">🎯 Room</div>
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {thread.room.name}
            </div>
          </button>
          
          {thread.club && (
            <>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <button
                onClick={() => router.push(`/clubs/${thread.club.id}`)}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-lg border hover:shadow-md transition-all"
              >
                <div className="text-xs text-gray-600 mb-1">🏛️ Club</div>
                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                  {thread.club.name}
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Golden Thread Journey</h2>
            <p className="text-sm text-gray-600">{thread.title}</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-700 mb-4">
          Follow the complete progression from news discovery to community action
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <RichDataCard
            type="news"
            data={newsCard}
            onClick={() => router.push(`/news/${thread.news.id}`)}
          />
          
          <RichDataCard
            type="chat"
            data={chatCard}
            onClick={() => router.push(`/chat/${thread.chat.id}`)}
          />
          
          <RichDataCard
            type="room"
            data={roomCard}
            onClick={() => router.push(`/rooms/${thread.room.id}`)}
          />
        </div>
        
        {thread.club && (
          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🏛️</span>
                  <span className="text-sm font-medium text-gray-600">Evolved into Club</span>
                </div>
                <h3 className="font-semibold text-gray-900">{thread.club.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{thread.club.description}</p>
              </div>
              <button
                onClick={() => router.push(`/clubs/${thread.club!.id}`)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Visit Club
              </button>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              <span>🏠 {thread.club.memberRooms.length} rooms</span>
              <span>👥 {thread.club.totalMembers} members</span>
              <span>⚡ {thread.club.impactScore} impact</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
