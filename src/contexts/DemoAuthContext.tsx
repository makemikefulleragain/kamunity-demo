'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DemoUser {
  id: string
  name: string
  email: string
  emoji_avatar: string
  demoData: {
    passionArea: string
    passionDescription: string
    communityInvolvementScale: string
    communityInvolvementTypes: string[]
    additionalInterests: string
    isDemoUser: boolean
    demoSessionId: string
    onboardingCompleted: boolean
    signupTimestamp: string
  }
}

interface DemoAuthContextType {
  user: DemoUser | null
  sessionToken: string | null
  isLoading: boolean
  login: (userData: DemoUser, token: string) => void
  logout: () => void
  updateOnboardingStatus: (completed: boolean) => void
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined)

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedToken = localStorage.getItem('kamunity_demo_session')
    if (savedToken) {
      validateSession(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateSession = async (token: string) => {
    try {
      const response = await fetch('/api/auth/demo-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionToken: token })
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.user)
        setSessionToken(token)
        localStorage.setItem('kamunity_demo_session', token)
      } else {
        // Invalid session, clear it
        localStorage.removeItem('kamunity_demo_session')
        setUser(null)
        setSessionToken(null)
      }
    } catch (error) {
      console.error('Session validation failed:', error)
      localStorage.removeItem('kamunity_demo_session')
      setUser(null)
      setSessionToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData: DemoUser, token: string) => {
    setUser(userData)
    setSessionToken(token)
    localStorage.setItem('kamunity_demo_session', token)
    setIsLoading(false)
  }

  const logout = async () => {
    try {
      if (sessionToken) {
        await fetch('/api/auth/demo-session', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionToken })
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setSessionToken(null)
      localStorage.removeItem('kamunity_demo_session')
    }
  }

  const updateOnboardingStatus = (completed: boolean) => {
    if (user) {
      setUser({
        ...user,
        demoData: {
          ...user.demoData,
          onboardingCompleted: completed
        }
      })
    }
  }

  const value = {
    user,
    sessionToken,
    isLoading,
    login,
    logout,
    updateOnboardingStatus
  }

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  )
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider')
  }
  return context
}

// Helper hook for checking if user is authenticated
export function useRequireAuth() {
  const { user, isLoading } = useDemoAuth()
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading
  }
}
