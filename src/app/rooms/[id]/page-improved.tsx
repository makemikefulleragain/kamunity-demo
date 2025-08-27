'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { RoomLayout, type RoomSection } from '@/components/rooms/RoomLayout'
import { KaiAssistant, kaiPersonalities } from '@/components/rooms/KaiAssistant'
import { SimulationEngine, simulationConfigs, createInitialSimulationData, type SimulationData } from '@/components/rooms/SimulationEngine'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Calendar,
  FileText,
  Target,
  Settings,
  Play,
  Pause,
  Eye
} from 'lucide-react'
import { goldenThreads } from '@/data/goldenThreads'
import { trackPageView } from '@/lib/demo/analytics'

export default function ImprovedRoomPage() {
  const params = useParams()
  const [simulationData, setSimulationData] = useState<SimulationData>(
    createInitialSimulationData('default')
  )
  const [isSimulationPlaying, setIsSimulationPlaying] = useState(true)

  // Find the room from golden threads
  const roomThread = goldenThreads.find(thread => thread.room.id === params.id)?.room
  
  useEffect(() => {
    trackPageView(`/rooms/${params.id}`)
  }, [params.id])

  if (!roomThread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Room not found</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  // Determine room type for simulation
  const roomType = roomThread.name.toLowerCase().includes('garden') ? 'garden' :
                   roomThread.name.toLowerCase().includes('tech') || roomThread.name.toLowerCase().includes('code') ? 'tech' :
                   'default'

  // Hero section with live stats
  const heroSection = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Room description */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">{roomThread.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 mb-4">{roomThread.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            Simulation Mode Active
          </div>
        </CardContent>
      </Card>

      {/* Live stats grid */}
      <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Active Members</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{simulationData.stats.activeMembers}</p>
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Messages</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{simulationData.stats.totalMessages}</p>
        </Card>
        
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Impact Score</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{simulationData.stats.impactScore}</p>
        </Card>
        
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Engagement</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{simulationData.stats.engagement}%</p>
        </Card>
      </div>
    </div>
  )

  // Simulation control bar
  const simulationControls = (
    <Card className="p-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <Eye className="w-4 h-4" />
            This is a simulation preview. Watch how community members collaborate in real-time.
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSimulationPlaying(!isSimulationPlaying)}
          className="flex items-center gap-2"
        >
          {isSimulationPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isSimulationPlaying ? 'Pause' : 'Play'} Simulation
        </Button>
      </div>
    </Card>
  )

  // Quick actions from room data
  const quickActions = roomThread.quickActions.map(action => ({
    id: action.id,
    label: action.label,
    icon: action.icon === '📊' ? <TrendingUp className="w-4 h-4" /> :
          action.icon === '📅' ? <Calendar className="w-4 h-4" /> :
          action.icon === '📎' ? <FileText className="w-4 h-4" /> :
          action.icon === '✅' ? <Target className="w-4 h-4" /> :
          <Settings className="w-4 h-4" />,
    onClick: () => console.log(`${action.label} clicked`),
    count: action.count
  }))

  // Sidebar with Kai Assistant
  const sidebar = (
    <div className="space-y-6">
      <KaiAssistant
        personality={kaiPersonalities.kai}
        roomContext={{
          type: roomType,
          activity: simulationData.stats.engagement,
          members: simulationData.stats.activeMembers,
          recentActions: simulationData.activity.slice(-3).map(a => a.action)
        }}
        theme="default"
      />
      
      {/* Room objectives */}
      <Card className="p-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Objectives
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {roomThread.objectives.slice(0, 3).map((objective, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{objective}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Room sections with progressive disclosure
  const sections: RoomSection[] = [
    {
      id: 'overview',
      title: 'Room Overview',
      icon: <Users className="w-5 h-5" />,
      priority: 'high',
      defaultExpanded: true,
      content: simulationControls
    },
    {
      id: 'discussion',
      title: 'Live Discussion',
      icon: <MessageSquare className="w-5 h-5" />,
      priority: 'high',
      badge: simulationData.messages.length,
      content: (
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Community Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {simulationData.messages.slice(-10).map(msg => (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {msg.author[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-gray-900">{msg.author}</span>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString('en-AU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'activity',
      title: 'Recent Activity',
      icon: <Activity className="w-5 h-5" />,
      priority: 'medium',
      badge: simulationData.activity.length,
      content: (
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Community Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {simulationData.activity.slice(-8).map((item, index) => (
                <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-gray-900">{item.user}</span>
                      <span className="text-sm text-gray-600">{item.action}</span>
                    </div>
                    {item.detail && (
                      <p className="text-sm text-gray-500 mb-1">{item.detail}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {item.timestamp.toLocaleTimeString('en-AU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'objectives',
      title: 'Room Objectives',
      icon: <Target className="w-5 h-5" />,
      priority: 'medium',
      badge: roomThread.objectives.length,
      content: (
        <div className="space-y-3">
          {roomThread.objectives.map((objective, index) => (
            <Card key={index} className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                </div>
                <p className="text-gray-700">{objective}</p>
              </div>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 'resources',
      title: 'Resources & Files',
      icon: <FileText className="w-5 h-5" />,
      priority: 'low',
      content: (
        <Card className="p-6">
          <CardContent>
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No resources uploaded yet</p>
              <Button variant="outline">Upload Resource</Button>
            </div>
          </CardContent>
        </Card>
      )
    }
  ]

  return (
    <>
      {/* Simulation Engine */}
      <SimulationEngine
        config={simulationConfigs[roomType as keyof typeof simulationConfigs] || simulationConfigs.default}
        initialData={simulationData}
        isPlaying={isSimulationPlaying}
        onDataUpdate={setSimulationData}
        roomType={roomType}
      />

      {/* Room Layout */}
      <RoomLayout
        title={roomThread.name}
        description={roomThread.description}
        sections={sections}
        hero={heroSection}
        sidebar={sidebar}
        quickActions={quickActions}
      />
    </>
  )
}
