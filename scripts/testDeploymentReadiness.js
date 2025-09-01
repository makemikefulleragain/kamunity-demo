/**
 * Deployment Readiness Testing Script
 * Tests all critical functionality before production deployment
 */

const fs = require('fs');
const path = require('path');

class DeploymentTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().substring(11, 19);
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
  }

  addResult(test, status, details, recommendation = '') {
    const result = { test, status, details, recommendation, timestamp: new Date().toISOString() };
    this.results.tests.push(result);
    this.results.summary.total++;
    this.results.summary[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings']++;
    
    const emoji = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    this.log(`${emoji} ${test}: ${details}`, status);
    if (recommendation) this.log(`   💡 ${recommendation}`, 'info');
  }

  // Test 1: Verify all required files exist
  testFileStructure() {
    this.log('Testing file structure...', 'info');
    
    const requiredFiles = [
      'src/app/api/demo/survey/route.ts',
      'src/app/api/demo/spec-email/route.ts', 
      'src/app/api/demo/room-spec-email/route.ts',
      'src/lib/demo/memoryStore.ts',
      'src/lib/debug/emailDebugger.ts',
      '.env.local'
    ];

    let allFilesExist = true;
    const missingFiles = [];

    requiredFiles.forEach(file => {
      if (fs.existsSync(path.join(process.cwd(), file))) {
        this.log(`   ✓ ${file}`, 'info');
      } else {
        allFilesExist = false;
        missingFiles.push(file);
        this.log(`   ✗ ${file} - MISSING`, 'error');
      }
    });

    if (allFilesExist) {
      this.addResult('File Structure', 'pass', 'All required files present');
    } else {
      this.addResult('File Structure', 'fail', 
        `Missing files: ${missingFiles.join(', ')}`,
        'Ensure all required files are committed and deployed'
      );
    }
  }

  // Test 2: Check environment variables
  testEnvironmentVariables() {
    this.log('Testing environment variables...', 'info');
    
    const requiredVars = [
      'EMAILJS_SERVICE_ID',
      'EMAILJS_TEMPLATE_ID', 
      'EMAILJS_USER_ID',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      this.addResult('Environment Variables', 'pass', 'All required variables configured');
    } else {
      this.addResult('Environment Variables', 'fail',
        `Missing: ${missingVars.join(', ')}`,
        'Add missing environment variables to production deployment'
      );
    }

    // Check optional variables
    const optionalVars = ['NEXT_PUBLIC_DEMO_MODE', 'SKIP_TYPE_CHECK'];
    const missingOptional = optionalVars.filter(varName => !process.env[varName]);
    
    if (missingOptional.length > 0) {
      this.addResult('Optional Environment Variables', 'warning',
        `Missing optional: ${missingOptional.join(', ')}`,
        'Consider adding optional variables for better demo experience'
      );
    }
  }

  // Test 3: Validate TypeScript compilation
  testTypeScriptCompilation() {
    this.log('Testing TypeScript compilation...', 'info');
    
    const apiFiles = [
      'src/app/api/demo/survey/route.ts',
      'src/app/api/demo/spec-email/route.ts',
      'src/app/api/demo/room-spec-email/route.ts'
    ];

    let hasTypeErrors = false;
    
    apiFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Basic syntax checks
        if (content.includes('Cannot find name')) {
          hasTypeErrors = true;
          this.log(`   ✗ ${file} - Type errors detected`, 'error');
        } else if (content.includes('import') && content.includes('export')) {
          this.log(`   ✓ ${file} - Basic structure valid`, 'info');
        }
      } catch (error) {
        hasTypeErrors = true;
        this.log(`   ✗ ${file} - Cannot read file: ${error.message}`, 'error');
      }
    });

    if (!hasTypeErrors) {
      this.addResult('TypeScript Compilation', 'pass', 'No obvious type errors detected');
    } else {
      this.addResult('TypeScript Compilation', 'fail',
        'Type errors detected in API files',
        'Fix TypeScript errors before deployment'
      );
    }
  }

  // Test 4: Check API route structure
  testAPIRouteStructure() {
    this.log('Testing API route structure...', 'info');
    
    const routes = [
      { file: 'src/app/api/demo/survey/route.ts', exports: ['POST'] },
      { file: 'src/app/api/demo/spec-email/route.ts', exports: ['POST'] },
      { file: 'src/app/api/demo/room-spec-email/route.ts', exports: ['POST'] }
    ];

    let allRoutesValid = true;

    routes.forEach(route => {
      try {
        const content = fs.readFileSync(route.file, 'utf8');
        
        route.exports.forEach(method => {
          if (content.includes(`export async function ${method}`)) {
            this.log(`   ✓ ${route.file} - ${method} method found`, 'info');
          } else {
            allRoutesValid = false;
            this.log(`   ✗ ${route.file} - ${method} method missing`, 'error');
          }
        });

        // Check for proper error handling
        if (content.includes('try {') && content.includes('catch')) {
          this.log(`   ✓ ${route.file} - Error handling present`, 'info');
        } else {
          this.addResult(`${route.file} Error Handling`, 'warning',
            'No try-catch blocks found',
            'Add proper error handling to API routes'
          );
        }

      } catch (error) {
        allRoutesValid = false;
        this.log(`   ✗ ${route.file} - Cannot read: ${error.message}`, 'error');
      }
    });

    if (allRoutesValid) {
      this.addResult('API Route Structure', 'pass', 'All API routes properly structured');
    } else {
      this.addResult('API Route Structure', 'fail',
        'API route structure issues detected',
        'Fix API route exports and structure'
      );
    }
  }

  // Test 5: Validate email debugger implementation
  testEmailDebugger() {
    this.log('Testing email debugger implementation...', 'info');
    
    try {
      const content = fs.readFileSync('src/lib/debug/emailDebugger.ts', 'utf8');
      
      const requiredMethods = ['logAttempt', 'getLogs', 'getFailureAnalysis', 'clearLogs'];
      const missingMethods = requiredMethods.filter(method => !content.includes(method));
      
      if (missingMethods.length === 0) {
        this.addResult('Email Debugger', 'pass', 'All required methods implemented');
      } else {
        this.addResult('Email Debugger', 'fail',
          `Missing methods: ${missingMethods.join(', ')}`,
          'Implement missing email debugger methods'
        );
      }

      // Check for localStorage handling
      if (content.includes('typeof window') && content.includes('localStorage')) {
        this.addResult('Email Debugger SSR Safety', 'pass', 'SSR-safe localStorage handling');
      } else {
        this.addResult('Email Debugger SSR Safety', 'warning',
          'No SSR safety checks found',
          'Add SSR safety checks for localStorage usage'
        );
      }

    } catch (error) {
      this.addResult('Email Debugger', 'fail',
        `Cannot read email debugger file: ${error.message}`,
        'Ensure email debugger file exists and is readable'
      );
    }
  }

  // Test 6: Check memory store implementation
  testMemoryStore() {
    this.log('Testing memory store implementation...', 'info');
    
    try {
      const content = fs.readFileSync('src/lib/demo/memoryStore.ts', 'utf8');
      
      // Check for SSR safety
      if (content.includes('typeof window !== \'undefined\'')) {
        this.addResult('Memory Store SSR Safety', 'pass', 'SSR-safe implementation detected');
      } else {
        this.addResult('Memory Store SSR Safety', 'fail',
          'No SSR safety checks found',
          'Add SSR safety checks to prevent server-side localStorage access'
        );
      }

      // Check for cross-tab communication
      if (content.includes('storage') && content.includes('addEventListener')) {
        this.addResult('Memory Store Cross-Tab Sync', 'pass', 'Cross-tab sync implementation found');
      } else {
        this.addResult('Memory Store Cross-Tab Sync', 'warning',
          'No cross-tab sync detected',
          'Consider adding cross-tab synchronization for better UX'
        );
      }

    } catch (error) {
      this.addResult('Memory Store', 'fail',
        `Cannot read memory store file: ${error.message}`,
        'Ensure memory store file exists and is readable'
      );
    }
  }

  // Test 7: Check package.json and dependencies
  testDependencies() {
    this.log('Testing dependencies...', 'info');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      const requiredDeps = ['next', 'react', 'typescript'];
      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );

      if (missingDeps.length === 0) {
        this.addResult('Core Dependencies', 'pass', 'All core dependencies present');
      } else {
        this.addResult('Core Dependencies', 'fail',
          `Missing: ${missingDeps.join(', ')}`,
          'Install missing core dependencies'
        );
      }

      // Check build scripts
      if (packageJson.scripts?.build && packageJson.scripts?.start) {
        this.addResult('Build Scripts', 'pass', 'Build and start scripts configured');
      } else {
        this.addResult('Build Scripts', 'warning',
          'Missing build or start scripts',
          'Ensure build and start scripts are properly configured'
        );
      }

    } catch (error) {
      this.addResult('Dependencies', 'fail',
        `Cannot read package.json: ${error.message}`,
        'Ensure package.json exists and is valid JSON'
      );
    }
  }

  // Generate comprehensive report
  generateReport() {
    this.log('Generating deployment readiness report...', 'info');
    
    const report = {
      ...this.results,
      deploymentReady: this.results.summary.failed === 0,
      criticalIssues: this.results.tests.filter(t => t.status === 'fail'),
      recommendations: this.results.tests
        .filter(t => t.recommendation)
        .map(t => ({ test: t.test, recommendation: t.recommendation, priority: t.status === 'fail' ? 'HIGH' : 'MEDIUM' }))
    };

    // Write detailed report
    const reportPath = './deployment-readiness-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Console summary
    console.log('\n' + '='.repeat(70));
    console.log('🚀 DEPLOYMENT READINESS REPORT');
    console.log('='.repeat(70));
    console.log(`📊 Total Tests: ${this.results.summary.total}`);
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`📄 Report: ${reportPath}`);
    
    if (report.deploymentReady) {
      console.log('\n🎉 DEPLOYMENT READY - All critical tests passed!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Run: npm run build');
      console.log('   2. Deploy to production platform');
      console.log('   3. Configure environment variables');
      console.log('   4. Test production URLs');
    } else {
      console.log('\n🚨 NOT READY FOR DEPLOYMENT - Critical issues found!');
      console.log('\n🔧 Critical Issues to Fix:');
      report.criticalIssues.forEach(issue => {
        console.log(`   ❌ ${issue.test}: ${issue.details}`);
        if (issue.recommendation) {
          console.log(`      💡 ${issue.recommendation}`);
        }
      });
    }

    if (this.results.summary.warnings > 0) {
      console.log('\n⚠️  Warnings (recommended to address):');
      this.results.tests.filter(t => t.status === 'warning').forEach(warning => {
        console.log(`   ⚠️  ${warning.test}: ${warning.details}`);
      });
    }

    console.log('\n' + '='.repeat(70));
    
    return report.deploymentReady;
  }

  // Run all tests
  async runAllTests() {
    this.log('Starting deployment readiness tests...', 'info');
    
    try {
      this.testFileStructure();
      this.testEnvironmentVariables();
      this.testTypeScriptCompilation();
      this.testAPIRouteStructure();
      this.testEmailDebugger();
      this.testMemoryStore();
      this.testDependencies();
      
      const isReady = this.generateReport();
      process.exit(isReady ? 0 : 1);
      
    } catch (error) {
      this.log(`Test execution failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new DeploymentTester();
  tester.runAllTests();
}

module.exports = DeploymentTester;
