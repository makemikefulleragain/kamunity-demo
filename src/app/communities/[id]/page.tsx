'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Users, Building2, TrendingUp, Activity, MessageSquare, Target, Calendar, Globe, Zap } from 'lucide-react'
import Link from 'next/link'
import { communitySeeds } from '@/data/communitySeeds'
import { trackPageView } from '@/lib/demo/analytics'

export default function CommunityPage() {
  const params = useParams()
  const [stats, setStats] = useState({
    totalMembers: 456,
    memberClubs: 8,
    impactScore: 5670,
    monthlyGrowth: 18
  })

  // Find the community from seeds
  const community = communitySeeds.find(c => c.id === params.id)

  useEffect(() => {
    // Track page view
    trackPageView(`/communities/${params.id}`)
  }, [params.id])

  // Update stats with community data if found
  useEffect(() => {
    if (community) {
      setStats({
        totalMembers: community.totalMembers || 456,
        memberClubs: community.memberClubs || 8,
        impactScore: community.engagement * 10,
        monthlyGrowth: Math.floor(Math.random() * 10) + 15
      })
    }
  }, [community])

  // Simulate activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalMembers: Math.max(200, Math.min(600, prev.totalMembers + Math.floor(Math.random() * 3) - 1)),
        memberClubs: Math.max(3, Math.min(12, prev.memberClubs + Math.floor(Math.random() * 2) - 1)),
        impactScore: prev.impactScore + Math.floor(Math.random() * 30),
        monthlyGrowth: Math.max(10, Math.min(30, prev.monthlyGrowth + Math.floor(Math.random() * 3) - 1))
      }))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  if (!community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-6">The community you're looking for doesn't exist or has been removed.</p>
          <Link href="/communities" className="text-purple-600 hover:text-purple-700 flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Back to Communities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/communities" className="text-purple-600 hover:text-purple-700 flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Communities
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{community.title}</h1>
              <p className="text-gray-600 text-lg">{community.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {community.category}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {community.governanceModel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-700">Community</span>
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
              <Building2 className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Member Clubs</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.memberClubs}</p>
            <p className="text-sm text-gray-500 mt-1">Federated organizations</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Impact Score</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.impactScore.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">Growing steadily</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Engagement</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{community.engagement}</p>
            <p className="text-sm text-orange-600 mt-1">Very active</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About This Community</h2>
              <p className="text-gray-700 mb-4">
                {community.title} represents a federated network of autonomous organizations working together 
                for shared goals while maintaining their independence and democratic governance structures.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">🏛️ Governance</h3>
                  <p className="text-sm text-purple-800">
                    {community.governanceModel} - Democratic decision-making across member organizations
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">🤝 Federation</h3>
                  <p className="text-sm text-blue-800">
                    Autonomous clubs coordinating resources and collective action
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {community.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Member Organizations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Member Organizations
              </h2>
              <div className="space-y-4">
                {Array.from({ length: community.memberClubs || 5 }, (_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {community.category.replace(' Community', '')} Club {index + 1}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Autonomous organization within the federation
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                      View Club
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Community Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Join Federation</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>View Initiatives</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Assembly Schedule</span>
                </button>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Community Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comments</span>
                  <span className="font-semibold">{community.commentCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="font-semibold">{community.engagement}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="font-semibold text-sm">
                    {new Date(community.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New club joined federation</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Community assembly scheduled</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Initiative proposal submitted</p>
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
