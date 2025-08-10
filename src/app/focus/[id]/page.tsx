'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { trackDemoEvent } from '@/lib/demo/analytics'

export default function FocusRoomPage() {
  const params = useParams()
  const roomId = params.id as string

  useEffect(() => {
    // Track focus room page view
    trackDemoEvent('page_view', {
      page: 'focus_room',
      roomId: roomId,
      timestamp: new Date().toISOString()
    })
  }, [roomId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-gray-900">Kamunity</span>
            </Link>
            
            <div className="flex space-x-8">
              <Link href="/news" className="text-gray-600 hover:text-gray-900">The News</Link>
              <Link href="/chat" className="text-gray-600 hover:text-gray-900">Chat</Link>
              <Link href="/rooms" className="text-gray-600 hover:text-gray-900">Rooms</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Navigation */}
        <Link 
          href="/rooms" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          ← Back to Rooms
        </Link>

        {/* Focus Room Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Focus Room #{roomId}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Welcome to your Focus Room! This is where ideas become action through 
              collaborative planning and community-driven execution.
            </p>
          </div>
        </div>

        {/* Focus Room Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Room Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Details</h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Room ID:</span>
                <span className="ml-2 text-gray-600">{roomId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600">Focus Room</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-green-600">Active</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">Just now</span>
              </div>
            </div>
          </div>

          {/* Room Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                📝 Start Planning Session
              </button>
              <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                👥 Invite Collaborators
              </button>
              <button className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors">
                🎯 Set Focus Goals
              </button>
              <Link 
                href="/chat"
                className="block w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center"
              >
                💬 Join Discussion
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Demo Mode Active</h3>
              <p className="text-blue-700">
                This Focus Room is part of the Kamunity demo experience. In the full platform, 
                you'll have access to advanced collaboration tools, AI assistance, and community features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
