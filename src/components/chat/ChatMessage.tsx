'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Layout'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { ReactionType } from '@/types/content'

interface ChatMessageProps {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatarUrl?: string
  }
  createdAt: Date
  conversationId: string
  reactions?: Array<{
    id: string
    reactionType: string
    userId: string
    user: { name: string }
  }>
  uploads?: Array<{
    id: string
    filename: string
    fileType: string
    storageLocation: string
  }>
  onReact?: (messageId: string, reactionType: ReactionType) => void
  onRemoveReaction?: (messageId: string, reactionType: ReactionType) => void
  onReply?: (messageId: string) => void
  className?: string
  showActions?: boolean
  currentUserId?: string
}

export const ChatMessage = ({
  id,
  content,
  author,
  createdAt,
  conversationId,
  reactions = [],
  uploads = [],
  onReact,
  onRemoveReaction,
  onReply,
  className,
  showActions = true,
  currentUserId = 'current-user'
}: ChatMessageProps) => {
  const [showFullContent, setShowFullContent] = useState(false)
  const isLongMessage = content.length > 300

  const handleReact = (reactionType: ReactionType) => {
    onReact?.(id, reactionType)
  }

  const handleRemoveReaction = (reactionType: ReactionType) => {
    onRemoveReaction?.(id, reactionType)
  }

  const handleReply = () => {
    onReply?.(id)
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return '🖼️'
      case 'document':
        return '📄'
      case 'video':
        return '🎥'
      case 'audio':
        return '🎵'
      default:
        return '📎'
    }
  }

  const formatFileSize = (filename: string) => {
    // Mock file size - in real implementation, this would come from the upload data
    return '2.3 MB'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isCurrentUser = author.id === currentUserId

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-sm', className)}>
      <CardContent className="p-4">
        <Flex align="start" gap="md">
          {/* Avatar */}
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium',
            isCurrentUser 
              ? 'bg-primary-100 text-primary-700'
              : 'bg-neutral-100 text-neutral-700'
          )}>
            {author.avatarUrl ? (
              <img 
                src={author.avatarUrl} 
                alt={author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(author.name)
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <Flex align="center" className="mb-2">
              <Text 
                weight="medium" 
                className={cn(
                  'mr-2',
                  isCurrentUser ? 'text-primary-700' : 'text-neutral-900'
                )}
              >
                {author.name}
              </Text>
              <Text size="sm" color="muted">
                {new Date(createdAt).toLocaleString()}
              </Text>
              {isCurrentUser && (
                <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                  You
                </span>
              )}
            </Flex>

            {/* Message Text */}
            <div className="mb-3">
              <Text className="text-neutral-700 leading-relaxed">
                {isLongMessage && !showFullContent 
                  ? `${content.slice(0, 300)}...`
                  : content
                }
              </Text>
              {isLongMessage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="mt-1 p-0 h-auto text-primary-600 hover:text-primary-700"
                >
                  {showFullContent ? 'Show less' : 'Show more'}
                </Button>
              )}
            </div>

            {/* File Uploads */}
            {uploads.length > 0 && (
              <div className="mb-3 space-y-2">
                {uploads.map(upload => (
                  <div 
                    key={upload.id}
                    className="inline-flex items-center px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg mr-2 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <span className="mr-2">
                      {getFileIcon(upload.fileType)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Text size="sm" className="text-neutral-700 truncate">
                        {upload.filename}
                      </Text>
                      <Text size="xs" color="muted">
                        {formatFileSize(upload.filename)}
                      </Text>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-1 h-auto text-neutral-500 hover:text-neutral-700"
                      title="Download"
                    >
                      ⬇️
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Reactions */}
            <div className="mb-3">
              {/* Reactions temporarily disabled */}
              <div className="text-sm text-gray-500">
                👍 💡 🎯 reactions coming soon!
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <Flex align="center" gap="sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReply}
                  className="text-neutral-500 hover:text-neutral-700 p-1 h-auto"
                >
                  💬 Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500 hover:text-neutral-700 p-1 h-auto"
                  title="Share message"
                >
                  🔗 Share
                </Button>
                {isCurrentUser && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-500 hover:text-neutral-700 p-1 h-auto"
                      title="Edit message"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 p-1 h-auto"
                      title="Delete message"
                    >
                      🗑️ Delete
                    </Button>
                  </>
                )}
              </Flex>
            )}
          </div>
        </Flex>
      </CardContent>
    </Card>
  )
}

// Compact version for lists
export const ChatMessageCompact = ({
  content,
  author,
  createdAt,
  reactions = [],
  className
}: Pick<ChatMessageProps, 'content' | 'author' | 'createdAt' | 'reactions' | 'className'>) => {
  const reactionCount = reactions.length

  return (
    <div className={cn('p-3 hover:bg-neutral-50 transition-colors', className)}>
      <Flex align="start" gap="sm">
        <div className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Text size="xs" className="text-neutral-600">
            {author.name.charAt(0)}
          </Text>
        </div>
        <div className="flex-1 min-w-0">
          <Flex align="center" className="mb-1">
            <Text size="sm" weight="medium" className="text-neutral-900 mr-2">
              {author.name}
            </Text>
            <Text size="xs" color="muted">
              {new Date(createdAt).toLocaleTimeString()}
            </Text>
          </Flex>
          <Text size="sm" className="text-neutral-700 line-clamp-2">
            {content}
          </Text>
          {reactionCount > 0 && (
            <Text size="xs" color="muted" className="mt-1">
              {reactionCount} reaction{reactionCount !== 1 ? 's' : ''}
            </Text>
          )}
        </div>
      </Flex>
    </div>
  )
}
