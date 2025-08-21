'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { trackDemoEvent } from '@/lib/demo/analytics'

interface UserStatusIndicatorProps {
  onLoginClick: () => void
  onSignupClick: () => void
}

export function UserStatusIndicator({ onLoginClick, onSignupClick }: UserStatusIndicatorProps) {
  const { user, userProfile, signOut, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      trackDemoEvent('user_logout', {
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (user && userProfile) {
    return (
      <div className="flex items-center space-x-3">
        {/* User Avatar and Name */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm">
              {userProfile.emoji_avatar || '👤'}
            </span>
          </div>
          <span className="text-gray-700 font-medium text-sm hidden sm:block">
            {userProfile.name || userProfile.username || 'User'}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Login Button */}
      <button
        onClick={onLoginClick}
        className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
      >
        Login
      </button>

      {/* Signup Button */}
      <button
        onClick={onSignupClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Sign Up
      </button>
    </div>
  )
}
