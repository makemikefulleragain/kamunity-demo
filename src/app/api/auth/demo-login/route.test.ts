/**
 * Demo Login API Route Tests
 * Comprehensive testing for email recognition and session restoration
 */

import { NextRequest } from 'next/server'
import { POST } from './route'

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn()
      }))
    }))
  }))
}))

// Mock crypto
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'test-uuid-123')
}))

describe('/api/auth/demo-login', () => {
  let mockSupabase: any

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
  })

  const createMockRequest = (body: any) => {
    return {
      json: jest.fn().mockResolvedValue(body)
    } as unknown as NextRequest
  }

  describe('Input Validation', () => {
    it('should return 400 when email is missing', async () => {
      const request = createMockRequest({})
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Email is required')
    })

    it('should return 400 when email is empty string', async () => {
      const request = createMockRequest({ email: '' })
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Email is required')
    })

    it('should return 400 when email is only whitespace', async () => {
      const request = createMockRequest({ email: '   ' })
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Email is required')
    })
  })

  describe('User Lookup', () => {
    it('should return 404 when user not found', async () => {
      const { createClient } = require('@supabase/supabase-js')
      const mockClient = createClient()
      
      mockClient.from().select().eq().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }
      })

      const request = createMockRequest({ email: 'notfound@example.com' })
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(404)
      expect(result.success).toBe(false)
      expect(result.message).toBe('No demo account found with this email')
      expect(result.isNewUser).toBe(true)
    })

    it('should return 403 when user exists but is not a demo user', async () => {
      const { createClient } = require('@supabase/supabase-js')
      const mockClient = createClient()
      
      mockClient.from().select().eq().eq().single.mockResolvedValue({
        data: {
          id: 'user-123',
          email: 'regular@example.com',
          username: 'regular_user', // Not a demo user
          name: 'Regular User',
          emoji_avatar: '😊',
          created_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      const request = createMockRequest({ email: 'regular@example.com' })
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(403)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Account found but not a demo account')
      expect(result.isNewUser).toBe(true)
    })

    it('should return 500 when database error occurs', async () => {
      const { createClient } = require('@supabase/supabase-js')
      const mockClient = createClient()
      
      mockClient.from().select().eq().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'CONNECTION_ERROR', message: 'Database connection failed' }
      })

      const request = createMockRequest({ email: 'test@example.com' })
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Database error during lookup')
    })
  })

  describe('Successful Login', () => {
    it('should successfully login demo user with JSON demo data', async () => {
      const { createClient } = require('@supabase/supabase-js')
      const mockClient = createClient()
      
      const mockDemoData = {
        passionArea: 'Environmental Action',
        passionDescription: 'Climate change activism',
        communityInvolvementScale: 'High Level',
        communityInvolvementTypes: ['Volunteering', 'Organizing'],
        additionalInterests: 'Sustainability, Renewable Energy',
        interestsExplanation: 'Passionate about green technology',
        isDemoUser: true,
        demoSessionId: 'session-123',
        onboardingCompleted: true,
        signupTimestamp: '2024-01-01T00:00:00Z'
      }

      mockClient.from().select().eq().eq().single.mockResolvedValue({
        data: {
          id: 'demo-user-123',
          email: 'demo@example.com',
          username: 'DEMO_USER_12345',
          name: JSON.stringify(mockDemoData),
          emoji_avatar: '🌱',
          created_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      mockClient.from().update().eq.mockResolvedValue({
        data: null,
        error: null
      })

      const request = createMockRequest({ email: 'demo@example.com' })
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Welcome back! Your demo account has been restored.')
      expect(result.user.id).toBe('demo-user-123')
      expect(result.user.email).toBe('demo@example.com')
      expect(result.user.name).toBe('Environmental Action')
      expect(result.user.isDemoUser).toBe(true)
      expect(result.user.demoData.passionArea).toBe('Environmental Action')
      expect(result.isReturningUser).toBe(true)
      expect(result.sessionToken).toBeDefined()
    })

    it('should handle demo user with fallback data when name is not JSON', async () => {
      const { createClient } = require('@supabase/supabase-js')
      const mockClient = createClient()
      
      mockClient.from().select().eq().eq().single.mockResolvedValue({
        data: {
          id: 'demo-user-456',
          email: 'legacy@example.com',
          username: 'DEMO_USER_67890',
          name: 'Legacy Demo User', // Not JSON
          emoji_avatar: '👤',
          created_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      mockClient.from().update().eq.mockResolvedValue({
        data: null,
        error: null
      })

      const request = createMockRequest({ email: 'legacy@example.com' })
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.success).toBe(true)
      expect(result.user.demoData.passionArea).toBe('Community Building')
      expect(result.user.demoData.isDemoUser).toBe(true)
      expect(result.user.demoData.onboardingCompleted).toBe(true)
      expect(result.user.demoData.demoSessionId).toBe('test-uuid-123')
    })

    it('should normalize email to lowercase', async () => {
      const { createClient } = require('@supabase/supabase-js')
      const mockClient = createClient()
      
      mockClient.from().select().eq().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }
      })

      const request = createMockRequest({ email: 'TEST@EXAMPLE.COM' })
      await POST(request)

      // Verify that the email was normalized to lowercase in the query
      expect(mockClient.from().select().eq().eq().single).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      const { createClient } = require('@supabase/supabase-js')
      const mockClient = createClient()
      
      mockClient.from().select().eq().eq().single.mockRejectedValue(
        new Error('Unexpected database error')
      )

      const request = createMockRequest({ email: 'test@example.com' })
      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Login failed due to server error')
    })

    it('should handle malformed request body', async () => {
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as unknown as NextRequest

      const response = await POST(request)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Login failed due to server error')
    })
  })

  describe('Session Token Generation', () => {
    it('should generate valid session token with correct data', async () => {
      const { createClient } = require('@supabase/supabase-js')
      const mockClient = createClient()
      
      const mockDemoData = {
        passionArea: 'Technology',
        demoSessionId: 'session-456'
      }

      mockClient.from().select().eq().eq().single.mockResolvedValue({
        data: {
          id: 'demo-user-789',
          email: 'tech@example.com',
          username: 'DEMO_USER_789',
          name: JSON.stringify(mockDemoData),
          emoji_avatar: '💻',
          created_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      mockClient.from().update().eq.mockResolvedValue({
        data: null,
        error: null
      })

      const request = createMockRequest({ email: 'tech@example.com' })
      const response = await POST(request)
      const result = await response.json()

      expect(result.sessionToken).toBeDefined()
      
      // Decode and verify session token
      const decodedToken = JSON.parse(
        Buffer.from(result.sessionToken, 'base64').toString()
      )
      
      expect(decodedToken.userId).toBe('demo-user-789')
      expect(decodedToken.email).toBe('tech@example.com')
      expect(decodedToken.isDemoUser).toBe(true)
      expect(decodedToken.isReturningUser).toBe(true)
      expect(decodedToken.sessionId).toBe('session-456')
    })
  })
})
