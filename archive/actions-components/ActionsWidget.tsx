'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import { Button } from '@/components/ui/Button'
import { Action, ActionFilters, ACTION_TYPES, IMPACT_LEVELS } from '@/types/actions'

interface ActionsWidgetProps {
  context: {
    sourceType: 'chat' | 'focus_room' | 'club' | 'community'
    sourceId: string
    roomId?: string
    chatId?: string
  }
  maxItems?: number
  showCreateButton?: boolean
  variant?: 'embedded' | 'popup' | 'sidebar'
  title?: string
  onActionClick?: (action: Action) => void
  onCreateAction?: () => void
}

export default function ActionsWidget({
  context,
  maxItems = 5,
  showCreateButton = true,
  variant = 'embedded',
  title,
  onActionClick,
  onCreateAction
}: ActionsWidgetProps) {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActions()
  }, [context.sourceType, context.sourceId])

  const fetchActions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        sourceType: context.sourceType,
        sourceId: context.sourceId,
        includePrivate: 'true', // Include private actions in context
        limit: maxItems.toString()
      })
      
      const response = await fetch(`/api/actions/by-source?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setActions(data.data || [])
      } else {
        setError(data.error || 'Failed to fetch actions')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching actions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (action: Action) => {
    if (onActionClick) {
      onActionClick(action)
    } else {
      // Default behavior: navigate to action detail
      window.location.href = `/actions/${action.id}`
    }
  }

  const handleCreateAction = () => {
    if (onCreateAction) {
      onCreateAction()
    } else {
      // Default behavior: navigate to create action with context
      const params = new URLSearchParams({
        sourceType: context.sourceType,
        sourceId: context.sourceId
      })
      window.location.href = `/actions/create?${params.toString()}`
    }
  }

  const getWidgetTitle = () => {
    if (title) return title
    
    switch (context.sourceType) {
      case 'focus_room':
        return 'Room Actions'
      case 'club':
        return 'Club Actions'
      case 'community':
        return 'Community Actions'
      case 'chat':
        return 'Chat Actions'
      default:
        return 'Actions'
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'popup':
        return 'max-w-md shadow-lg border border-gray-200'
      case 'sidebar':
        return 'h-full'
      case 'embedded':
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <Card className={`p-4 ${getVariantStyles()}`}>
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg">⚡</span>
          <h3 className="font-semibold text-gray-900">{getWidgetTitle()}</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-kamunity-navy"></div>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`p-4 ${getVariantStyles()}`}>
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg">⚡</span>
          <h3 className="font-semibold text-gray-900">{getWidgetTitle()}</h3>
        </div>
        <div className="text-center py-4">
          <div className="text-red-600 text-sm mb-2">Failed to load actions</div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchActions}
          >
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-4 ${getVariantStyles()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">⚡</span>
          <h3 className="font-semibold text-gray-900">{getWidgetTitle()}</h3>
          {actions.length > 0 && (
            <span className="bg-kamunity-navy text-white text-xs px-2 py-1 rounded-full">
              {actions.length}
            </span>
          )}
        </div>
        
        {showCreateButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateAction}
            className="flex items-center space-x-1"
          >
            <span>➕</span>
            <span>Add</span>
          </Button>
        )}
      </div>

      {/* Actions List */}
      {actions.length > 0 ? (
        <div className="space-y-3">
          {actions.map(action => (
            <ActionWidgetItem
              key={action.id}
              action={action}
              onClick={() => handleActionClick(action)}
              variant={variant}
            />
          ))}
          
          {actions.length >= maxItems && (
            <div className="pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = `/actions?sourceType=${context.sourceType}&sourceId=${context.sourceId}`}
                className="w-full text-sm"
              >
                View All Actions ({actions.length}+)
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <span className="text-2xl block mb-2">🎯</span>
          <div className="text-gray-600 text-sm mb-3">
            No actions yet for this {context.sourceType.replace('_', ' ')}
          </div>
          {showCreateButton && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateAction}
              className="flex items-center space-x-2 mx-auto"
            >
              <span>➕</span>
              <span>Create First Action</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}

// Individual Action Item Component
interface ActionWidgetItemProps {
  action: Action
  onClick: () => void
  variant: 'embedded' | 'popup' | 'sidebar'
}

function ActionWidgetItem({ action, onClick, variant }: ActionWidgetItemProps) {
  const actionType = ACTION_TYPES[action.actionType as keyof typeof ACTION_TYPES]
  const impactLevel = IMPACT_LEVELS[action.impactLevel as keyof typeof IMPACT_LEVELS]
  
  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  }

  const isCompact = variant === 'sidebar' || variant === 'popup'

  return (
    <div
      onClick={onClick}
      className="p-3 border border-gray-200 rounded-lg hover:border-kamunity-gold hover:shadow-sm transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{actionType?.icon}</span>
          {!isCompact && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              priorityColors[action.priority as keyof typeof priorityColors]
            }`}>
              {action.priority}
            </span>
          )}
        </div>
        
        {!action.isPublic && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Private
          </span>
        )}
      </div>

      {/* Content */}
      <h4 className={`font-medium text-gray-900 mb-1 ${isCompact ? 'text-sm' : ''} line-clamp-2`}>
        {action.title}
      </h4>
      
      {!isCompact && (
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {action.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <span>{impactLevel?.icon}</span>
          <span>{impactLevel?.label}</span>
        </div>
        
        {action.dueDate && (
          <span>
            Due {new Date(action.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Assignment Info */}
      {(action.assignedTo?.length > 0 || action.volunteers?.length > 0) && (
        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
          {action.assignedTo?.length > 0 && (
            <div className="flex items-center space-x-1">
              <span>👥</span>
              <span>{action.assignedTo.length} assigned</span>
            </div>
          )}
          {action.volunteers?.length > 0 && (
            <div className="flex items-center space-x-1">
              <span>🙋</span>
              <span>{action.volunteers.length} volunteers</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
