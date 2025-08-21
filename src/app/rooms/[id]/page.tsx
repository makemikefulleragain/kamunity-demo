'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Users, MessageSquare, Activity, Bot, Play, Pause, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'
import { goldenThreads } from '@/data/goldenThreads'
import { memoryStore } from '@/lib/memoryStore'

export default function RoomPreviewPage() {
  const params = useParams()
  const [isPlaying, setIsPlaying] = useState(true)
  const [simulationTime, setSimulationTime] = useState(0)
  const [stats, setStats] = useState({
    activeMembers: 12,
    messages: 156,
    impactScore: 450,
    engagement: 78
  })

  // Find the room from golden threads
  const roomThread = goldenThreads.rooms.find(r => r.id === params.id)
  
  useEffect(() => {
    // Track page view
    memoryStore.trackPageView(`/rooms/${params.id}`, {
      roomId: params.id,
      roomName: roomThread?.title || 'Unknown Room'
    })
  }, [params.id, roomThread])

  // Simulate activity updates
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setSimulationTime(prev => prev + 1)
      
      // Randomly update stats
      setStats(prev => ({
        activeMembers: Math.max(5, Math.min(20, prev.activeMembers + Math.floor(Math.random() * 3) - 1)),
        messages: prev.messages + Math.floor(Math.random() * 5),
        impactScore: prev.impactScore + Math.floor(Math.random() * 10),
        engagement: Math.min(100, prev.engagement + Math.floor(Math.random() * 3))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Simulated chat messages
  const simulatedMessages = [
    { id: 1, user: 'Sarah Chen', message: 'Just finished setting up the community garden beds!', time: '2m ago' },
    { id: 2, user: 'Marcus Johnson', message: 'Great work! I can bring some tomato seedlings tomorrow.', time: '5m ago' },
    { id: 3, user: 'Emily Rodriguez', message: 'Count me in for the weekend planting session.', time: '8m ago' },
    { id: 4, user: 'David Kim', message: 'Has anyone tested the soil pH yet?', time: '12m ago' },
    { id: 5, user: 'Lisa Wang', message: 'Yes! Results are in the shared folder. Looking good!', time: '15m ago' }
  ]

  // Simulated activity feed
  const activityFeed = [
    { time: '2m ago', user: 'Sarah Chen', action: 'Logged community impact', detail: '+50 points' },
    { time: '5m ago', user: 'Marcus Johnson', action: 'Shared resource', detail: 'Soil testing guide' },
    { time: '12m ago', user: 'Emily Rodriguez', action: 'Joined the room' },
    { time: '18m ago', user: 'David Kim', action: 'Started discussion', detail: 'Weekend schedule' },
    { time: '25m ago', user: 'Lisa Wang', action: 'Completed milestone', detail: 'Site preparation' }
  ]

  if (!roomThread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <p className="text-gray-600">Room not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Simulation Control Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/rooms" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Rooms
              </Link>
              <div className="text-sm text-gray-500">
                Simulation Mode • {Math.floor(simulationTime / 60)}:{(simulationTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'} Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-sm text-yellow-800 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            This is a simulation preview. Watch how community members collaborate in real-time.
          </p>
        </div>
      </div>

      {/* Room Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{roomThread.title}</h1>
          <p className="text-gray-600 mb-4">{roomThread.description}</p>
          
          {/* Live Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Active Members</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Messages</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.messages}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Impact Score</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.impactScore}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Engagement</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.engagement}%</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulated Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Live Discussion
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {simulatedMessages.map(msg => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {msg.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-gray-900">{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {activityFeed.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-gray-900">{item.user}</span>
                        <span className="text-sm text-gray-600">{item.action}</span>
                      </div>
                      {item.detail && (
                        <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kai AI Assistant Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Kai AI Assistant</h2>
                  <p className="text-sm text-gray-600">Automated insights and recommendations</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 font-medium mb-2">📊 Weekly Summary</p>
                  <p className="text-sm text-blue-800">
                    Your room has seen 23% increased activity this week. Key topics: composting techniques, 
                    volunteer coordination, and grant applications. Consider scheduling a community workshop.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-900 font-medium mb-2">🎯 Suggested Actions</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Review and approve 3 pending resource uploads</li>
                    <li>• Connect with new member Emily Rodriguez</li>
                    <li>• Document this week's garden progress</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-900 font-medium mb-2">💡 Opportunity Alert</p>
                  <p className="text-sm text-purple-800">
                    Similar rooms in your network are organizing a city-wide garden tour. 
                    This could increase visibility and attract new volunteers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Demo Mode:</strong> This is a simulation showing how focus rooms operate. 
            Real rooms would have live interactions, file uploads, and member collaboration.
          </p>
        </div>
      </div>
    </div>
  )
}
