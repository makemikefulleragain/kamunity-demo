/**
 * Demo Analytics System
 * Tracks user behavior, interests, and engagement for demo purposes
 */

export interface DemoAnalyticsEvent {
  userId?: string
  sessionId: string
  eventType: 'page_view' | 'button_click' | 'interest_capture' | 'room_generation' | 'pricing_feedback' | 'engagement_action' | 'user_login' | 'user_signup' | 'user_logout' | 'auth_error' | 'perspective_choice'
  eventData: {
    page?: string
    action?: string
    interests?: string[]
    roomScope?: string
    pricingChoice?: string
    engagementLevel?: 'low' | 'medium' | 'high'
    timestamp: string
    userAgent?: string
    method?: string
    username?: string
    error?: string
    capability?: 'low' | 'medium' | 'high' | 'expert' | 'neutral'
    destination?: string
    perspectiveId?: string
  }
}

export interface UserInterests {
  passionAreas: string[]
  communityTypes: string[]
  engagementPreferences: string[]
  topicInterests: string[]
  behaviorPatterns: {
    newsEngagement: number
    chatParticipation: number
    roomCreation: number
    commentFrequency: number
  }
}

class DemoAnalytics {
  private sessionId: string
  private userId?: string
  private interests: UserInterests

  constructor() {
    this.sessionId = this.generateSessionId()
    this.interests = {
      passionAreas: [],
      communityTypes: [],
      engagementPreferences: [],
      topicInterests: [],
      behaviorPatterns: {
        newsEngagement: 0,
        chatParticipation: 0,
        roomCreation: 0,
        commentFrequency: 0
      }
    }
    this.loadStoredData()
    // Auto-detect Supabase user if available
    this.detectSupabaseUser()
  }

  private async detectSupabaseUser() {
    try {
      // Import Supabase client dynamically to avoid SSR issues
      const { supabase } = await import('@/lib/supabase/client')
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        this.setUserId(session.user.id)
      }
    } catch (error) {
      console.warn('Could not detect Supabase user:', error)
    }
  }

  private generateSessionId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private loadStoredData() {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('kamunity_demo_analytics')
        if (stored) {
          const data = JSON.parse(stored)
          this.sessionId = data.sessionId || this.sessionId
          this.userId = data.userId
          this.interests = { ...this.interests, ...data.interests }
        }
      }
    } catch (error) {
      console.warn('Failed to load demo analytics data:', error)
    }
  }

  private saveData() {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('kamunity_demo_analytics', JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          interests: this.interests
        }))
      }
    } catch (error) {
      console.warn('Failed to save demo analytics data:', error)
    }
  }

  setUserId(userId: string) {
    this.userId = userId
    this.saveData()
  }

  trackEvent(eventType: DemoAnalyticsEvent['eventType'], eventData: Partial<DemoAnalyticsEvent['eventData']>) {
    const event: DemoAnalyticsEvent = {
      userId: this.userId,
      sessionId: this.sessionId,
      eventType,
      eventData: {
        ...eventData,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
      }
    }

    // Store locally for demo purposes
    this.storeEvent(event)

    // Update behavior patterns
    this.updateBehaviorPatterns(eventType, eventData)

    // Send to analytics endpoint (optional for demo)
    this.sendToAnalytics(event)
  }

  private storeEvent(event: DemoAnalyticsEvent) {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const events = JSON.parse(localStorage.getItem('kamunity_demo_events') || '[]')
        events.push(event)
        // Keep only last 100 events for demo
        if (events.length > 100) {
          events.splice(0, events.length - 100)
        }
        localStorage.setItem('kamunity_demo_events', JSON.stringify(events))
      }
    } catch (error) {
      console.warn('Failed to store demo event:', error)
    }
  }

  private updateBehaviorPatterns(eventType: string, eventData: any) {
    switch (eventType) {
      case 'page_view':
        if (eventData.page === 'news') {
          this.interests.behaviorPatterns.newsEngagement++
        }
        break
      case 'engagement_action':
        if (eventData.action === 'comment') {
          this.interests.behaviorPatterns.commentFrequency++
        } else if (eventData.action === 'chat_message') {
          this.interests.behaviorPatterns.chatParticipation++
        }
        break
      case 'room_generation':
        this.interests.behaviorPatterns.roomCreation++
        break
    }
    this.saveData()
  }

  private async sendToAnalytics(event: DemoAnalyticsEvent) {
    try {
      // For demo, we'll just log to console
      // In production, this would send to analytics service
      console.log('Demo Analytics Event:', event)
      
      // Optional: Send to Supabase analytics table
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        await fetch('/api/demo/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        }).catch(err => console.warn('Analytics API failed:', err))
      }
    } catch (error) {
      console.warn('Failed to send analytics:', error)
    }
  }

  captureInterests(interests: Partial<UserInterests>) {
    this.interests = { ...this.interests, ...interests }
    // Extract only string array values for tracking
    const interestStrings = Object.entries(interests)
      .filter(([_, value]) => Array.isArray(value))
      .flatMap(([_, value]) => value as string[])
    this.trackEvent('interest_capture', { interests: interestStrings })
    this.saveData()
  }

  getInterests(): UserInterests {
    return this.interests
  }

  getBehaviorSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      interests: this.interests,
      engagementLevel: this.calculateEngagementLevel(),
      recommendedActions: this.getRecommendedActions()
    }
  }

  private calculateEngagementLevel(): 'low' | 'medium' | 'high' {
    const { behaviorPatterns } = this.interests
    const totalActions = Object.values(behaviorPatterns).reduce((sum, count) => sum + count, 0)
    
    if (totalActions >= 10) return 'high'
    if (totalActions >= 5) return 'medium'
    return 'low'
  }

  private getRecommendedActions(): string[] {
    const recommendations = []
    const { behaviorPatterns } = this.interests

    if (behaviorPatterns.newsEngagement > 0 && behaviorPatterns.commentFrequency === 0) {
      recommendations.push('Try commenting on news articles that interest you')
    }
    if (behaviorPatterns.commentFrequency > 0 && behaviorPatterns.chatParticipation === 0) {
      recommendations.push('Join a chat discussion to connect with others')
    }
    if (behaviorPatterns.chatParticipation > 0 && behaviorPatterns.roomCreation === 0) {
      recommendations.push('Create a focus room about your passion area')
    }

    return recommendations
  }
}

// Create singleton instance only in browser environment
let demoAnalyticsInstance: DemoAnalytics | null = null

const getDemoAnalytics = () => {
  if (typeof window !== 'undefined') {
    if (!demoAnalyticsInstance) {
      demoAnalyticsInstance = new DemoAnalytics()
    }
    return demoAnalyticsInstance
  }
  // Return a dummy object for server-side rendering
  return {
    trackEvent: () => {},
    captureInterests: () => {},
    getInterests: () => ({
      passionAreas: [],
      communityTypes: [],
      engagementPreferences: [],
      topicInterests: [],
      behaviorPatterns: {
        newsEngagement: 0,
        chatParticipation: 0,
        roomCreation: 0,
        commentFrequency: 0
      }
    }),
    getBehaviorSummary: () => ({
      sessionId: '',
      userId: undefined,
      interests: {
        passionAreas: [],
        communityTypes: [],
        engagementPreferences: [],
        topicInterests: [],
        behaviorPatterns: {
          newsEngagement: 0,
          chatParticipation: 0,
          roomCreation: 0,
          commentFrequency: 0
        }
      },
      engagementLevel: 'low' as const,
      recommendedActions: []
    }),
    setUserId: () => {}
  }
}

export const demoAnalytics = getDemoAnalytics()

// Convenience functions
export const trackPageView = (page: string) => {
  getDemoAnalytics().trackEvent('page_view', { page })
}

export const trackButtonClick = (action: string, page?: string) => {
  getDemoAnalytics().trackEvent('button_click', { action, page })
}

export const trackEngagement = (action: string, engagementLevel?: 'low' | 'medium' | 'high') => {
  getDemoAnalytics().trackEvent('engagement_action', { action, engagementLevel })
}

export const trackRoomGeneration = (roomScope: string) => {
  getDemoAnalytics().trackEvent('room_generation', { roomScope })
}

export function trackPricingFeedback(pricingChoice: string) {
  getDemoAnalytics().trackEvent('pricing_feedback', { pricingChoice })
}

// Generic event tracking function for authentication and other events
export function trackDemoEvent(eventType: DemoAnalyticsEvent['eventType'], eventData: Partial<DemoAnalyticsEvent['eventData']>) {
  getDemoAnalytics().trackEvent(eventType, eventData)
}

// Track perspective choice from Welcome page
export function trackPerspectiveChoice(perspectiveId: string, capability: string, destination: string) {
  getDemoAnalytics().trackEvent('perspective_choice', { 
    perspectiveId, 
    capability: capability as 'low' | 'medium' | 'high' | 'expert' | 'neutral',
    destination,
    page: 'welcome'
  })
}
