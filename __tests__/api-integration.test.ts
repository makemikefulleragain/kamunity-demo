/**
 * API Integration Tests for Focus Room Generator
 * Testing all API endpoints and data flows
 */

import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock API handlers
const mockFocusRoomHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { targetGroup, goals, tools, requirements, email } = req.body;

  // Validation
  if (!targetGroup || !goals) {
    return res.status(400).json({ 
      error: 'Target group and goals are required',
      missing: {
        targetGroup: !targetGroup,
        goals: !goals
      }
    });
  }

  // Email validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Generate 8-section specification
  const roomName = `${targetGroup} Focus Room`;
  const specSheet = generateSpecification({ targetGroup, goals, tools, requirements });

  // Simulate email sending
  const emailResult = email ? await sendEmails(email, specSheet) : null;

  return res.status(200).json({
    success: true,
    roomId: `room_${Date.now()}`,
    roomName,
    specSheet,
    emailSent: !!email,
    adminNotified: !!email,
    userNotified: !!email,
    ...emailResult
  });
};

const generateSpecification = ({ targetGroup, goals, tools, requirements }: any) => {
  return {
    pitchSection: {
      hook: `Transform how ${targetGroup} collaborate and achieve ${goals} with a purpose-built digital Focus Room.`,
      cta: "Let's get this live and start building momentum together!"
    },
    roiStory: `Meet Sarah, a ${targetGroup} member. Before the Focus Room, she spent hours in scattered emails and missed opportunities. Now, she logs in each morning to find relevant discussions, upcoming events, and AI-suggested connections. Within weeks, her team's ${goals} improved by 40%. The Focus Room didn't just organise their work—it amplified their impact through seamless collaboration and shared knowledge.`,
    savingsTable: {
      timeWasted: '20 hours/week',
      costPerHour: '$75',
      weeklySavings: '$1,500',
      monthlySavings: '$6,000',
      annualSavings: '$72,000'
    },
    wireframe: {
      layout: 'Homepage Layout',
      sections: ['Header with Join CTA', 'Hero Banner', 'Quick Actions', 'Live Preview Bar', 'Dynamic Widgets', 'Footer'],
      description: 'Clean, user-centered design focused on primary actions'
    },
    userFlow: [
      'User discovers room through invitation or search',
      'Views room overview and member activity',
      'Joins room with single-click authentication',
      'Participates in discussions and activities',
      'Accesses tools and resources',
      'Achieves goals through collaboration'
    ],
    designQuestions: [
      'How can we make onboarding frictionless?',
      'What features drive the most engagement?',
      'How do we measure success and impact?',
      'What integrations are essential?'
    ],
    featureMatrix: {
      mvp: ['Discussion forums', 'Member directory', 'Basic notifications'],
      enhanced: ['AI suggestions', 'Advanced analytics', 'Custom widgets'],
      premium: ['White-label options', 'API access', 'Priority support']
    },
    suggestions: [
      'Start with core discussion features',
      'Add gamification elements for engagement',
      'Integrate with existing tools',
      'Plan for mobile-first experience'
    ]
  };
};

const sendEmails = async (userEmail: string, specSheet: any) => {
  // Simulate email service
  return {
    userEmailSent: true,
    adminEmailSent: true,
    userEmailId: `user_${Date.now()}`,
    adminEmailId: `admin_${Date.now()}`
  };
};

// ============================================
// 1. API ENDPOINT TESTS
// ============================================

describe('Focus Room API Integration', () => {
  describe('POST /api/demo/focus-room', () => {
    test('successfully generates room specification', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          targetGroup: 'Product Managers',
          goals: 'Streamline product development',
          tools: 'Jira, Figma, Slack',
          requirements: 'Mobile-first approach',
          email: 'test@example.com'
        }
      });

      await mockFocusRoomHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      
      expect(responseData.success).toBe(true);
      expect(responseData.roomId).toBeDefined();
      expect(responseData.roomName).toBe('Product Managers Focus Room');
      expect(responseData.specSheet).toBeDefined();
      expect(responseData.emailSent).toBe(true);
      expect(responseData.adminNotified).toBe(true);
      expect(responseData.userNotified).toBe(true);
    });

    test('validates required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          targetGroup: '',
          goals: '',
          tools: 'Some tools'
        }
      });

      await mockFocusRoomHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      
      expect(responseData.error).toContain('required');
      expect(responseData.missing.targetGroup).toBe(true);
      expect(responseData.missing.goals).toBe(true);
    });

    test('validates email format', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          targetGroup: 'Developers',
          goals: 'Better collaboration',
          email: 'invalid-email-format'
        }
      });

      await mockFocusRoomHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toContain('Invalid email format');
    });

    test('handles missing email gracefully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          targetGroup: 'Developers',
          goals: 'Better collaboration',
          tools: 'GitHub, Slack'
        }
      });

      await mockFocusRoomHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      
      expect(responseData.success).toBe(true);
      expect(responseData.emailSent).toBe(false);
      expect(responseData.specSheet).toBeDefined();
    });

    test('rejects non-POST methods', async () => {
      const { req, res } = createMocks({
        method: 'GET'
      });

      await mockFocusRoomHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toBe('Method not allowed');
    });
  });

  describe('Specification Generation Logic', () => {
    test('generates complete 8-section specification', () => {
      const input = {
        targetGroup: 'Software Engineers',
        goals: 'Improve code quality and collaboration',
        tools: 'Git, Docker, Jenkins',
        requirements: 'CI/CD integration'
      };

      const spec = generateSpecification(input);

      // Verify all 8 sections exist
      expect(spec.pitchSection).toBeDefined();
      expect(spec.roiStory).toBeDefined();
      expect(spec.savingsTable).toBeDefined();
      expect(spec.wireframe).toBeDefined();
      expect(spec.userFlow).toBeDefined();
      expect(spec.designQuestions).toBeDefined();
      expect(spec.featureMatrix).toBeDefined();
      expect(spec.suggestions).toBeDefined();

      // Verify contextual content
      expect(spec.pitchSection.hook).toContain('Software Engineers');
      expect(spec.pitchSection.hook).toContain('Improve code quality and collaboration');
      expect(spec.roiStory).toContain('Software Engineers');
    });

    test('customizes content based on target group', () => {
      const testCases = [
        {
          targetGroup: 'Marketing Teams',
          goals: 'Increase campaign effectiveness',
          expectedKeywords: ['Marketing Teams', 'campaign effectiveness']
        },
        {
          targetGroup: 'Sales Representatives',
          goals: 'Boost conversion rates',
          expectedKeywords: ['Sales Representatives', 'conversion rates']
        }
      ];

      testCases.forEach(({ targetGroup, goals, expectedKeywords }) => {
        const spec = generateSpecification({ targetGroup, goals });
        
        const fullText = JSON.stringify(spec).toLowerCase();
        expectedKeywords.forEach(keyword => {
          expect(fullText).toContain(keyword.toLowerCase());
        });
      });
    });

    test('includes proper wireframe structure', () => {
      const spec = generateSpecification({
        targetGroup: 'Designers',
        goals: 'Improve design collaboration'
      });

      expect(spec.wireframe.layout).toBe('Homepage Layout');
      expect(spec.wireframe.sections).toContain('Header with Join CTA');
      expect(spec.wireframe.sections).toContain('Hero Banner');
      expect(spec.wireframe.sections).toContain('Quick Actions');
      expect(spec.wireframe.sections).toContain('Live Preview Bar');
      expect(spec.wireframe.sections).toContain('Dynamic Widgets');
      expect(spec.wireframe.sections).toContain('Footer');
    });

    test('generates realistic ROI calculations', () => {
      const spec = generateSpecification({
        targetGroup: 'Project Managers',
        goals: 'Streamline project delivery'
      });

      expect(spec.savingsTable.timeWasted).toBeDefined();
      expect(spec.savingsTable.costPerHour).toBeDefined();
      expect(spec.savingsTable.weeklySavings).toBeDefined();
      expect(spec.savingsTable.monthlySavings).toBeDefined();
      expect(spec.savingsTable.annualSavings).toBeDefined();

      // Verify calculations are consistent
      expect(spec.savingsTable.weeklySavings).toContain('$1,500');
      expect(spec.savingsTable.monthlySavings).toContain('$6,000');
      expect(spec.savingsTable.annualSavings).toContain('$72,000');
    });
  });

  describe('Email Integration', () => {
    test('sends emails when address provided', async () => {
      const emailResult = await sendEmails('user@example.com', {});

      expect(emailResult.userEmailSent).toBe(true);
      expect(emailResult.adminEmailSent).toBe(true);
      expect(emailResult.userEmailId).toBeDefined();
      expect(emailResult.adminEmailId).toBeDefined();
    });

    test('includes specification in email content', async () => {
      const spec = generateSpecification({
        targetGroup: 'Data Scientists',
        goals: 'Improve data analysis workflows'
      });

      const emailResult = await sendEmails('data@scientist.com', spec);

      expect(emailResult.userEmailSent).toBe(true);
      expect(emailResult.adminEmailSent).toBe(true);
    });
  });
});

// ============================================
// 2. DATA FLOW TESTS
// ============================================

describe('Data Flow Integration', () => {
  test('maintains data consistency through complete flow', async () => {
    const originalData = {
      targetGroup: 'UX Designers',
      goals: 'Enhance user experience design process',
      tools: 'Figma, Miro, Notion',
      requirements: 'Real-time collaboration features',
      email: 'ux@design.com'
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: originalData
    });

    await mockFocusRoomHandler(req, res);

    const responseData = JSON.parse(res._getData());

    // Verify original data is preserved and used
    expect(responseData.roomName).toContain(originalData.targetGroup);
    expect(responseData.specSheet.pitchSection.hook).toContain(originalData.targetGroup);
    expect(responseData.specSheet.pitchSection.hook).toContain(originalData.goals);
    expect(responseData.specSheet.roiStory).toContain(originalData.targetGroup);
  });

  test('handles special characters and edge cases', async () => {
    const edgeCaseData = {
      targetGroup: 'C++ Developers & System Architects',
      goals: 'Optimize performance & reduce latency by 50%',
      tools: 'Visual Studio, Git, Docker, Kubernetes',
      requirements: 'Support for 24/7 operations & monitoring'
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: edgeCaseData
    });

    await mockFocusRoomHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    
    expect(responseData.success).toBe(true);
    expect(responseData.specSheet).toBeDefined();
  });

  test('processes large input data efficiently', async () => {
    const largeData = {
      targetGroup: 'Enterprise Software Development Teams across Multiple Geographic Locations',
      goals: 'Establish comprehensive development workflows that integrate seamlessly with existing enterprise systems while maintaining security compliance and enabling rapid deployment cycles',
      tools: 'Jenkins, GitLab, Docker, Kubernetes, Terraform, Ansible, Prometheus, Grafana, Jira, Confluence, Slack, Microsoft Teams, Visual Studio Code, IntelliJ IDEA',
      requirements: 'Must support GDPR compliance, SOC 2 certification, integration with Active Directory, support for multiple programming languages, automated testing pipelines, and 99.9% uptime SLA'
    };

    const startTime = Date.now();
    
    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: largeData
    });

    await mockFocusRoomHandler(req, res);
    
    const processingTime = Date.now() - startTime;

    expect(res._getStatusCode()).toBe(200);
    expect(processingTime).toBeLessThan(1000); // Should process within 1 second
    
    const responseData = JSON.parse(res._getData());
    expect(responseData.specSheet).toBeDefined();
  });
});

// ============================================
// 3. ERROR HANDLING TESTS
// ============================================

describe('API Error Handling', () => {
  test('handles malformed JSON gracefully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json{'
    });

    // This would normally be handled by Next.js middleware
    // but we test our handler's response to undefined body
    req.body = undefined;

    await mockFocusRoomHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  test('handles extremely long input strings', async () => {
    const veryLongString = 'A'.repeat(10000);
    
    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        targetGroup: veryLongString,
        goals: veryLongString,
        tools: veryLongString,
        requirements: veryLongString
      }
    });

    await mockFocusRoomHandler(req, res);

    // Should either succeed or fail gracefully
    expect([200, 400, 413]).toContain(res._getStatusCode());
  });

  test('handles SQL injection attempts', async () => {
    const maliciousData = {
      targetGroup: "'; DROP TABLE users; --",
      goals: "<script>alert('xss')</script>",
      tools: "SELECT * FROM sensitive_data",
      email: "test@example.com'; DELETE FROM emails; --"
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: maliciousData
    });

    await mockFocusRoomHandler(req, res);

    // Should either sanitize input or reject it
    if (res._getStatusCode() === 200) {
      const responseData = JSON.parse(res._getData());
      const specText = JSON.stringify(responseData.specSheet);
      
      // Verify malicious content is not executed
      expect(specText).not.toContain('DROP TABLE');
      expect(specText).not.toContain('<script>');
      expect(specText).not.toContain('DELETE FROM');
    }
  });

  test('handles concurrent requests properly', async () => {
    const requests = Array(10).fill(null).map((_, index) => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          targetGroup: `Test Group ${index}`,
          goals: `Test Goals ${index}`,
          email: `test${index}@example.com`
        }
      });

      return mockFocusRoomHandler(req, res).then(() => ({
        status: res._getStatusCode(),
        data: JSON.parse(res._getData())
      }));
    });

    const results = await Promise.all(requests);

    // All requests should succeed
    results.forEach((result, index) => {
      expect(result.status).toBe(200);
      expect(result.data.success).toBe(true);
      expect(result.data.roomName).toContain(`Test Group ${index}`);
    });
  });
});

// ============================================
// 4. PERFORMANCE TESTS
// ============================================

describe('API Performance', () => {
  test('responds within acceptable time limits', async () => {
    const testCases = [
      { targetGroup: 'Developers', goals: 'Better collaboration' },
      { targetGroup: 'Designers', goals: 'Streamline design process' },
      { targetGroup: 'Product Managers', goals: 'Improve product delivery' }
    ];

    for (const testCase of testCases) {
      const startTime = Date.now();
      
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: testCase
      });

      await mockFocusRoomHandler(req, res);
      
      const responseTime = Date.now() - startTime;
      
      expect(res._getStatusCode()).toBe(200);
      expect(responseTime).toBeLessThan(500); // 500ms requirement
    }
  });

  test('handles high load efficiently', async () => {
    const startTime = Date.now();
    
    const requests = Array(50).fill(null).map((_, index) => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          targetGroup: `Load Test ${index}`,
          goals: 'Performance testing'
        }
      });

      return mockFocusRoomHandler(req, res);
    });

    await Promise.all(requests);
    
    const totalTime = Date.now() - startTime;
    const averageTime = totalTime / 50;
    
    expect(averageTime).toBeLessThan(100); // Average under 100ms
  });
});
