/**
 * EmailRecognitionLogin Component Tests
 * Comprehensive testing for email recognition UI and user flows
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmailRecognitionLogin from './EmailRecognitionLogin'
import { useDemoAuth } from '@/contexts/DemoAuthContext'

// Mock the DemoAuth context
jest.mock('@/contexts/DemoAuthContext', () => ({
  useDemoAuth: jest.fn()
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('EmailRecognitionLogin', () => {
  const mockLogin = jest.fn()
  const mockOnNewUser = jest.fn()
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useDemoAuth as jest.Mock).mockReturnValue({
      login: mockLogin
    })
    ;(global.fetch as jest.Mock).mockClear()
  })

  const renderComponent = (props = {}) => {
    return render(
      <EmailRecognitionLogin
        onNewUser={mockOnNewUser}
        onSuccess={mockOnSuccess}
        {...props}
      />
    )
  }

  describe('Initial Render', () => {
    it('should render welcome message and email input', () => {
      renderComponent()
      
      expect(screen.getByText('Welcome to Kamunity! 👋')).toBeInTheDocument()
      expect(screen.getByText('Enter your email to continue your demo or start a new one')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Start New Demo' })).toBeInTheDocument()
    })

    it('should have Continue button disabled when email is empty', () => {
      renderComponent()
      
      const continueButton = screen.getByRole('button', { name: 'Continue' })
      expect(continueButton).toBeDisabled()
    })

    it('should enable Continue button when email is entered', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      const continueButton = screen.getByRole('button', { name: 'Continue' })
      
      await user.type(emailInput, 'test@example.com')
      
      expect(continueButton).not.toBeDisabled()
    })
  })

  describe('Form Validation', () => {
    it('should show error when submitting empty email', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      const form = screen.getByRole('form')
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      
      await waitFor(() => {
        expect(screen.getByText('Please enter your email address')).toBeInTheDocument()
      })
    })

    it('should trim whitespace from email input', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
          success: false,
          isNewUser: true,
          message: 'No demo account found with this email'
        })
      })
      
      const emailInput = screen.getByLabelText('Email Address')
      await user.type(emailInput, '  test@example.com  ')
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/demo-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' })
        })
      })
    })
  })

  describe('Successful Login Flow', () => {
    it('should handle successful returning user login', async () => {
      const user = userEvent.setup()
      const mockUserData = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        emoji_avatar: '😊',
        isDemoUser: true,
        demoData: { passionArea: 'Technology' }
      }
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
          success: true,
          message: 'Welcome back! Your demo account has been restored.',
          user: mockUserData,
          sessionToken: 'mock-session-token',
          isReturningUser: true
        })
      })
      
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      await user.type(emailInput, 'test@example.com')
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      
      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Checking...')).toBeInTheDocument()
      })
      
      // Should call login with user data
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(mockUserData, 'mock-session-token')
      })
      
      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('Welcome Back!')).toBeInTheDocument()
        expect(screen.getByText('Your demo account has been restored successfully.')).toBeInTheDocument()
      })
      
      // Should call onSuccess after delay
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      }, { timeout: 2000 })
    })
  })

  describe('New User Flow', () => {
    it('should redirect to signup for new users', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
          success: false,
          isNewUser: true,
          message: 'No demo account found with this email'
        })
      })
      
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      await user.type(emailInput, 'newuser@example.com')
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      
      await waitFor(() => {
        expect(mockOnNewUser).toHaveBeenCalled()
      })
    })

    it('should handle Start New Demo button click', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      await user.click(screen.getByRole('button', { name: 'Start New Demo' }))
      
      expect(mockOnNewUser).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should display API error messages', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
          success: false,
          message: 'Database connection failed'
        })
      })
      
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      await user.type(emailInput, 'test@example.com')
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      
      await waitFor(() => {
        expect(screen.getByText('Database connection failed')).toBeInTheDocument()
      })
    })

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
      
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      await user.type(emailInput, 'test@example.com')
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      
      await waitFor(() => {
        expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
      })
    })

    it('should handle malformed API responses', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      })
      
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      await user.type(emailInput, 'test@example.com')
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      
      await waitFor(() => {
        expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should disable form elements during loading', async () => {
      const user = userEvent.setup()
      
      // Mock a slow response
      ;(global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      )
      
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      const continueButton = screen.getByRole('button', { name: 'Continue' })
      const newDemoButton = screen.getByRole('button', { name: 'Start New Demo' })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(continueButton)
      
      // Should show loading state
      expect(screen.getByText('Checking...')).toBeInTheDocument()
      expect(emailInput).toBeDisabled()
      expect(continueButton).toBeDisabled()
      expect(newDemoButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels and structure', () => {
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('id', 'email')
      
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })

    it('should have proper button roles and labels', () => {
      renderComponent()
      
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Start New Demo' })).toBeInTheDocument()
    })
  })

  describe('Email Normalization', () => {
    it('should convert email to lowercase before sending', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
          success: false,
          isNewUser: true,
          message: 'No demo account found with this email'
        })
      })
      
      renderComponent()
      
      const emailInput = screen.getByLabelText('Email Address')
      await user.type(emailInput, 'TEST@EXAMPLE.COM')
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/demo-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' })
        })
      })
    })
  })
})
