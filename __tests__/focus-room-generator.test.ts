/**
 * Focus Room Generator Test Suite
 * Comprehensive testing for the improved UI/UX and functionality
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock components for testing
import KamunityRoomGenerator from '../src/components/rooms/generators/KamunityRoomGenerator';
import GeneratedRoom from '../src/components/rooms/generators/GeneratedRoom';

// Mock data
const mockRoomData = {
  id: 'test-room-1',
  name: 'Test Focus Room',
  title: 'Test Focus Room',
  purpose: 'Testing collaboration and impact',
  description: 'A dedicated space for testing',
  targetAudience: 'Developers',
  completeness: 75,
  detailedSpec: {
    pitchSection: {
      hook: 'Transform how developers collaborate',
      cta: "Let's get this live and start building momentum together!"
    },
    roiStory: 'Meet Sarah, a developer...',
    savingsTable: {
      timeWasted: '20 hours/week',
      costPerHour: '$75',
      weeklySavings: '$1,500',
      monthlySavings: '$6,000',
      annualSavings: '$72,000'
    },
    wireframe: {
      layout: 'Homepage Layout',
      sections: ['Header', 'Hero', 'Quick Actions', 'Live Preview', 'Widgets', 'Footer']
    }
  }
};

// ============================================
// 1. COMPONENT UNIT TESTS
// ============================================

describe('KamunityRoomGenerator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial form with all input fields', () => {
    render(<KamunityRoomGenerator />);
    
    expect(screen.getByLabelText(/who is this room for/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what do you want to achieve/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what tools or resources/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/any specific requirements/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<KamunityRoomGenerator />);
    
    const generateButton = screen.getByText(/generate room specification/i);
    await user.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/target group is required/i)).toBeInTheDocument();
      expect(screen.getByText(/goals are required/i)).toBeInTheDocument();
    });
  });

  test('progresses through confirmation step', async () => {
    const user = userEvent.setup();
    render(<KamunityRoomGenerator />);
    
    // Fill out form
    await user.type(screen.getByLabelText(/who is this room for/i), 'Developers');
    await user.type(screen.getByLabelText(/what do you want to achieve/i), 'Better collaboration');
    await user.type(screen.getByLabelText(/what tools or resources/i), 'Slack, GitHub');
    
    // Submit form
    await user.click(screen.getByText(/generate room specification/i));
    
    // Check confirmation step appears
    await waitFor(() => {
      expect(screen.getByText(/check for understanding/i)).toBeInTheDocument();
      expect(screen.getByText(/developers/i)).toBeInTheDocument();
      expect(screen.getByText(/better collaboration/i)).toBeInTheDocument();
    });
  });

  test('generates complete 8-section specification', async () => {
    const user = userEvent.setup();
    render(<KamunityRoomGenerator />);
    
    // Fill form and confirm
    await user.type(screen.getByLabelText(/who is this room for/i), 'Developers');
    await user.type(screen.getByLabelText(/what do you want to achieve/i), 'Better collaboration');
    await user.click(screen.getByText(/generate room specification/i));
    
    // Confirm generation
    await waitFor(() => {
      const confirmButton = screen.getByText(/looks good/i);
      return user.click(confirmButton);
    });
    
    // Check all 8 sections are generated
    await waitFor(() => {
      expect(screen.getByText(/pitch section/i)).toBeInTheDocument();
      expect(screen.getByText(/roi story/i)).toBeInTheDocument();
      expect(screen.getByText(/savings analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/homepage wireframe/i)).toBeInTheDocument();
      expect(screen.getByText(/user flow/i)).toBeInTheDocument();
      expect(screen.getByText(/design questions/i)).toBeInTheDocument();
      expect(screen.getByText(/mvp feature matrix/i)).toBeInTheDocument();
      expect(screen.getByText(/additional suggestions/i)).toBeInTheDocument();
    });
  });

  test('email functionality works correctly', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    global.fetch = mockFetch;

    render(<KamunityRoomGenerator />);
    
    // Generate spec first
    await user.type(screen.getByLabelText(/who is this room for/i), 'Developers');
    await user.type(screen.getByLabelText(/what do you want to achieve/i), 'Better collaboration');
    await user.click(screen.getByText(/generate room specification/i));
    
    await waitFor(() => user.click(screen.getByText(/looks good/i)));
    
    // Test email step
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email address/i);
      return user.type(emailInput, 'test@example.com');
    });
    
    await user.click(screen.getByText(/send specification/i));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/demo/focus-room', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('test@example.com')
      }));
    });
  });
});

describe('GeneratedRoom Component', () => {
  const mockProps = {
    roomData: mockRoomData,
    onBack: jest.fn(),
    onEnhance: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders simplified header with single CTA', () => {
    render(<GeneratedRoom {...mockProps} />);
    
    expect(screen.getByText(/test focus room/i)).toBeInTheDocument();
    expect(screen.getByText(/join room/i)).toBeInTheDocument();
    expect(screen.getByText(/← back/i)).toBeInTheDocument();
  });

  test('shows enhancement prompt for incomplete rooms', () => {
    render(<GeneratedRoom {...mockProps} />);
    
    expect(screen.getByText(/75% complete/i)).toBeInTheDocument();
    expect(screen.getByText(/unlock advanced features/i)).toBeInTheDocument();
    expect(screen.getByText(/complete setup/i)).toBeInTheDocument();
    expect(screen.getByText(/maybe later/i)).toBeInTheDocument();
  });

  test('displays simplified 3-column stats layout', () => {
    render(<GeneratedRoom {...mockProps} />);
    
    expect(screen.getByText(/members/i)).toBeInTheDocument();
    expect(screen.getByText(/engagement/i)).toBeInTheDocument();
    expect(screen.getByText(/impact score/i)).toBeInTheDocument();
    expect(screen.getByText(/view all analytics/i)).toBeInTheDocument();
  });

  test('live preview bar shows proper controls', () => {
    render(<GeneratedRoom {...mockProps} />);
    
    expect(screen.getByText(/live activity/i)).toBeInTheDocument();
    expect(screen.getByText(/pause|resume/i)).toBeInTheDocument();
  });

  test('AI assistant section includes email CTA', () => {
    render(<GeneratedRoom {...mockProps} />);
    
    expect(screen.getByText(/smart suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/get full room spec/i)).toBeInTheDocument();
    expect(screen.getByText(/professional consultation document/i)).toBeInTheDocument();
    expect(screen.getByText(/email specification/i)).toBeInTheDocument();
  });

  test('widgets display contextual content', () => {
    render(<GeneratedRoom {...mockProps} />);
    
    // Calendar widget
    expect(screen.getByText(/📅 upcoming/i)).toBeInTheDocument();
    expect(screen.getByText(/team sync/i)).toBeInTheDocument();
    
    // Polls widget
    expect(screen.getByText(/📊 quick poll/i)).toBeInTheDocument();
    expect(screen.getByText(/next priority/i)).toBeInTheDocument();
    
    // Badges widget
    expect(screen.getByText(/⭐ achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/top contributor/i)).toBeInTheDocument();
    
    // Analytics widget
    expect(screen.getByText(/📈 trends/i)).toBeInTheDocument();
    expect(screen.getByText(/engagement/i)).toBeInTheDocument();
  });

  test('footer provides clear next steps', () => {
    render(<GeneratedRoom {...mockProps} />);
    
    expect(screen.getByText(/live demo/i)).toBeInTheDocument();
    expect(screen.getByText(/ready to make it real/i)).toBeInTheDocument();
    expect(screen.getByText(/← back to generator/i)).toBeInTheDocument();
    expect(screen.getByText(/complete setup →/i)).toBeInTheDocument();
  });

  test('simulation controls work correctly', async () => {
    const user = userEvent.setup();
    render(<GeneratedRoom {...mockProps} />);
    
    const pauseButton = screen.getByText(/pause/i);
    await user.click(pauseButton);
    
    expect(screen.getByText(/resume/i)).toBeInTheDocument();
  });

  test('callback functions are called correctly', async () => {
    const user = userEvent.setup();
    render(<GeneratedRoom {...mockProps} />);
    
    await user.click(screen.getByText(/← back to generator/i));
    expect(mockProps.onBack).toHaveBeenCalledTimes(1);
    
    await user.click(screen.getByText(/complete setup/i));
    expect(mockProps.onEnhance).toHaveBeenCalledTimes(1);
  });
});

// ============================================
// 2. INTEGRATION TESTS
// ============================================

describe('Focus Room Generator Integration', () => {
  test('complete user journey from form to demo room', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, roomId: 'test-room-1' })
    });
    global.fetch = mockFetch;

    render(<KamunityRoomGenerator />);
    
    // Step 1: Fill out form
    await user.type(screen.getByLabelText(/who is this room for/i), 'Product Managers');
    await user.type(screen.getByLabelText(/what do you want to achieve/i), 'Streamline product development');
    await user.type(screen.getByLabelText(/what tools or resources/i), 'Jira, Figma, Slack');
    await user.type(screen.getByLabelText(/any specific requirements/i), 'Mobile-first approach');
    
    // Step 2: Generate specification
    await user.click(screen.getByText(/generate room specification/i));
    
    // Step 3: Confirm details
    await waitFor(() => {
      expect(screen.getByText(/product managers/i)).toBeInTheDocument();
    });
    await user.click(screen.getByText(/looks good/i));
    
    // Step 4: Verify 8-section spec is displayed
    await waitFor(() => {
      expect(screen.getByText(/pitch section/i)).toBeInTheDocument();
      expect(screen.getByText(/roi story/i)).toBeInTheDocument();
      expect(screen.getByText(/savings analysis/i)).toBeInTheDocument();
    });
    
    // Step 5: Navigate to demo room
    await user.click(screen.getByText(/view demo room/i));
    
    // Verify demo room loads with proper data
    await waitFor(() => {
      expect(screen.getByText(/product managers focus room/i)).toBeInTheDocument();
      expect(screen.getByText(/live activity/i)).toBeInTheDocument();
    });
  });

  test('email workflow with admin notification', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        success: true, 
        adminNotified: true,
        userNotified: true 
      })
    });
    global.fetch = mockFetch;

    render(<KamunityRoomGenerator />);
    
    // Generate spec
    await user.type(screen.getByLabelText(/who is this room for/i), 'Developers');
    await user.type(screen.getByLabelText(/what do you want to achieve/i), 'Better collaboration');
    await user.click(screen.getByText(/generate room specification/i));
    await waitFor(() => user.click(screen.getByText(/looks good/i)));
    
    // Email step
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email address/i);
      return user.type(emailInput, 'user@example.com');
    });
    
    await user.click(screen.getByText(/send specification/i));
    
    // Verify API call includes proper data
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/demo/focus-room', expect.objectContaining({
        body: expect.stringContaining('"targetGroup":"Developers"')
      }));
    });
    
    // Verify success message
    expect(screen.getByText(/specification sent successfully/i)).toBeInTheDocument();
  });
});

// ============================================
// 3. ACCESSIBILITY TESTS
// ============================================

describe('Focus Room Generator Accessibility', () => {
  test('form has proper labels and ARIA attributes', () => {
    render(<KamunityRoomGenerator />);
    
    const targetGroupInput = screen.getByLabelText(/who is this room for/i);
    expect(targetGroupInput).toHaveAttribute('aria-required', 'true');
    
    const goalsInput = screen.getByLabelText(/what do you want to achieve/i);
    expect(goalsInput).toHaveAttribute('aria-required', 'true');
    
    expect(screen.getByRole('button', { name: /generate room specification/i })).toBeInTheDocument();
  });

  test('error messages are announced to screen readers', async () => {
    const user = userEvent.setup();
    render(<KamunityRoomGenerator />);
    
    await user.click(screen.getByText(/generate room specification/i));
    
    await waitFor(() => {
      const errorMessage = screen.getByText(/target group is required/i);
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });

  test('demo room has proper heading hierarchy', () => {
    render(<GeneratedRoom {...mockProps} />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    
    const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(sectionHeadings.length).toBeGreaterThan(0);
  });

  test('interactive elements are keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<GeneratedRoom {...mockProps} />);
    
    const joinButton = screen.getByText(/join room/i);
    joinButton.focus();
    expect(joinButton).toHaveFocus();
    
    await user.keyboard('{Enter}');
    // Button should be activatable with Enter key
  });
});

// ============================================
// 4. PERFORMANCE TESTS
// ============================================

describe('Focus Room Generator Performance', () => {
  test('spec generation completes within 2 seconds', async () => {
    const user = userEvent.setup();
    render(<KamunityRoomGenerator />);
    
    await user.type(screen.getByLabelText(/who is this room for/i), 'Developers');
    await user.type(screen.getByLabelText(/what do you want to achieve/i), 'Better collaboration');
    
    const startTime = Date.now();
    await user.click(screen.getByText(/generate room specification/i));
    await user.click(screen.getByText(/looks good/i));
    
    await waitFor(() => {
      expect(screen.getByText(/pitch section/i)).toBeInTheDocument();
    });
    
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(2000);
  });

  test('demo room simulation runs smoothly', async () => {
    const { rerender } = render(<GeneratedRoom {...mockProps} />);
    
    // Simulate multiple re-renders (like live updates)
    for (let i = 0; i < 10; i++) {
      rerender(<GeneratedRoom {...mockProps} />);
    }
    
    // Component should still be responsive
    expect(screen.getByText(/test focus room/i)).toBeInTheDocument();
  });
});

// ============================================
// 5. ERROR HANDLING TESTS
// ============================================

describe('Focus Room Generator Error Handling', () => {
  test('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    render(<KamunityRoomGenerator />);
    
    await user.type(screen.getByLabelText(/who is this room for/i), 'Developers');
    await user.type(screen.getByLabelText(/what do you want to achieve/i), 'Better collaboration');
    await user.click(screen.getByText(/generate room specification/i));
    await user.click(screen.getByText(/looks good/i));
    
    // Try to send email
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email address/i);
      return user.type(emailInput, 'test@example.com');
    });
    
    await user.click(screen.getByText(/send specification/i));
    
    await waitFor(() => {
      expect(screen.getByText(/error sending specification/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    render(<KamunityRoomGenerator />);
    
    // Generate spec first
    await user.type(screen.getByLabelText(/who is this room for/i), 'Developers');
    await user.type(screen.getByLabelText(/what do you want to achieve/i), 'Better collaboration');
    await user.click(screen.getByText(/generate room specification/i));
    await user.click(screen.getByText(/looks good/i));
    
    // Enter invalid email
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email address/i);
      return user.type(emailInput, 'invalid-email');
    });
    
    await user.click(screen.getByText(/send specification/i));
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  test('handles missing room data gracefully', () => {
    const incompleteProps = {
      roomData: { ...mockRoomData, detailedSpec: undefined },
      onBack: jest.fn(),
      onEnhance: jest.fn()
    };

    render(<GeneratedRoom {...incompleteProps} />);
    
    // Should still render basic structure
    expect(screen.getByText(/test focus room/i)).toBeInTheDocument();
    expect(screen.getByText(/join room/i)).toBeInTheDocument();
  });
});
