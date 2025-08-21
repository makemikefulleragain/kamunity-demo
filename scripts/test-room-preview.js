/**
 * Room Preview Page Manual Test Runner
 * Validates core functionality is working
 */

const puppeteer = require('puppeteer');

async function testRoomPreview() {
  console.log('🧪 Testing Room Preview Page\n');
  console.log('=' .repeat(50));
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  const page = await browser.newPage();
  
  // Test rooms from golden threads
  const testRooms = [
    'room-env-1',
    'room-tech-1', 
    'room-health-1',
    'room-env-2',
    'room-social-1',
    'room-social-2',
    'room-edu-1',
    'room-social-3'
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const roomId of testRooms) {
    console.log(`\n📍 Testing Room: ${roomId}`);
    console.log('-'.repeat(40));
    
    try {
      // Navigate to room
      await page.goto(`http://localhost:3001/rooms/${roomId}`, {
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      
      // Check hero section
      const heroExists = await page.$('.bg-gradient-to-br') !== null;
      if (heroExists) {
        console.log('✅ Hero section loaded');
        passedTests++;
      } else {
        console.log('❌ Hero section missing');
        failedTests++;
      }
      
      // Check quick actions
      const quickActions = await page.$$('[data-testid="quick-action"]');
      if (quickActions.length === 5) {
        console.log('✅ 5 quick actions present');
        passedTests++;
      } else {
        console.log(`❌ Expected 5 quick actions, found ${quickActions.length}`);
        failedTests++;
      }
      
      // Test impact logging modal
      const logImpactBtn = await page.$('button:has-text("Log Impact")');
      if (logImpactBtn) {
        await logImpactBtn.click();
        await page.waitForTimeout(500);
        
        const modalVisible = await page.$('[role="dialog"]') !== null;
        if (modalVisible) {
          console.log('✅ Impact modal opens');
          passedTests++;
          
          // Close modal
          const closeBtn = await page.$('button:has-text("Cancel")');
          if (closeBtn) await closeBtn.click();
        } else {
          console.log('❌ Impact modal failed to open');
          failedTests++;
        }
      }
      
      // Check chat section
      const chatSection = await page.$('[data-testid="chat-section"]');
      if (chatSection) {
        console.log('✅ Chat section present');
        passedTests++;
      } else {
        console.log('❌ Chat section missing');
        failedTests++;
      }
      
    } catch (error) {
      console.log(`❌ Error testing room ${roomId}: ${error.message}`);
      failedTests++;
    }
  }
  
  // Test mobile responsiveness
  console.log('\n📱 Testing Mobile Responsiveness');
  console.log('-'.repeat(40));
  
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:3001/rooms/room-env-1');
  await page.waitForTimeout(1000);
  
  const mobileLayout = await page.evaluate(() => {
    const quickActions = document.querySelectorAll('[data-testid="quick-action"]');
    const firstAction = quickActions[0];
    const secondAction = quickActions[1];
    
    if (!firstAction || !secondAction) return false;
    
    const firstRect = firstAction.getBoundingClientRect();
    const secondRect = secondAction.getBoundingClientRect();
    
    // Check if stacked vertically
    return secondRect.top > firstRect.bottom;
  });
  
  if (mobileLayout) {
    console.log('✅ Mobile layout responsive');
    passedTests++;
  } else {
    console.log('❌ Mobile layout issues');
    failedTests++;
  }
  
  await browser.close();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests/(passedTests+failedTests)) * 100)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Room Preview Page is demo ready!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues.');
  }
}

// Run tests
testRoomPreview().catch(console.error);
