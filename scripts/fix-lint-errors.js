#!/usr/bin/env node

/**
 * Comprehensive lint error cleanup script for Kamunity deployment
 * Fixes common lint issues across all API route files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Common lint fixes to apply
const lintFixes = [
  // Fix unused Supabase imports
  {
    pattern: /import { createClient } from '@supabase\/supabase-js'\nimport { Database } from '@\/lib\/supabase\/types'\n\nconst supabase = createClient<Database>\(\n  process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\n  process\.env\.SUPABASE_SERVICE_ROLE_KEY!\n\)/g,
    replacement: `// import { createClient } from '@supabase/supabase-js'
// import { Database } from '@/lib/supabase/types'

// TODO: Implement actual Supabase integration
// const supabase = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// )`
  },
  
  // Fix any type declarations
  {
    pattern: /: any\[\]/g,
    replacement: ': unknown[]'
  },
  
  // Fix any type in filter functions
  {
    pattern: /\(([^:]+): any\)/g,
    replacement: '($1: unknown)'
  },
  
  // Comment out unused variables
  {
    pattern: /const (includePrivate|includeAssigned|includeCreated|sort|limit|offset) = /g,
    replacement: '// const $1 = '
  }
];

// Files to process
const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

function findRouteFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findRouteFiles(fullPath));
    } else if (item === 'route.ts') {
      files.push(fullPath);
    }
  }
  
  return files;
}

function applyLintFixes(filePath) {
  console.log(`Processing: ${path.relative(process.cwd(), filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const fix of lintFixes) {
    if (fix.pattern.test(content)) {
      content = content.replace(fix.pattern, fix.replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Applied fixes`);
  } else {
    console.log(`  - No changes needed`);
  }
}

function main() {
  console.log('🔧 Starting comprehensive lint cleanup...\n');
  
  try {
    // Find all route files
    const routeFiles = findRouteFiles(apiDir);
    console.log(`Found ${routeFiles.length} route files to process\n`);
    
    // Apply fixes to each file
    for (const file of routeFiles) {
      applyLintFixes(file);
    }
    
    console.log('\n✅ Lint cleanup completed!');
    console.log('\nRunning final lint check...');
    
    // Run lint check
    try {
      execSync('npx next lint --max-warnings 0', { stdio: 'inherit' });
      console.log('\n🎉 All lint errors fixed! Ready for deployment.');
    } catch (error) {
      console.log('\n⚠️  Some lint errors remain. Manual review needed.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { applyLintFixes, findRouteFiles };
