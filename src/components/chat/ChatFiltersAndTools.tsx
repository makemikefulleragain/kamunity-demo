'use client'

import { useState } from 'react'
import { Flame, HelpCircle, Lightbulb, BarChart3, Image, Camera, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Layout'

interface ChatFiltersAndToolsProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  onCreatePoll: () => void
  onUploadImage: () => void
  messageStats: {
    hotTopics: number
    questions: number
    ideas: number
    polls: number
  }
}

export const ChatFiltersAndTools = ({
  activeFilter,
  onFilterChange,
  onCreatePoll,
  onUploadImage,
  messageStats
}: ChatFiltersAndToolsProps) => {
  const filters = [
    {
      id: 'all',
      label: 'All Messages',
      icon: null,
      count: null,
      description: 'View all conversation'
    },
    {
      id: 'hot',
      label: 'Hot Topics',
      icon: <Flame size={16} className="text-orange-500" />,
      count: messageStats.hotTopics,
      description: 'Most discussed subjects'
    },
    {
      id: 'questions',
      label: 'Questions',
      icon: <HelpCircle size={16} className="text-blue-500" />,
      count: messageStats.questions,
      description: 'Unanswered questions needing input'
    },
    {
      id: 'ideas',
      label: 'Ideas',
      icon: <Lightbulb size={16} className="text-yellow-500" />,
      count: messageStats.ideas,
      description: 'Actionable suggestions and proposals'
    },
    {
      id: 'polls',
      label: 'Polls',
      icon: <BarChart3 size={16} className="text-green-500" />,
      count: messageStats.polls,
      description: 'Active voting and decisions'
    }
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Filter Bar */}
      <div className="px-4 py-3">
        <Flex gap="xs" className="flex-wrap">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "primary" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className={`
                relative transition-all duration-200
                ${activeFilter === filter.id 
                  ? "bg-blue-100 text-blue-700 border-blue-300" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
              title={filter.description}
            >
              <Flex align="center" gap="xs">
                {filter.icon}
                <Text variant="caption" className="font-medium">
                  {filter.label}
                </Text>
                {filter.count !== null && filter.count > 0 && (
                  <span className={`
                    inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                    ${activeFilter === filter.id
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                    }
                  `}>
                    {filter.count}
                  </span>
                )}
              </Flex>
            </Button>
          ))}
        </Flex>
      </div>

      {/* Engagement Tools */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <Flex justify="between" align="center">
          <Text variant="caption" className="text-gray-600 font-medium">
            Engagement Tools
          </Text>
          
          <Flex gap="xs">
            {/* Quick Poll */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreatePoll}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Create a quick poll"
            >
              <Flex align="center" gap="xs">
                <BarChart3 size={16} />
                <Text variant="caption">Poll</Text>
              </Flex>
            </Button>

            {/* Image Upload */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onUploadImage}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Share an image"
            >
              <Flex align="center" gap="xs">
                <Image size={16} />
                <Text variant="caption">Image</Text>
              </Flex>
            </Button>

            {/* Camera */}
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              title="Take a photo"
            >
              <Flex align="center" gap="xs">
                <Camera size={16} />
                <Text variant="caption">Photo</Text>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </div>

      {/* Active Filter Info */}
      {activeFilter !== 'all' && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
          <Flex align="center" gap="sm">
            {filters.find(f => f.id === activeFilter)?.icon}
            <Text variant="caption" className="text-blue-700">
              Showing: {filters.find(f => f.id === activeFilter)?.description}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange('all')}
              className="text-blue-600 hover:text-blue-800 p-0 h-auto ml-auto"
            >
              <Text variant="caption">Clear filter</Text>
            </Button>
          </Flex>
        </div>
      )}
    </div>
  )
}
