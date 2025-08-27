'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface SimulationData {
  messages: Array<{
    id: string
    author: string
    content: string
    timestamp: Date
    avatar?: string
  }>
  activity: Array<{
    id: string
    user: string
    action: string
    detail?: string
    timestamp: Date
  }>
  stats: {
    activeMembers: number
    totalMessages: number
    impactScore: number
    engagement: number
  }
}

export interface SimulationConfig {
  updateInterval: number
  messageFrequency: number
  activityFrequency: number
  statsVariation: number
  theme: 'default' | 'lore'
}

interface SimulationEngineProps {
  config: SimulationConfig
  initialData: SimulationData
  isPlaying: boolean
  onDataUpdate: (data: SimulationData) => void
  roomType?: string
}

// Realistic message templates by room type
const messageTemplates = {
  garden: [
    "Just finished setting up the new compost bins! 🌱",
    "The tomatoes are looking amazing this week",
    "Can someone help with watering this weekend?",
    "Found some great organic fertilizer on sale",
    "The community harvest is next Saturday!",
    "New volunteer orientation went really well",
    "Soil pH tests came back - looking good!",
    "Kids love the butterfly garden section"
  ],
  
  tech: [
    "Deployed the new feature to production 🚀",
    "Code review session scheduled for tomorrow",
    "Great presentation on React hooks today",
    "Found a bug in the authentication flow",
    "New intern is picking things up quickly",
    "Documentation update is live",
    "Performance improvements are working well",
    "Team standup moved to 10am tomorrow"
  ],
  
  lore: [
    "The Battle of Thornwick Ridge has been chronicled",
    "New recruits report to the training grounds",
    "Supply lines to the eastern front secured",
    "The war council convenes at sunset",
    "Victory at Goldmeadow brings great honour",
    "Scouts report movement in the northern passes",
    "The siege engines require maintenance",
    "Tales of valor spread throughout the realm"
  ],
  
  default: [
    "Great progress on our project this week!",
    "Meeting notes have been shared with everyone",
    "New member introduction went really well",
    "Resource sharing is working effectively",
    "Community feedback has been very positive",
    "Next milestone is coming up soon",
    "Collaboration tools are helping a lot",
    "Looking forward to our next gathering"
  ]
}

// Activity templates by room type
const activityTemplates = {
  garden: [
    { action: 'Logged harvest data', detail: '+15 lbs tomatoes' },
    { action: 'Shared resource', detail: 'Composting guide' },
    { action: 'Completed task', detail: 'Bed preparation' },
    { action: 'Joined volunteer shift', detail: 'Saturday morning' },
    { action: 'Updated garden map', detail: 'New plot assignments' }
  ],
  
  tech: [
    { action: 'Merged pull request', detail: 'Authentication fix' },
    { action: 'Created new issue', detail: 'Performance optimization' },
    { action: 'Completed code review', detail: '3 files reviewed' },
    { action: 'Updated documentation', detail: 'API endpoints' },
    { action: 'Deployed to staging', detail: 'Version 2.1.3' }
  ],
  
  lore: [
    { action: 'Chronicled battle', detail: 'Victory at Sunhallow' },
    { action: 'Updated war map', detail: 'Territory gained' },
    { action: 'Awarded honour', detail: 'Defender of the Realm' },
    { action: 'Recruited champion', detail: 'Sir Marcus the Bold' },
    { action: 'Completed quest', detail: 'The Lost Banner' }
  ],
  
  default: [
    { action: 'Shared update', detail: 'Weekly progress' },
    { action: 'Completed milestone', detail: 'Phase 1 delivery' },
    { action: 'Joined discussion', detail: 'Strategy planning' },
    { action: 'Added resource', detail: 'Best practices guide' },
    { action: 'Scheduled meeting', detail: 'Next week review' }
  ]
}

// Realistic user names by theme
const userNames = {
  garden: ['Sarah Chen', 'Marcus Johnson', 'Elena Rodriguez', 'David Park', 'Lisa Wang', 'Ahmed Hassan'],
  tech: ['Alex Kumar', 'Jessica Wu', 'Ryan Martinez', 'Priya Patel', 'Jordan Kim', 'Sam Thompson'],
  lore: ['Sir Marcus the Bold', 'Lady Elena of Thornwick', 'Captain Sarah Ironforge', 'Lord David Stormwind', 'Sage Lisa the Wise', 'Commander Ahmed'],
  default: ['Sarah Chen', 'Marcus Johnson', 'Elena Rodriguez', 'David Park', 'Lisa Wang', 'Ahmed Hassan']
}

export function SimulationEngine({ 
  config, 
  initialData, 
  isPlaying, 
  onDataUpdate, 
  roomType = 'default' 
}: SimulationEngineProps) {
  const [data, setData] = useState<SimulationData>(initialData)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  const getRandomItem = useCallback(<T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }, [])

  const generateMessage = useCallback(() => {
    const templates = messageTemplates[roomType as keyof typeof messageTemplates] || messageTemplates.default
    const names = userNames[roomType as keyof typeof userNames] || userNames.default
    
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: getRandomItem(names),
      content: getRandomItem(templates),
      timestamp: new Date(),
      avatar: undefined
    }
  }, [roomType, getRandomItem])

  const generateActivity = useCallback(() => {
    const templates = activityTemplates[roomType as keyof typeof activityTemplates] || activityTemplates.default
    const names = userNames[roomType as keyof typeof userNames] || userNames.default
    const template = getRandomItem(templates)
    
    return {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      user: getRandomItem(names),
      action: template.action,
      detail: template.detail,
      timestamp: new Date()
    }
  }, [roomType, getRandomItem])

  const updateStats = useCallback((currentStats: SimulationData['stats']) => {
    const variation = config.statsVariation
    
    return {
      activeMembers: Math.max(5, Math.min(50, 
        currentStats.activeMembers + Math.floor(Math.random() * variation * 2) - variation
      )),
      totalMessages: currentStats.totalMessages + Math.floor(Math.random() * 3),
      impactScore: currentStats.impactScore + Math.floor(Math.random() * 15),
      engagement: Math.min(100, Math.max(60, 
        currentStats.engagement + Math.floor(Math.random() * variation) - Math.floor(variation / 2)
      ))
    }
  }, [config.statsVariation])

  // Main simulation loop
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdate

      setData(currentData => {
        let newData = { ...currentData }

        // Add new message based on frequency
        if (Math.random() < (config.messageFrequency * timeSinceLastUpdate / 60000)) {
          const newMessage = generateMessage()
          newData.messages = [...currentData.messages.slice(-20), newMessage] // Keep last 20 messages
        }

        // Add new activity based on frequency
        if (Math.random() < (config.activityFrequency * timeSinceLastUpdate / 60000)) {
          const newActivity = generateActivity()
          newData.activity = [...currentData.activity.slice(-10), newActivity] // Keep last 10 activities
        }

        // Update stats periodically
        if (timeSinceLastUpdate > config.updateInterval) {
          newData.stats = updateStats(currentData.stats)
          setLastUpdate(now)
        }

        return newData
      })
    }, config.updateInterval)

    return () => clearInterval(interval)
  }, [isPlaying, config, lastUpdate, generateMessage, generateActivity, updateStats])

  // Notify parent component of data changes
  useEffect(() => {
    onDataUpdate(data)
  }, [data, onDataUpdate])

  return null // This is a headless component
}

// Preset configurations for different room types
export const simulationConfigs = {
  garden: {
    updateInterval: 3000,
    messageFrequency: 0.8, // messages per minute
    activityFrequency: 0.5, // activities per minute
    statsVariation: 2,
    theme: 'default' as const
  },
  
  tech: {
    updateInterval: 2500,
    messageFrequency: 1.2,
    activityFrequency: 0.8,
    statsVariation: 3,
    theme: 'default' as const
  },
  
  lore: {
    updateInterval: 4000,
    messageFrequency: 0.6,
    activityFrequency: 0.4,
    statsVariation: 2,
    theme: 'lore' as const
  },
  
  default: {
    updateInterval: 3000,
    messageFrequency: 1.0,
    activityFrequency: 0.6,
    statsVariation: 2,
    theme: 'default' as const
  }
} as const

// Helper function to create initial simulation data
export function createInitialSimulationData(roomType: string = 'default'): SimulationData {
  const templates = messageTemplates[roomType as keyof typeof messageTemplates] || messageTemplates.default
  const names = userNames[roomType as keyof typeof userNames] || userNames.default
  
  // Generate initial messages
  const messages = Array.from({ length: 5 }, (_, i) => ({
    id: `initial-msg-${i}`,
    author: names[i % names.length],
    content: templates[i % templates.length],
    timestamp: new Date(Date.now() - (5 - i) * 300000) // 5 minutes apart
  }))

  // Generate initial activity
  const activityTemplateSet = activityTemplates[roomType as keyof typeof activityTemplates] || activityTemplates.default
  const activity = Array.from({ length: 3 }, (_, i) => {
    const template = activityTemplateSet[i % activityTemplateSet.length]
    return {
      id: `initial-act-${i}`,
      user: names[i % names.length],
      action: template.action,
      detail: template.detail,
      timestamp: new Date(Date.now() - (3 - i) * 600000) // 10 minutes apart
    }
  })

  return {
    messages,
    activity,
    stats: {
      activeMembers: 12 + Math.floor(Math.random() * 8),
      totalMessages: 156 + Math.floor(Math.random() * 50),
      impactScore: 450 + Math.floor(Math.random() * 200),
      engagement: 75 + Math.floor(Math.random() * 20)
    }
  }
}
