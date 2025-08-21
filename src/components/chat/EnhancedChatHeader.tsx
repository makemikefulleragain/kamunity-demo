'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Users, MessageCircle, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Layout'

interface ChatStats {
  activeUsers: number
  messageCount: number
  engagementLevel: 'low' | 'medium' | 'high'
  recentActivity: string
}

interface TopicContext {
  originalTitle: string
  originalContent: string
  sourceType: 'news' | 'discussion'
}

interface EnhancedChatHeaderProps {
  roomName: string
  aiSummary: string
  stats: ChatStats
  onPromote: () => void
  canPromote: boolean
  topicContext?: TopicContext
}

export const EnhancedChatHeader = ({
  roomName,
  aiSummary,
  stats,
  onPromote,
  canPromote,
  topicContext
}: EnhancedChatHeaderProps) => {
  const [showContext, setShowContext] = useState(false)

  // Generate AI summary if not provided
  const displaySummary = aiSummary || `This room is discussing ${roomName.toLowerCase()} with active engagement from the community.`

  // Calculate engagement level
  const getEngagementLevel = () => {
    if (stats.messageCount > 50) return { level: 'high', icon: '🔥', text: 'Very Active' }
    if (stats.messageCount > 20) return { level: 'medium', icon: '⚡', text: 'Active' }
    if (stats.messageCount > 5) return { level: 'low', icon: '💬', text: 'Growing' }
    return { level: 'new', icon: '🌱', text: 'New' }
  }

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="p-4 pb-3">
        {/* Room Title */}
        <Flex justify="between" align="center" className="mb-3">
          <Flex align="center" gap="sm">
            <Text className="text-lg font-bold text-gray-900">
              💬 {roomName}
            </Text>
            <Text variant="caption" className="text-gray-500">
              Chat Room
            </Text>
          </Flex>
          
          {canPromote && (
            <Button
              variant="primary"
              size="sm"
              onClick={onPromote}
              className="bg-green-600 hover:bg-green-700"
            >
              🚀 Promote to Focus Room
            </Button>
          )}
        </Flex>

        {/* AI Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <Flex align="center" gap="sm" className="mb-1">
            <span className="text-blue-600">🤖</span>
            <Text variant="caption" className="text-blue-700 font-medium">
              AI Summary
            </Text>
          </Flex>
          <Text className="text-sm text-gray-600">
            {displaySummary}
          </Text>
        </div>

        {/* Live Stats */}
        <Flex gap="sm" className="mb-3">
          <Flex align="center" gap="sm" className="bg-blue-50 px-2 py-1 rounded">
            <Users size={16} className="text-blue-600" />
            <Text variant="caption" className="text-blue-800">
              {stats.activeUsers} active
            </Text>
          </Flex>
          <Flex align="center" gap="sm" className="bg-green-50 px-2 py-1 rounded">
            <MessageCircle size={16} className="text-green-600" />
            <Text variant="caption" className="text-green-800">
              {stats.messageCount} messages
            </Text>
          </Flex>
          <Flex align="center" gap="sm" className="bg-purple-50 px-2 py-1 rounded">
            <TrendingUp size={16} className="text-purple-600" />
            <Text variant="caption" className="text-purple-800">
              {getEngagementLevel().text}
            </Text>
          </Flex>
          <Flex align="center" gap="sm" className="bg-gray-50 px-2 py-1 rounded">
            <Clock size={16} className="text-gray-600" />
            <Text variant="caption" className="text-gray-800">
              {stats.recentActivity}
            </Text>
          </Flex>
        </Flex>

        {/* Context Toggle */}
        {topicContext && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowContext(!showContext)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showContext ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Hide Context
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Show Context
              </>
            )}
          </Button>
        )}
      </div>

      {/* Expandable Context Panel */}
      {showContext && topicContext && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <div className="py-3">
            <Flex align="center" gap="sm" className="mb-2">
              <span className="text-orange-600">📰</span>
              <Text className="font-semibold text-gray-900">
                Original Topic: {topicContext.originalTitle}
              </Text>
            </Flex>
            <Text variant="caption" className="text-gray-700 leading-relaxed mb-3">
              {topicContext.originalContent}
            </Text>
            <Text className="text-orange-600 text-sm">
              Source: {topicContext.sourceType === 'news' ? 'News Article' : 'Discussion'}
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}
