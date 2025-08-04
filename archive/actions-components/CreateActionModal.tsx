'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ACTION_TYPES, IMPACT_LEVELS, STATUS_WORKFLOWS } from '@/types/actions'

interface CreateActionModalProps {
  isOpen: boolean
  onClose: () => void
  context?: {
    sourceType: 'chat' | 'focus_room' | 'club' | 'community'
    sourceId: string
    sourceMessageId?: string
  }
  onActionCreated?: (action: any) => void
}

export default function CreateActionModal({
  isOpen,
  onClose,
  context,
  onActionCreated
}: CreateActionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    actionType: 'task',
    impactLevel: 'local',
    priority: 'medium',
    dueDate: '',
    estimatedEffort: '',
    tags: '',
    isPublic: context?.sourceType === 'community' || context?.sourceType === 'club'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get default status for the context
      const workflow = context?.sourceType ? STATUS_WORKFLOWS[context.sourceType] : STATUS_WORKFLOWS.chat
      const defaultStatus = workflow?.defaultStatus || 'proposed'

      const actionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        actionType: formData.actionType,
        impactLevel: formData.impactLevel,
        sourceType: context?.sourceType || 'chat',
        status: defaultStatus,
        priority: formData.priority,
        createdBy: 'current-user-id', // TODO: Get from auth context
        assignedTo: [],
        volunteers: [],
        ownershipType: 'self_assigned',
        isPublic: formData.isPublic,
        sourceId: context?.sourceId,
        sourceMessageId: context?.sourceMessageId,
        detectionMethod: 'manual',
        isConfirmed: true,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        estimatedEffort: formData.estimatedEffort.trim() || undefined,
        requiredSkills: [],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      }

      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionData)
      })

      const data = await response.json()

      if (data.success) {
        if (onActionCreated) {
          onActionCreated(data.data)
        }
        onClose()
        // Reset form
        setFormData({
          title: '',
          description: '',
          actionType: 'task',
          impactLevel: 'local',
          priority: 'medium',
          dueDate: '',
          estimatedEffort: '',
          tags: '',
          isPublic: context?.sourceType === 'community' || context?.sourceType === 'club'
        })
      } else {
        setError(data.error || 'Failed to create action')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating action:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Action</h2>
            {context && (
              <p className="text-sm text-gray-600 mt-1">
                For {context.sourceType.replace('_', ' ')}: {context.sourceId}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kamunity-gold focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide more details about this action..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kamunity-gold focus:border-transparent"
              required
            />
          </div>

          {/* Type and Impact Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type
              </label>
              <select
                value={formData.actionType}
                onChange={(e) => handleInputChange('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kamunity-gold focus:border-transparent"
              >
                {Object.entries(ACTION_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impact Level
              </label>
              <select
                value={formData.impactLevel}
                onChange={(e) => handleInputChange('impactLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kamunity-gold focus:border-transparent"
              >
                {Object.entries(IMPACT_LEVELS).map(([key, level]) => (
                  <option key={key} value={key}>
                    {level.icon} {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kamunity-gold focus:border-transparent"
              >
                <option value="low">🔵 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kamunity-gold focus:border-transparent"
              />
            </div>
          </div>

          {/* Estimated Effort and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Effort (Optional)
              </label>
              <input
                type="text"
                value={formData.estimatedEffort}
                onChange={(e) => handleInputChange('estimatedEffort', e.target.value)}
                placeholder="e.g., 2 hours, 1 week, ongoing"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kamunity-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kamunity-gold focus:border-transparent"
              />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                className="h-4 w-4 text-kamunity-gold focus:ring-kamunity-gold border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Make this action public</span>
                <p className="text-xs text-gray-500">
                  Public actions are visible to all members and can be discovered in the Actions hub
                </p>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Action'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
