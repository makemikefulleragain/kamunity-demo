'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Users, Building, TrendingUp, Activity, MessageSquare, Target, Calendar } from 'lucide-react'
import Link from 'next/link'
import { goldenThreads } from '@/data/goldenThreads'
import { trackPageView } from '@/lib/demo/analytics'

export default function ClubPage() {
  const params = useParams()
  const [stats, setStats] = useState({
    totalMembers: 234,
    activeRooms: 3,
    impactScore: 4250,
    monthlyGrowth: 15
  })

  // Find the club from golden threads
  const clubThread = goldenThreads.find(thread => thread.club?.id === params.id)?.club

  useEffect(() => {
    // Track page view
    trackPageView(`/clubs/${params.id}`)
  }, [params.id])

  // Simulate activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalMembers: Math.max(200, Math.min(300, prev.totalMembers + Math.floor(Math.random() * 3) - 1)),
        activeRooms: Math.max(2, Math.min(5, prev.activeRooms + Math.floor(Math.random() * 2) - 1)),
        impactScore: prev.impactScore + Math.floor(Math.random() * 20),
        monthlyGrowth: Math.max(10, Math.min(25, prev.monthlyGrowth + Math.floor(Math.random() * 3) - 1))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!clubThread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Club Not Found</h1>
          <p className="text-gray-600 mb-6">The club you're looking for doesn't exist or has been removed.</p>
          <Link href="/clubs" className="text-orange-600 hover:text-orange-700 flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Back to Clubs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/clubs" className="text-orange-600 hover:text-orange-700 flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Clubs
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{clubThread.name}</h1>
              <p className="text-gray-600 text-lg">{clubThread.description}</p>
            </div>
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg">
              <Building className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-700">Club</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Members</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
            <p className="text-sm text-green-600 mt-1">+{stats.monthlyGrowth}% this month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Active Rooms</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeRooms}</p>
            <p className="text-sm text-gray-500 mt-1">Collaborative spaces</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Impact Score</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.impactScore.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">Growing daily</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Activity Level</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">High</p>
            <p className="text-sm text-purple-600 mt-1">Very engaged</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Club Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About This Club</h2>
              <p className="text-gray-700 mb-4">
                {clubThread.name} is a thriving network of community-driven initiatives focused on creating positive change. 
                Our members collaborate across multiple rooms to share resources, knowledge, and coordinate impactful projects.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">🎯 Mission</h3>
                  <p className="text-sm text-orange-800">
                    Empower communities through collaborative action and shared resources
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">🌟 Vision</h3>
                  <p className="text-sm text-blue-800">
                    A network of thriving, sustainable communities working together
                  </p>
                </div>
              </div>
            </div>

            {/* Member Rooms */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-600" />
                Member Rooms
              </h2>
              <div className="space-y-4">
                {clubThread.memberRooms.map((roomId, index) => (
                  <div key={roomId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-900">Room {index + 1}</h3>
                      <p className="text-sm text-gray-600">Active collaborative space</p>
                    </div>
                    <Link 
                      href={`/rooms/${roomId}`}
                      className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      Visit Room
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Join Discussion</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>View Projects</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Upcoming Events</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New member joined</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Project milestone reached</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Event scheduled</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
