'use client'

import React from 'react'
import { ArrowRight, Users, TrendingUp, Clock, MessageSquare, Target, Calendar } from 'lucide-react'
import Link from 'next/link'

interface RichDataCardProps {
  type: 'news' | 'chat' | 'room' | 'club'
  data: {
    id: string
    title: string
    description?: string
    metrics?: {
      label: string
      value: string | number
      icon?: React.ElementType
      trend?: 'up' | 'down' | 'neutral'
    }[]
    tags?: string[]
    relatedItems?: {
      type: string
      label: string
      href: string
    }[]
    timestamp?: Date
    author?: {
      name: string
      avatar?: string
    }
    impactScore?: number
    participants?: number
  }
  onClick?: () => void
  className?: string
}

export default function RichDataCard({ type, data, onClick, className = '' }: RichDataCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'news': return 'border-blue-200 hover:border-blue-400'
      case 'chat': return 'border-green-200 hover:border-green-400'
      case 'room': return 'border-purple-200 hover:border-purple-400'
      case 'club': return 'border-orange-200 hover:border-orange-400'
      default: return 'border-gray-200 hover:border-gray-400'
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'news': return '📰'
      case 'chat': return '💬'
      case 'room': return '🎯'
      case 'club': return '🏛️'
      default: return '📄'
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'news': return 'News Article'
      case 'chat': return 'Discussion'
      case 'room': return 'Focus Room'
      case 'club': return 'Club'
      default: return 'Content'
    }
  }

  const formatTimestamp = (date?: Date) => {
    if (!date) return ''
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div 
      className={`bg-white rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${getTypeColor()} ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getTypeIcon()}</span>
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {getTypeLabel()}
            </span>
          </div>
          {data.timestamp && (
            <span className="text-xs text-gray-500">
              {formatTimestamp(data.timestamp)}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {data.title}
        </h3>
        
        {data.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {data.description}
          </p>
        )}
      </div>

      {/* Metrics */}
      {data.metrics && data.metrics.length > 0 && (
        <div className="p-4 bg-gray-50 grid grid-cols-2 gap-3">
          {data.metrics.map((metric, idx) => {
            const Icon = metric.icon
            return (
              <div key={idx} className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {metric.label}
                  </div>
                </div>
                {metric.trend && (
                  <TrendingUp 
                    className={`w-3 h-3 ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 
                      'text-gray-400'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="px-4 py-3 flex flex-wrap gap-1">
          {data.tags.slice(0, 5).map((tag, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
          {data.tags.length > 5 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{data.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Related Items / Golden Thread Navigation */}
      {data.relatedItems && data.relatedItems.length > 0 && (
        <div className="p-4 border-t bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-xs font-medium text-gray-600 mb-2">
            🧵 Golden Thread Progression
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {data.relatedItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                <Link
                  href={item.href}
                  className="flex-shrink-0 px-3 py-1 text-xs bg-white border rounded-full hover:bg-gray-50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Author */}
      {data.author && (
        <div className="px-4 py-3 border-t flex items-center gap-2">
          {data.author.avatar ? (
            <img 
              src={data.author.avatar} 
              alt={data.author.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {data.author.name[0].toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-xs text-gray-600">
            {data.author.name}
          </span>
        </div>
      )}
    </div>
  )
}
