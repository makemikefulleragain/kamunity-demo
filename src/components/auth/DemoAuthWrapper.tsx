'use client'

import { useState } from 'react'
import { DemoSignup } from './DemoSignup'
import { OnboardingChoice } from './OnboardingChoice'
import EmailRecognitionLogin from './EmailRecognitionLogin'
import { useDemoAuth } from '@/contexts/DemoAuthContext'
import { useRouter } from 'next/navigation'

interface DemoUser {
  id: string
  name: string
  email: string
  emoji_avatar: string
  demoData: any
}

export function DemoAuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading, login, updateOnboardingStatus } = useDemoAuth()
  const [showOnboardingChoice, setShowOnboardingChoice] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignupComplete = (userData: DemoUser, sessionToken: string) => {
    login(userData, sessionToken)
    setShowOnboardingChoice(true)
    setShowSignup(false)
    setError(null)
  }

  const handleEmailRecognitionSuccess = () => {
    // For returning users, skip onboarding choice and go directly to main app
    setError(null)
    // Don't show onboarding choice for returning users
  }

  const handleNewUser = () => {
    setShowSignup(true)
    setError(null)
  }

  const handleOnboardingChoice = (choice: 'chat' | 'tour') => {
    updateOnboardingStatus(true)
    setShowOnboardingChoice(false)
    
    if (choice === 'chat') {
      // Navigate to chat hub
      router.push('/chat')
    } else {
      // Navigate to platform tour
      router.push('/tour')
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌟</div>
          <div className="text-xl font-semibold text-gray-700">Loading Kamunity...</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show onboarding choice if user just signed up
  if (user && showOnboardingChoice) {
    return (
      <OnboardingChoice
        user={user}
        onChoice={handleOnboardingChoice}
      />
    )
  }

  // Show signup form if user chose to create new account
  if (!user && showSignup) {
    return (
      <DemoSignup
        onSignupComplete={handleSignupComplete}
        onError={handleError}
      />
    )
  }

  // Show email recognition login if no user and not in signup flow
  if (!user) {
    return (
      <EmailRecognitionLogin
        onNewUser={handleNewUser}
        onSuccess={handleEmailRecognitionSuccess}
      />
    )
  }

  // User is authenticated and has completed onboarding, show main app
  return <>{children}</>
}
