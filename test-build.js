// Test script to verify localStorage fixes
const fs = require('fs');
const path = require('path');

// Read the analytics file
const analyticsPath = path.join(__dirname, 'src', 'lib', 'demo', 'analytics.ts');
const analyticsContent = fs.readFileSync(analyticsPath, 'utf8');

// Check for browser environment checks
const hasWindowCheck = analyticsContent.includes("typeof window !== 'undefined'");
const hasLocalStorageCheck = analyticsContent.includes("typeof localStorage !== 'undefined'");

console.log('Analytics file checks:');
console.log('- Has window check:', hasWindowCheck);
console.log('- Has localStorage check:', hasLocalStorageCheck);

// Check if getDemoAnalytics function exists
const hasGetDemoAnalytics = analyticsContent.includes('function getDemoAnalytics()');
console.log('- Has getDemoAnalytics function:', hasGetDemoAnalytics);

// Check if convenience functions use getDemoAnalytics
const usesGetDemoAnalytics = analyticsContent.includes('getDemoAnalytics().trackEvent');
console.log('- Convenience functions use getDemoAnalytics:', usesGetDemoAnalytics);

if (hasWindowCheck && hasLocalStorageCheck && hasGetDemoAnalytics && usesGetDemoAnalytics) {
  console.log('\n✅ All localStorage fixes are in place!');
  process.exit(0);
} else {
  console.log('\n❌ Some fixes may be missing');
  process.exit(1);
}
