/**
 * Demo Analytics System
 * Tracks user behavior, interests, and engagement for demo purposes
 */

export interface DemoAnalyticsEvent {
  userId?: string
  sessionId: string
  eventType: 'page_view' | 'button_click' | 'interest_capture' | 'room_generation' | 'pricing_feedback' | 'engagement_action'
  eventData: {
    page?: string
    action?: string
    interests?: string[]
    roomScope?: string
    pricingChoice?: string
    engagementLevel?: 'low' | 'medium' | 'high'
    timestamp: string
    userAgent?: string
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
  }

  private generateSessionId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private loadStoredData() {
    try {
      const stored = localStorage.getItem('kamunity_demo_analytics')
      if (stored) {
        const data = JSON.parse(stored)
        this.sessionId = data.sessionId || this.sessionId
        this.userId = data.userId
        this.interests = { ...this.interests, ...data.interests }
      }
    } catch (error) {
      console.warn('Failed to load demo analytics data:', error)
    }
  }

  private saveData() {
    try {
      localStorage.setItem('kamunity_demo_analytics', JSON.stringify({
        sessionId: this.sessionId,
        userId: this.userId,
        interests: this.interests
      }))
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
        userAgent: navigator.userAgent
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
      const events = JSON.parse(localStorage.getItem('kamunity_demo_events') || '[]')
      events.push(event)
      // Keep only last 100 events for demo
      if (events.length > 100) {
        events.splice(0, events.length - 100)
      }
      localStorage.setItem('kamunity_demo_events', JSON.stringify(events))
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
    this.trackEvent('interest_capture', { interests: Object.values(interests).flat() })
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

// Singleton instance for demo
export const demoAnalytics = new DemoAnalytics()

// Convenience functions
export const trackPageView = (page: string) => {
  demoAnalytics.trackEvent('page_view', { page })
}

export const trackButtonClick = (action: string, page?: string) => {
  demoAnalytics.trackEvent('button_click', { action, page })
}

export const trackEngagement = (action: string, engagementLevel?: 'low' | 'medium' | 'high') => {
  demoAnalytics.trackEvent('engagement_action', { action, engagementLevel })
}

export const trackRoomGeneration = (roomScope: string) => {
  demoAnalytics.trackEvent('room_generation', { roomScope })
}

export const trackPricingFeedback = (pricingChoice: string) => {
  demoAnalytics.trackEvent('pricing_feedback', { pricingChoice })
}
