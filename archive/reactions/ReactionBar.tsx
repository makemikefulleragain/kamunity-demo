'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Layout'
import { cn } from '@/lib/utils'
import { REACTION_TYPES, ReactionType } from '@/types/content'

interface ReactionData {
  id: string
  reactionType: string
  userId: string
  user: { name: string }
}

interface ReactionBarProps {
  contentType: string
  contentId: string
  reactions: ReactionData[]
  onReact: (reactionType: ReactionType) => void
  onRemoveReaction?: (reactionType: ReactionType) => void
  currentUserId?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showCounts?: boolean
}

export const ReactionBar = ({
  contentType,
  contentId,
  reactions = [],
  onReact,
  onRemoveReaction,
  currentUserId = 'current-user', // Mock current user ID
  className,
  size = 'md',
  showCounts = true
}: ReactionBarProps) => {
  const [showAllReactions, setShowAllReactions] = useState(false)

  // Group reactions by type and count them
  const reactionCounts = reactions.reduce((acc, reaction) => {
    const type = reaction.reactionType as ReactionType
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        users: [],
        hasCurrentUser: false
      }
    }
    acc[type].count++
    acc[type].users.push(reaction.user.name)
    if (reaction.userId === currentUserId) {
      acc[type].hasCurrentUser = true
    }
    return acc
  }, {} as Record<ReactionType, { count: number; users: string[]; hasCurrentUser: boolean }>)

  const handleReactionClick = (reactionType: ReactionType) => {
    const hasReacted = reactionCounts[reactionType]?.hasCurrentUser
    
    if (hasReacted && onRemoveReaction) {
      onRemoveReaction(reactionType)
    } else {
      onReact(reactionType)
    }
  }

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'sm'
      case 'lg': return 'lg'
      default: return 'sm'
    }
  }

  const getEmojiSize = () => {
    switch (size) {
      case 'sm': return 'text-sm'
      case 'lg': return 'text-lg'
      default: return 'text-base'
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-xs'
      case 'lg': return 'text-sm'
      default: return 'text-xs'
    }
  }

  // Show popular reactions first, then show all if requested
  const displayedReactionTypes = showAllReactions 
    ? Object.keys(REACTION_TYPES) as ReactionType[]
    : Object.keys(REACTION_TYPES).filter(type => 
        reactionCounts[type as ReactionType]?.count > 0
      ) as ReactionType[]

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Existing Reactions with Counts */}
      {displayedReactionTypes.map(reactionType => {
        const reactionData = REACTION_TYPES[reactionType]
        const count = reactionCounts[reactionType]?.count || 0
        const hasCurrentUser = reactionCounts[reactionType]?.hasCurrentUser || false
        const users = reactionCounts[reactionType]?.users || []

        // Only show reactions that have been used, unless showing all
        if (!showAllReactions && count === 0) return null

        return (
          <Button
            key={reactionType}
            variant={hasCurrentUser ? 'primary' : 'ghost'}
            size={getButtonSize()}
            onClick={() => handleReactionClick(reactionType)}
            className={cn(
              'transition-all duration-200 hover:scale-105',
              hasCurrentUser && 'bg-primary-100 border-primary-300 text-primary-700',
              count === 0 && showAllReactions && 'opacity-60 hover:opacity-100'
            )}
            title={`${reactionData.description}${users.length > 0 ? `\n\nReacted by: ${users.join(', ')}` : ''}`}
          >
            <Flex align="center" gap="xs">
              <span className={getEmojiSize()}>
                {reactionData.emoji}
              </span>
              {showCounts && count > 0 && (
                <Text 
                  size={getTextSize() as any} 
                  weight="medium"
                  className={hasCurrentUser ? 'text-primary-700' : 'text-neutral-600'}
                >
                  {count}
                </Text>
              )}
            </Flex>
          </Button>
        )
      })}

      {/* Add Reaction Button */}
      {!showAllReactions && (
        <Button
          variant="ghost"
          size={getButtonSize()}
          onClick={() => setShowAllReactions(true)}
          className="opacity-60 hover:opacity-100 transition-opacity"
          title="Add reaction"
        >
          <span className={cn(getEmojiSize(), 'text-neutral-500')}>
            😊+
          </span>
        </Button>
      )}

      {/* Close All Reactions */}
      {showAllReactions && (
        <Button
          variant="ghost"
          size={getButtonSize()}
          onClick={() => setShowAllReactions(false)}
          className="opacity-60 hover:opacity-100 transition-opacity"
          title="Hide unused reactions"
        >
          <span className={cn(getEmojiSize(), 'text-neutral-500')}>
            ✕
          </span>
        </Button>
      )}
    </div>
  )
}

// Reaction Summary Component for content creators
interface ReactionSummaryProps {
  reactions: ReactionData[]
  className?: string
}

export const ReactionSummary = ({ reactions, className }: ReactionSummaryProps) => {
  const reactionCounts = reactions.reduce((acc, reaction) => {
    const type = reaction.reactionType as ReactionType
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<ReactionType, number>)

  const totalReactions = reactions.length
  const topReaction = Object.entries(reactionCounts)
    .sort(([,a], [,b]) => b - a)[0]

  if (totalReactions === 0) {
    return (
      <div className={cn('text-center py-4', className)}>
        <Text size="sm" color="muted">
          No reactions yet
        </Text>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <Flex justify="between" align="center">
        <Text weight="medium">
          {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
        </Text>
        {topReaction && (
          <Flex align="center" gap="xs">
            <span>{REACTION_TYPES[topReaction[0] as ReactionType].emoji}</span>
            <Text size="sm" color="muted">
              Most {REACTION_TYPES[topReaction[0] as ReactionType].label.toLowerCase()}
            </Text>
          </Flex>
        )}
      </Flex>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(reactionCounts).map(([type, count]) => {
          const reactionData = REACTION_TYPES[type as ReactionType]
          const percentage = (count / totalReactions) * 100

          return (
            <div key={type} className="text-center p-2 bg-neutral-50 rounded-lg">
              <div className="text-lg mb-1">{reactionData.emoji}</div>
              <Text size="xs" weight="medium" className="text-neutral-900">
                {count}
              </Text>
              <Text size="xs" color="muted">
                {percentage.toFixed(0)}%
              </Text>
            </div>
          )
        })}
      </div>
    </div>
  )
}
