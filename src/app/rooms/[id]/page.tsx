'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { RoomLayout, type RoomSection } from '@/components/rooms/RoomLayout'
import { KaiAssistant, kaiPersonalities } from '@/components/rooms/KaiAssistant'
import { SimulationEngine, simulationConfigs, createInitialSimulationData, type SimulationData } from '@/components/rooms/SimulationEngine'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  MessageSquare, 
  Activity, 
  Users, 
  Target,
  Calendar,
  FileText,
  TrendingUp,
  Settings
} from 'lucide-react'
import { goldenThreads } from '@/data/goldenThreads'
import { trackPageView } from '@/lib/demo/analytics'

export default function GenericRoomPage() {
  const params = useParams()
  
  // Find the room from golden threads
  const roomThread = goldenThreads.find(thread => thread.room.id === params.id)
  const roomData = roomThread?.room
  
  // Simulation state
  const [simulationData, setSimulationData] = useState<SimulationData>(
    createInitialSimulationData('default')
  )
  const [isSimulationPlaying, setIsSimulationPlaying] = useState(true)

  useEffect(() => {
    if (roomData) {
      trackPageView(`/rooms/${params.id}`)
    }
  }, [params.id, roomData])

  // Helper functions
  const fmtDateTime = (date: Date) => {
    return date.toLocaleDateString('en-AU', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <p className="text-gray-600">Room not found</p>
      </div>
    )
  }

  // Quick actions based on room data
  const quickActions = [
    {
      id: 'join-discussion',
      label: 'Join Discussion',
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: () => console.log('Join discussion clicked'),
      count: simulationData.messages.length
    },
    {
      id: 'view-members',
      label: 'View Members',
      icon: <Users className="w-4 h-4" />,
      onClick: () => console.log('View members clicked'),
      count: simulationData.stats.activeMembers
    },
    {
      id: 'track-goals',
      label: 'Track Goals',
      icon: <Target className="w-4 h-4" />,
      onClick: () => console.log('Track goals clicked')
    },
    {
      id: 'room-settings',
      label: 'Room Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => console.log('Room settings clicked')
    }
  ]

  // Hero section
  const heroSection = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Main description */}
      <Card variant="ghost" className="border-blue-200 bg-blue-50/50 p-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-blue-900">{roomData.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-blue-800 mb-4">
            {roomData.description}
          </p>
          <div className="text-xs text-blue-600 mb-3">
            Room ID: {roomData.id} • Demo mode: ON
          </div>
        </CardContent>
      </Card>

      {/* Impact tiles */}
      <div className="grid grid-cols-2 gap-3">
        <Card variant="ghost" className="bg-blue-100 border-blue-300 p-4 text-center">
          <div className="text-xs uppercase tracking-wide opacity-80 text-blue-700">Active Members</div>
          <div className="text-3xl font-bold mt-1 text-blue-900">{simulationData.stats.activeMembers}</div>
        </Card>
        <Card variant="ghost" className="bg-green-100 border-green-300 p-4 text-center">
          <div className="text-xs uppercase tracking-wide opacity-80 text-green-700">Messages</div>
          <div className="text-3xl font-bold mt-1 text-green-900">{simulationData.messages.length}</div>
        </Card>
        <Card variant="ghost" className="bg-purple-100 border-purple-300 p-4 text-center">
          <div className="text-xs uppercase tracking-wide opacity-80 text-purple-700">Impact Score</div>
          <div className="text-3xl font-bold mt-1 text-purple-900">{simulationData.stats.impactScore}</div>
        </Card>
        <Card variant="ghost" className="bg-orange-100 border-orange-300 p-4 text-center">
          <div className="text-xs uppercase tracking-wide opacity-80 text-orange-700">Engagement</div>
          <div className="text-3xl font-bold mt-1 text-orange-900">{simulationData.stats.engagement}%</div>
        </Card>
      </div>

      {/* Room objectives */}
      <Card variant="ghost" className="border-blue-200 bg-blue-50/50 p-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-blue-900">Room Objectives</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-900">
              <Target className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {roomData.objectives && roomData.objectives.length > 0 ? (
            <div className="space-y-2">
              {roomData.objectives.slice(0, 3).map((objective, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium text-blue-900">{objective.title}</div>
                  <div className="text-blue-700/90 text-xs">{objective.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm opacity-80 text-blue-700">No objectives set yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Sidebar with Kai Assistant
  const sidebar = (
    <KaiAssistant
      personality={kaiPersonalities.kai}
      roomContext={{
        type: 'generic',
        activity: simulationData.stats.engagement,
        members: simulationData.stats.activeMembers,
        recentActions: simulationData.activity.slice(-3).map(a => a.action)
      }}
      theme="default"
    />
  )

  // Room sections with progressive disclosure
  const sections: RoomSection[] = [
    {
      id: 'discussion',
      title: 'Room Discussion',
      icon: <MessageSquare className="w-5 h-5" />,
      priority: 'high',
      defaultExpanded: true,
      badge: simulationData.messages.length,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Main chat */}
          <Card variant="ghost" className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Live Chat
                <span className="text-xs opacity-70 ml-auto">Active</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-auto">
                {simulationData.messages.slice(-8).map((message) => (
                  <div key={message.id} className="text-sm">
                    <span className="text-blue-700 font-medium">{message.author}:</span>{' '}
                    <span className="text-blue-900">{message.content}</span>
                    <span className="opacity-50 text-xs ml-2">· {fmtDateTime(message.timestamp)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity feed */}
          <Card variant="ghost" className="border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-auto">
                {simulationData.activity.slice(-6).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-green-800 font-medium">{activity.user}</div>
                      <div className="text-green-700">{activity.action}</div>
                      {activity.detail && (
                        <div className="text-green-600 text-xs">{activity.detail}</div>
                      )}
                      <div className="text-green-500 text-xs">{fmtDateTime(activity.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'objectives',
      title: 'Room Objectives',
      icon: <Target className="w-5 h-5" />,
      priority: 'high',
      badge: roomData.objectives?.length || 0,
      content: (
        <div className="space-y-4">
          {roomData.objectives && roomData.objectives.length > 0 ? (
            roomData.objectives.map((objective, i) => (
              <Card key={i} variant="ghost" className="border-blue-200 bg-blue-50/20 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-blue-900">{objective.title}</h4>
                    <div className="text-sm text-blue-700">{objective.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-800">
                      {objective.progress || 0}% Complete
                    </div>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${objective.progress || 0}%` }}
                  ></div>
                </div>
              </Card>
            ))
          ) : (
            <Card variant="ghost" className="border-blue-200 bg-blue-50/20 p-4 text-center">
              <p className="text-blue-700">No objectives have been set for this room yet.</p>
              <Button variant="ghost" className="mt-2 text-blue-600 hover:text-blue-800">
                Add First Objective
              </Button>
            </Card>
          )}
        </div>
      )
    },
    {
      id: 'resources',
      title: 'Resources & Files',
      icon: <FileText className="w-5 h-5" />,
      priority: 'medium',
      badge: 0,
      content: (
        <Card variant="ghost" className="border-blue-200 bg-blue-50/20 p-4 text-center">
          <FileText className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <p className="text-blue-700 mb-3">No resources have been shared yet.</p>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
            Upload First Resource
          </Button>
        </Card>
      )
    },
    {
      id: 'analytics',
      title: 'Room Analytics',
      icon: <TrendingUp className="w-5 h-5" />,
      priority: 'low',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="ghost" className="border-purple-200 bg-purple-50/20 p-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-900 text-base">Engagement Trends</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">This Week</span>
                  <span className="text-purple-900 font-medium">{simulationData.stats.engagement}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Last Week</span>
                  <span className="text-purple-900 font-medium">{Math.max(0, simulationData.stats.engagement - 12)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Growth</span>
                  <span className="text-green-600 font-medium">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="ghost" className="border-orange-200 bg-orange-50/20 p-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-900 text-base">Member Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-700">Daily Active</span>
                  <span className="text-orange-900 font-medium">{simulationData.stats.activeMembers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-700">Total Messages</span>
                  <span className="text-orange-900 font-medium">{simulationData.messages.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-700">Avg. Response Time</span>
                  <span className="text-orange-900 font-medium">12 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ]

  return (
    <>
      {/* Simulation Engine */}
      <SimulationEngine
        config={simulationConfigs.default}
        initialData={simulationData}
        isPlaying={isSimulationPlaying}
        onDataUpdate={setSimulationData}
        roomType="default"
      />

      {/* Room Layout */}
      <RoomLayout
        title={roomData.name}
        description={roomData.description}
        theme={undefined}
        sections={sections}
        hero={heroSection}
        sidebar={sidebar}
        quickActions={quickActions}
      />
    </>
  )
}
