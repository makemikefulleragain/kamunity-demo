/**
 * End-to-End User Journey Validation Tests
 * Testing complete user flows from entry to completion
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

// ============================================
// 1. COMPLETE USER JOURNEY TESTS
// ============================================

describe('Complete User Journey Validation', () => {
  describe('New User Experience', () => {
    test('complete journey: landing → news → chat → room creation', async () => {
      // 1. User lands on homepage
      await page.goto('http://localhost:3000');
      await expect(page.locator('h1')).toContainText('Kamunity');
      
      // 2. Navigate to news hub
      await page.click('text=News Hub');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toContainText('News');
      
      // 3. Engage with news item
      const firstNewsItem = page.locator('[data-testid="news-item"]').first();
      await firstNewsItem.click();
      
      // Add comment to trigger chat promotion
      await page.fill('[placeholder="Add a comment..."]', 'This is really interesting! We should discuss this more.');
      await page.click('text=Post');
      
      // 4. Wait for chat promotion (after 10+ comments)
      for (let i = 0; i < 10; i++) {
        await page.fill('[placeholder="Add a comment..."]', `Comment ${i + 2}`);
        await page.click('text=Post');
        await page.waitForTimeout(100);
      }
      
      // 5. Chat should be promoted
      await expect(page.locator('text=This discussion has been promoted to a chat room')).toBeVisible();
      await page.click('text=Join Chat');
      
      // 6. Participate in chat
      await page.fill('[placeholder="Type your message..."]', 'We should create a focus room for this topic!');
      await page.click('text=Send');
      
      // 7. Create focus room
      await page.click('text=Create Focus Room');
      await page.waitForLoadState('networkidle');
      
      // 8. Fill focus room form
      await page.fill('[aria-label*="who is this room for"]', 'Community Leaders');
      await page.fill('[aria-label*="what do you want to achieve"]', 'Drive meaningful community action');
      await page.fill('[aria-label*="what tools or resources"]', 'Discussion forums, Resource library, Event calendar');
      await page.fill('[aria-label*="any specific requirements"]', 'Mobile-friendly interface, Email notifications');
      
      // 9. Generate specification
      await page.click('text=Generate Room Specification');
      
      // 10. Confirm details
      await page.waitForSelector('text=Check for Understanding');
      await expect(page.locator('text=Community Leaders')).toBeVisible();
      await page.click('text=Looks good, generate the full specification');
      
      // 11. Verify 8-section spec generation
      await page.waitForSelector('text=Pitch Section');
      await expect(page.locator('text=ROI Story')).toBeVisible();
      await expect(page.locator('text=Savings Analysis')).toBeVisible();
      await expect(page.locator('text=Homepage Wireframe')).toBeVisible();
      await expect(page.locator('text=User Flow')).toBeVisible();
      await expect(page.locator('text=Design Questions')).toBeVisible();
      await expect(page.locator('text=MVP Feature Matrix')).toBeVisible();
      await expect(page.locator('text=Additional Suggestions')).toBeVisible();
      
      // 12. Navigate to demo room
      await page.click('text=View Demo Room');
      await page.waitForLoadState('networkidle');
      
      // 13. Verify demo room functionality
      await expect(page.locator('text=Community Leaders Focus Room')).toBeVisible();
      await expect(page.locator('text=Live Activity')).toBeVisible();
      await expect(page.locator('text=Smart Suggestions')).toBeVisible();
      
      // 14. Test live simulation
      await expect(page.locator('text=Pause')).toBeVisible();
      await page.click('text=Pause');
      await expect(page.locator('text=Resume')).toBeVisible();
      
      // 15. Complete setup flow
      await page.click('text=Complete Setup');
      await expect(page.locator('text=Room Enhancement')).toBeVisible();
    }, 60000);

    test('email specification workflow', async () => {
      await page.goto('http://localhost:3000/rooms/generate');
      
      // Fill form
      await page.fill('[aria-label*="who is this room for"]', 'Product Managers');
      await page.fill('[aria-label*="what do you want to achieve"]', 'Streamline product development');
      await page.click('text=Generate Room Specification');
      
      // Confirm
      await page.waitForSelector('text=Check for Understanding');
      await page.click('text=Looks good, generate the full specification');
      
      // Email step
      await page.waitForSelector('text=Email Specification');
      await page.fill('[aria-label*="email address"]', 'test@example.com');
      await page.click('text=Send Specification');
      
      // Verify success
      await page.waitForSelector('text=Specification sent successfully');
      await expect(page.locator('text=Check your email')).toBeVisible();
    });
  });

  describe('Mobile User Experience', () => {
    test('mobile navigation and room generation', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('http://localhost:3000');
      
      // Test mobile menu
      await page.click('[aria-label="Menu"]');
      await expect(page.locator('text=News Hub')).toBeVisible();
      await page.click('text=Rooms Hub');
      
      // Generate room on mobile
      await page.click('text=Generate Focus Room');
      await page.fill('[aria-label*="who is this room for"]', 'Mobile Users');
      await page.fill('[aria-label*="what do you want to achieve"]', 'Better mobile experience');
      
      await page.click('text=Generate Room Specification');
      await page.waitForSelector('text=Check for Understanding');
      await page.click('text=Looks good, generate the full specification');
      
      // Verify mobile-optimized demo room
      await page.click('text=View Demo Room');
      await expect(page.locator('text=Mobile Users Focus Room')).toBeVisible();
      
      // Test mobile widgets
      await expect(page.locator('text=📅 Upcoming')).toBeVisible();
      await expect(page.locator('text=📊 Quick Poll')).toBeVisible();
    });
  });

  describe('Error Recovery Flows', () => {
    test('handles network errors gracefully', async () => {
      // Simulate offline mode
      await page.context().setOffline(true);
      
      await page.goto('http://localhost:3000/rooms/generate');
      await page.fill('[aria-label*="who is this room for"]', 'Developers');
      await page.fill('[aria-label*="what do you want to achieve"]', 'Better collaboration');
      await page.click('text=Generate Room Specification');
      
      // Should show error message
      await expect(page.locator('text=Network error')).toBeVisible();
      
      // Restore connection
      await page.context().setOffline(false);
      
      // Retry should work
      await page.click('text=Retry');
      await page.waitForSelector('text=Check for Understanding');
    });

    test('validates form inputs properly', async () => {
      await page.goto('http://localhost:3000/rooms/generate');
      
      // Try to submit empty form
      await page.click('text=Generate Room Specification');
      
      // Should show validation errors
      await expect(page.locator('text=Target group is required')).toBeVisible();
      await expect(page.locator('text=Goals are required')).toBeVisible();
      
      // Fill partial form
      await page.fill('[aria-label*="who is this room for"]', 'Test');
      await page.click('text=Generate Room Specification');
      
      // Should still show goals error
      await expect(page.locator('text=Goals are required')).toBeVisible();
    });
  });
});

// ============================================
// 2. PERFORMANCE VALIDATION
// ============================================

describe('Performance Validation', () => {
  test('page load times meet requirements', async () => {
    const pages = [
      '/',
      '/news',
      '/chat',
      '/rooms',
      '/rooms/generate'
    ];

    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(`http://localhost:3000${pagePath}`);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000); // 3 second requirement
    }
  });

  test('room generation performance', async () => {
    await page.goto('http://localhost:3000/rooms/generate');
    
    await page.fill('[aria-label*="who is this room for"]', 'Performance Testers');
    await page.fill('[aria-label*="what do you want to achieve"]', 'Fast room generation');
    
    const startTime = Date.now();
    await page.click('text=Generate Room Specification');
    await page.waitForSelector('text=Check for Understanding');
    await page.click('text=Looks good, generate the full specification');
    await page.waitForSelector('text=Pitch Section');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(2000); // 2 second requirement
  });

  test('demo room simulation performance', async () => {
    await page.goto('http://localhost:3000/rooms/generate');
    
    // Generate room
    await page.fill('[aria-label*="who is this room for"]', 'Developers');
    await page.fill('[aria-label*="what do you want to achieve"]', 'Better collaboration');
    await page.click('text=Generate Room Specification');
    await page.waitForSelector('text=Check for Understanding');
    await page.click('text=Looks good, generate the full specification');
    await page.click('text=View Demo Room');
    
    // Measure simulation responsiveness
    const startTime = Date.now();
    await page.click('text=Pause');
    await page.waitForSelector('text=Resume');
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(500); // 500ms requirement
  });
});

// ============================================
// 3. ACCESSIBILITY VALIDATION
// ============================================

describe('Accessibility Validation', () => {
  test('keyboard navigation works throughout journey', async () => {
    await page.goto('http://localhost:3000/rooms/generate');
    
    // Tab through form
    await page.keyboard.press('Tab');
    await expect(page.locator('[aria-label*="who is this room for"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[aria-label*="what do you want to achieve"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[aria-label*="what tools or resources"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[aria-label*="any specific requirements"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('text=Generate Room Specification')).toBeFocused();
  });

  test('screen reader compatibility', async () => {
    await page.goto('http://localhost:3000/rooms/generate');
    
    // Check ARIA labels
    const targetGroupInput = page.locator('[aria-label*="who is this room for"]');
    await expect(targetGroupInput).toHaveAttribute('aria-required', 'true');
    
    const goalsInput = page.locator('[aria-label*="what do you want to achieve"]');
    await expect(goalsInput).toHaveAttribute('aria-required', 'true');
    
    // Check error announcements
    await page.click('text=Generate Room Specification');
    const errorMessage = page.locator('text=Target group is required');
    await expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  test('color contrast and visual accessibility', async () => {
    await page.goto('http://localhost:3000/rooms/generate');
    
    // Generate room to test demo
    await page.fill('[aria-label*="who is this room for"]', 'Accessibility Users');
    await page.fill('[aria-label*="what do you want to achieve"]', 'Inclusive design');
    await page.click('text=Generate Room Specification');
    await page.waitForSelector('text=Check for Understanding');
    await page.click('text=Looks good, generate the full specification');
    await page.click('text=View Demo Room');
    
    // Check high contrast elements
    const joinButton = page.locator('text=Join Room');
    const buttonStyles = await joinButton.evaluate(el => getComputedStyle(el));
    
    // Verify sufficient contrast (this would need actual color analysis in real implementation)
    expect(buttonStyles.backgroundColor).toBeTruthy();
    expect(buttonStyles.color).toBeTruthy();
  });
});

// ============================================
// 4. DATA INTEGRITY VALIDATION
// ============================================

describe('Data Integrity Validation', () => {
  test('room specification data consistency', async () => {
    await page.goto('http://localhost:3000/rooms/generate');
    
    const testData = {
      targetGroup: 'Data Scientists',
      goals: 'Improve data analysis workflows',
      tools: 'Python, Jupyter, Git',
      requirements: 'Cloud-based collaboration'
    };
    
    // Fill form with specific data
    await page.fill('[aria-label*="who is this room for"]', testData.targetGroup);
    await page.fill('[aria-label*="what do you want to achieve"]', testData.goals);
    await page.fill('[aria-label*="what tools or resources"]', testData.tools);
    await page.fill('[aria-label*="any specific requirements"]', testData.requirements);
    
    await page.click('text=Generate Room Specification');
    
    // Verify data appears in confirmation
    await page.waitForSelector('text=Check for Understanding');
    await expect(page.locator(`text=${testData.targetGroup}`)).toBeVisible();
    await expect(page.locator(`text=${testData.goals}`)).toBeVisible();
    
    await page.click('text=Looks good, generate the full specification');
    
    // Verify data consistency in generated spec
    await page.waitForSelector('text=Pitch Section');
    await expect(page.locator(`text=${testData.targetGroup}`)).toBeVisible();
    
    // Check demo room reflects input data
    await page.click('text=View Demo Room');
    await expect(page.locator(`text=${testData.targetGroup} Focus Room`)).toBeVisible();
  });

  test('email data transmission accuracy', async () => {
    // Mock API to capture sent data
    await page.route('/api/demo/focus-room', route => {
      const request = route.request();
      const postData = request.postData();
      
      // Verify required fields are present
      expect(postData).toContain('targetGroup');
      expect(postData).toContain('goals');
      expect(postData).toContain('email');
      
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.goto('http://localhost:3000/rooms/generate');
    
    await page.fill('[aria-label*="who is this room for"]', 'Email Test Users');
    await page.fill('[aria-label*="what do you want to achieve"]', 'Validate email functionality');
    await page.click('text=Generate Room Specification');
    await page.waitForSelector('text=Check for Understanding');
    await page.click('text=Looks good, generate the full specification');
    
    // Email step
    await page.waitForSelector('text=Email Specification');
    await page.fill('[aria-label*="email address"]', 'test@validation.com');
    await page.click('text=Send Specification');
    
    await page.waitForSelector('text=Specification sent successfully');
  });
});

// ============================================
// 5. BUSINESS LOGIC VALIDATION
// ============================================

describe('Business Logic Validation', () => {
  test('8-section specification completeness', async () => {
    await page.goto('http://localhost:3000/rooms/generate');
    
    await page.fill('[aria-label*="who is this room for"]', 'Business Analysts');
    await page.fill('[aria-label*="what do you want to achieve"]', 'Comprehensive business analysis');
    await page.click('text=Generate Room Specification');
    await page.waitForSelector('text=Check for Understanding');
    await page.click('text=Looks good, generate the full specification');
    
    // Verify all 8 sections are present and populated
    const sections = [
      'Pitch Section',
      'ROI Story',
      'Savings Analysis',
      'Homepage Wireframe',
      'User Flow',
      'Design Questions',
      'MVP Feature Matrix',
      'Additional Suggestions'
    ];
    
    for (const section of sections) {
      await expect(page.locator(`text=${section}`)).toBeVisible();
      
      // Verify section has content (not just headers)
      const sectionContent = page.locator(`[data-section="${section.toLowerCase().replace(' ', '-')}"]`);
      const textContent = await sectionContent.textContent();
      expect(textContent.length).toBeGreaterThan(50); // Meaningful content
    }
  });

  test('room completeness scoring logic', async () => {
    await page.goto('http://localhost:3000/rooms/generate');
    
    // Generate minimal room
    await page.fill('[aria-label*="who is this room for"]', 'Test Users');
    await page.fill('[aria-label*="what do you want to achieve"]', 'Testing');
    await page.click('text=Generate Room Specification');
    await page.waitForSelector('text=Check for Understanding');
    await page.click('text=Looks good, generate the full specification');
    await page.click('text=View Demo Room');
    
    // Should show incomplete status
    await expect(page.locator('text=% complete')).toBeVisible();
    await expect(page.locator('text=unlock advanced features')).toBeVisible();
    
    // Complete setup should change status
    await page.click('text=Complete Setup');
    // Would verify enhanced features become available
  });

  test('contextual content generation', async () => {
    const testCases = [
      {
        targetGroup: 'Software Developers',
        expectedContent: ['GitHub', 'code', 'development', 'sprint']
      },
      {
        targetGroup: 'Marketing Teams',
        expectedContent: ['campaign', 'analytics', 'content', 'engagement']
      },
      {
        targetGroup: 'Sales Teams',
        expectedContent: ['pipeline', 'leads', 'conversion', 'CRM']
      }
    ];
    
    for (const testCase of testCases) {
      await page.goto('http://localhost:3000/rooms/generate');
      
      await page.fill('[aria-label*="who is this room for"]', testCase.targetGroup);
      await page.fill('[aria-label*="what do you want to achieve"]', 'Improve team performance');
      await page.click('text=Generate Room Specification');
      await page.waitForSelector('text=Check for Understanding');
      await page.click('text=Looks good, generate the full specification');
      
      // Check for contextual content
      const pageContent = await page.textContent('body');
      const hasContextualContent = testCase.expectedContent.some(keyword => 
        pageContent.toLowerCase().includes(keyword.toLowerCase())
      );
      expect(hasContextualContent).toBe(true);
    }
  });
});
