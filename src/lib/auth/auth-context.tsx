'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { User as DatabaseUser } from '@/lib/supabase/types'

interface AuthContextType {
  user: User | null
  userProfile: DatabaseUser | null
  loading: boolean
  signUp: (email: string, password: string, userData: { name: string; username: string; emoji_avatar?: string; email_subscribed?: boolean }) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<DatabaseUser>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<DatabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
        
        // Create or update user session for concurrent user tracking
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
          const sessionToken = Math.random().toString(36).substring(2, 15)
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          
          await supabase
            .from('user_sessions')
            .upsert({
              user_id: session.user.id,
              session_token: sessionToken,
              expires_at: expiresAt.toISOString()
            })
        }
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
      } else {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    userData: { name: string; username: string; emoji_avatar?: string; email_subscribed?: boolean }
  ) => {
    try {
      // First, check if username is available
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', userData.username)
        .single()

      if (existingUser) {
        return { error: { message: 'Username already taken' } }
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) return { error }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name: userData.name,
            username: userData.username,
            emoji_avatar: userData.emoji_avatar || '😊',
            email_subscribed: userData.email_subscribed || false
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          return { error: profileError }
        }

        // Track analytics event
        await supabase
          .from('analytics_events')
          .insert({
            user_id: data.user.id,
            event_type: 'user_signup',
            event_data: { 
              emoji_avatar: userData.emoji_avatar || '😊',
              email_subscribed: userData.email_subscribed || false
            },
            page_url: window.location.href,
            user_agent: navigator.userAgent
          })
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error) {
        // Track analytics event
        await supabase
          .from('analytics_events')
          .insert({
            user_id: user?.id,
            event_type: 'user_signin',
            page_url: window.location.href,
            user_agent: navigator.userAgent
          })
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      // Clean up user session
      if (user?.id) {
        await supabase
          .from('user_sessions')
          .delete()
          .eq('user_id', user.id)

        // Track analytics event
        await supabase
          .from('analytics_events')
          .insert({
            user_id: user.id,
            event_type: 'user_signout',
            page_url: window.location.href,
            user_agent: navigator.userAgent
          })
      }

      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: Partial<DatabaseUser>) => {
    if (!user?.id) return { error: { message: 'No user logged in' } }

    try {
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (!error) {
        // Refresh user profile
        await fetchUserProfile(user.id)
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
