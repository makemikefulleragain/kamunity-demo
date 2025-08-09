const { execSync } = require('child_process');
const path = require('path');

// Simple Node.js script to run the TypeScript seeding
async function runSeed() {
  try {
    console.log('🌱 Running chat data seeding...');
    
    // Use ts-node to run the TypeScript file
    const scriptPath = path.join(__dirname, 'seedChats.ts');
    execSync(`npx ts-node ${scriptPath}`, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

runSeed();
