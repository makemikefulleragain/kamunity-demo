'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Users, Target, Calendar, MessageSquare, BarChart, Activity, TrendingUp, Clock, Bot } from 'lucide-react'
import Link from 'next/link'
import { goldenThreads } from '@/data/goldenThreads'
import SimulatedChat from '@/components/chat/SimulatedChat'
import { memoryStore } from '@/lib/memoryStore'

// Quick Action Component
function QuickAction({ icon: Icon, label, count, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
    >
      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-100">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {count && (
        <span className="text-xs text-gray-500 mt-1">{count} logged</span>
      )}
    </button>
  )
}

// Action Tool Component
function ActionTool({ icon: Icon, label, description, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function RoomPage() {
  const params = useParams()
  const roomId = params.id as string
  const [activeTab, setActiveTab] = useState<'chat' | 'kai'>('kai')
  const [impactModalOpen, setImpactModalOpen] = useState(false)

  // Find the room from golden threads
  const thread = goldenThreads.find(t => t.room.id === roomId)
  const room = thread?.room
  const chatMessages = thread?.chat.messages || []

  // Track page view
  useEffect(() => {
    const sessionId = memoryStore.getSessionId()
    memoryStore.trackUserAction(sessionId, {
      type: 'room_view',
      target: roomId,
      metadata: { roomName: room?.name }
    })
  }, [roomId, room])

  const handleImpactLog = () => {
    setImpactModalOpen(true)
    const sessionId = memoryStore.getSessionId()
    memoryStore.trackUserAction(sessionId, {
      type: 'impact_log_open',
      target: roomId
    })
  }

  const handleQuickAction = (action: string) => {
    const sessionId = memoryStore.getSessionId()
    memoryStore.trackUserAction(sessionId, {
      type: 'quick_action_click',
      target: action,
      metadata: { roomId }
    })
    // In a real app, these would open modals or navigate
    console.log(`Quick action: ${action}`)
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Room Not Found</h2>
          <p className="text-gray-600 mb-4">This room doesn't exist or has been removed.</p>
          <Link href="/rooms">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Rooms
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Simulated Kai messages for the room
  const kaiMessages = [
    {
      id: 'kai-1',
      author: 'Kai',
      content: `Welcome to ${room.name}! 🎯 I'm here to help you achieve your objectives. Let's start by reviewing your goals and creating an action plan.`,
      timestamp: new Date(Date.now() - 3600000),
      isKai: true
    },
    {
      id: 'kai-2',
      author: 'Kai',
      content: 'Based on similar successful projects, here are three key strategies:\n1. Start with small, achievable milestones\n2. Regular check-ins keep momentum\n3. Celebrate wins to maintain motivation\n\nWhich would you like to focus on first?',
      timestamp: new Date(Date.now() - 1800000),
      isKai: true
    },
    {
      id: 'kai-3',
      author: 'Kai',
      content: `Great progress so far! 📊 Your impact score has increased by 15% this week. Keep logging your activities to track your collective impact.`,
      timestamp: new Date(Date.now() - 900000),
      isKai: true
    }
  ]

  const quickActions = [
    { icon: BarChart, label: 'Log Impact', action: 'impact-log', count: room.quickActions[0].count },
    { icon: Calendar, label: room.quickActions[1].label.replace('Schedule ', ''), action: room.quickActions[1].action },
    { icon: MessageSquare, label: 'Share Resource', action: 'share-resource', count: room.quickActions[2].count },
    { icon: Target, label: room.quickActions[3].label, action: room.quickActions[3].action, count: room.quickActions[3].count },
    { icon: Users, label: room.quickActions[4].label, action: room.quickActions[4].action }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link 
            href="/rooms"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Link>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{room.name}</h1>
              <p className="text-xl text-white/90 mb-6">{room.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{room.members} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{room.impactScore} impact points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Created {new Date(room.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickActions.map((action) => (
              <QuickAction
                key={action.action}
                icon={action.icon}
                label={action.label}
                action={action.action}
                count={action.count}
                onClick={() => action.action === 'impact-log' ? handleImpactLog() : handleQuickAction(action.action)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Objectives */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Objectives</h2>
              <div className="space-y-3">
                {room.objectives.map((objective, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{objective}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Tracking */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Impact Score</h2>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{room.impactScore}</div>
                <p className="text-sm text-gray-600">Total Impact Points</p>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-semibold text-green-600">+125</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Members</span>
                    <span className="font-semibold">{Math.floor(room.members * 0.7)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Chat/AI Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Tab Navigation */}
              <div className="border-b">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('kai')}
                    className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'kai'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span>Kai AI Assistant</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'chat'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Group Chat</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="h-[500px]">
                {activeTab === 'kai' ? (
                  <SimulatedChat
                    messages={kaiMessages}
                    chatId={`kai-${roomId}`}
                    showInput={true}
                    kaiSuggestionInterval={3}
                  />
                ) : (
                  <SimulatedChat
                    messages={chatMessages}
                    chatId={`chat-${roomId}`}
                    showInput={true}
                    kaiSuggestionInterval={5}
                  />
                )}
              </div>
            </div>

            {/* Action Section */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Tools & Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ActionTool
                  icon={BarChart}
                  label="Impact Tracking"
                  description="Log and visualize your collective impact"
                  onClick={handleImpactLog}
                />
                <ActionTool
                  icon={Target}
                  label="Task Management"
                  description="Create and assign tasks to achieve objectives"
                  onClick={() => handleQuickAction('tasks')}
                />
                <ActionTool
                  icon={Calendar}
                  label="Meeting Scheduler"
                  description="Schedule and manage room meetings"
                  onClick={() => handleQuickAction('meetings')}
                />
                <ActionTool
                  icon={MessageSquare}
                  label="Resource Library"
                  description="Share documents, links, and resources"
                  onClick={() => handleQuickAction('resources')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Logging Modal (Placeholder) */}
      {impactModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Log Your Impact</h3>
            <p className="text-gray-600 mb-4">
              Track your contributions to {room.name}. Every action counts!
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="What did you accomplish?"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <select className="w-full px-4 py-2 border rounded-lg">
                <option>Select impact type</option>
                <option>Environmental</option>
                <option>Social</option>
                <option>Educational</option>
                <option>Economic</option>
              </select>
              <input
                type="number"
                placeholder="Impact value (1-100)"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setImpactModalOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const impactLog = {
                    id: `impact-${Date.now()}`,
                    roomId,
                    userId: memoryStore.getSessionId(),
                    description: 'Sample impact log',
                    type: 'environmental',
                    value: 50,
                    timestamp: new Date()
                  }
                  memoryStore.logImpact(impactLog)
                  setImpactModalOpen(false)
                  handleQuickAction('impact-logged')
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Log Impact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
