'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Bot, Sparkles, TrendingUp, Lightbulb, MessageSquare } from 'lucide-react'

export interface KaiPersonality {
  name: string
  avatar: React.ReactNode
  greeting: string
  style: 'modern' | 'archaic' | 'professional' | 'casual'
  insights: {
    summary: string
    actions: string[]
    opportunities: string[]
  }
}

export interface KaiAssistantProps {
  personality: KaiPersonality
  roomContext: {
    type: string
    activity: number
    members: number
    recentActions: string[]
  }
  theme?: 'default' | 'lore'
  className?: string
}

// Personality presets
export const kaiPersonalities = {
  lorekeeper: {
    name: 'Lorekeeper',
    avatar: <Bot className="w-6 h-6 text-amber-300" />,
    greeting: 'I stand ready to weave thy victories into gold and ink.',
    style: 'archaic' as const,
    insights: {
      summary: 'Thy campaign flourishes with noble deeds and strategic victories.',
      actions: [
        'Chronicle the Battle of Blackfen Ford',
        'Update the Roll of Honours',
        'Prepare the next war council'
      ],
      opportunities: [
        'The eastern territories await thy attention',
        'New recruits seek guidance in the arts of war'
      ]
    }
  },
  
  kai: {
    name: 'Kai',
    avatar: <Bot className="w-6 h-6 text-blue-500" />,
    greeting: 'Hi! I\'m here to help your community thrive. What can we accomplish together?',
    style: 'modern' as const,
    insights: {
      summary: 'Your room has seen great engagement this week with focused collaboration.',
      actions: [
        'Review 3 pending resource uploads',
        'Connect with new member Sarah Chen',
        'Schedule next community meeting'
      ],
      opportunities: [
        'Similar rooms are organizing a city-wide initiative',
        'Grant opportunity deadline approaching next month'
      ]
    }
  },

  mentor: {
    name: 'Mentor AI',
    avatar: <Bot className="w-6 h-6 text-purple-500" />,
    greeting: 'Ready to guide your learning journey and celebrate your progress.',
    style: 'professional' as const,
    insights: {
      summary: 'Strong learning momentum with consistent skill development.',
      actions: [
        'Complete Module 3 exercises',
        'Schedule peer coding session',
        'Submit project for review'
      ],
      opportunities: [
        'Advanced workshop available next week',
        'Mentorship program applications open'
      ]
    }
  }
}

export function KaiAssistant({ 
  personality, 
  roomContext, 
  theme = 'default',
  className 
}: KaiAssistantProps) {
  const [currentInsight, setCurrentInsight] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const isLoreTheme = theme === 'lore'

  // Rotate insights every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentInsight(prev => (prev + 1) % 3)
        setIsAnimating(false)
      }, 150)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const formatText = (text: string) => {
    if (personality.style === 'archaic') {
      return text.replace(/you/gi, 'thou').replace(/your/gi, 'thy')
    }
    return text
  }

  const insights = [
    {
      type: 'summary',
      icon: <TrendingUp className="w-4 h-4" />,
      title: 'Weekly Summary',
      content: personality.insights.summary,
      color: isLoreTheme ? 'bg-amber-900/30 border-amber-700/40' : 'bg-blue-50 border-blue-200'
    },
    {
      type: 'actions',
      icon: <MessageSquare className="w-4 h-4" />,
      title: 'Suggested Actions',
      content: personality.insights.actions,
      color: isLoreTheme ? 'bg-emerald-900/30 border-emerald-700/40' : 'bg-green-50 border-green-200'
    },
    {
      type: 'opportunities',
      icon: <Lightbulb className="w-4 h-4" />,
      title: 'Opportunity Alert',
      content: personality.insights.opportunities,
      color: isLoreTheme ? 'bg-indigo-900/30 border-indigo-700/40' : 'bg-purple-50 border-purple-200'
    }
  ]

  return (
    <Card
      variant={isLoreTheme ? 'ghost' : 'default'}
      padding="none"
      className={cn(
        'transition-all duration-200',
        isLoreTheme && 'border-amber-900/40 bg-[#13110f]',
        className
      )}
    >
      {/* Header */}
      <CardHeader className={cn(
        'border-b',
        isLoreTheme ? 'border-amber-900/40 p-4' : 'border-gray-200 p-4'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            isLoreTheme 
              ? 'bg-gradient-to-br from-amber-600 to-amber-800' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600'
          )}>
            {personality.avatar}
          </div>
          <div>
            <CardTitle className={cn(
              'text-lg',
              isLoreTheme ? 'text-amber-200' : 'text-gray-900'
            )}>
              {personality.name}
            </CardTitle>
            <p className={cn(
              'text-sm',
              isLoreTheme ? 'text-amber-300/80' : 'text-gray-600'
            )}>
              {personality.style === 'archaic' ? 'Keeper of Chronicles' : 'AI Assistant'}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className={isLoreTheme ? 'p-4' : 'p-6'}>
        {/* Greeting */}
        <div className={cn(
          'p-3 rounded-lg mb-4 border',
          isLoreTheme 
            ? 'bg-amber-900/20 border-amber-800/40 text-amber-100' 
            : 'bg-gray-50 border-gray-200 text-gray-700'
        )}>
          <p className="text-sm italic">
            "{formatText(personality.greeting)}"
          </p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={cn(
            'p-3 rounded-lg text-center border',
            isLoreTheme 
              ? 'bg-amber-900/10 border-amber-800/30' 
              : 'bg-blue-50 border-blue-200'
          )}>
            <div className={cn(
              'text-lg font-bold',
              isLoreTheme ? 'text-amber-200' : 'text-blue-600'
            )}>
              {roomContext.members}
            </div>
            <div className={cn(
              'text-xs',
              isLoreTheme ? 'text-amber-300/80' : 'text-blue-600/80'
            )}>
              {personality.style === 'archaic' ? 'Champions' : 'Members'}
            </div>
          </div>
          <div className={cn(
            'p-3 rounded-lg text-center border',
            isLoreTheme 
              ? 'bg-emerald-900/10 border-emerald-800/30' 
              : 'bg-green-50 border-green-200'
          )}>
            <div className={cn(
              'text-lg font-bold',
              isLoreTheme ? 'text-emerald-200' : 'text-green-600'
            )}>
              {roomContext.activity}%
            </div>
            <div className={cn(
              'text-xs',
              isLoreTheme ? 'text-emerald-300/80' : 'text-green-600/80'
            )}>
              {personality.style === 'archaic' ? 'Vigor' : 'Activity'}
            </div>
          </div>
        </div>

        {/* Rotating Insights */}
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={insight.type}
              className={cn(
                'p-3 rounded-lg border transition-all duration-300',
                insight.color,
                currentInsight === index ? 'opacity-100 scale-100' : 'opacity-60 scale-95',
                isAnimating && currentInsight === index && 'animate-pulse'
              )}
            >
              <div className="flex items-start gap-2">
                <div className={cn(
                  'mt-0.5',
                  isLoreTheme ? 'text-amber-300' : 'text-blue-600'
                )}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'font-medium text-sm mb-1',
                    isLoreTheme ? 'text-amber-200' : 'text-gray-900'
                  )}>
                    {insight.title}
                  </p>
                  {Array.isArray(insight.content) ? (
                    <ul className={cn(
                      'text-sm space-y-1',
                      isLoreTheme ? 'text-amber-100/90' : 'text-gray-700'
                    )}>
                      {insight.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-xs mt-1">•</span>
                          <span>{formatText(item)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={cn(
                      'text-sm',
                      isLoreTheme ? 'text-amber-100/90' : 'text-gray-700'
                    )}>
                      {formatText(insight.content)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'w-full',
              isLoreTheme && 'border-amber-700 text-amber-200 hover:bg-amber-900/30'
            )}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {personality.style === 'archaic' ? 'Seek Counsel' : 'Get Suggestions'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
