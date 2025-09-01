/**
 * Production Email Debugging System
 * Tracks email delivery attempts, failures, and provides diagnostic tools
 */

interface EmailAttempt {
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  method: 'emailjs' | 'console_simulation' | 'failed';
  success: boolean;
  error?: string;
  environment: string;
  userAgent?: string;
}

class EmailDebugger {
  private storageKey = 'kamunity-email-debug-logs';
  private maxLogs = 100;

  // Log email attempt
  logAttempt(attempt: Omit<EmailAttempt, 'id' | 'timestamp' | 'environment' | 'userAgent'>) {
    if (typeof window === 'undefined') return;

    const logEntry: EmailAttempt = {
      ...attempt,
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      userAgent: navigator.userAgent.substring(0, 100)
    };

    try {
      const logs = this.getLogs();
      logs.unshift(logEntry);
      
      // Keep only recent logs
      if (logs.length > this.maxLogs) {
        logs.splice(this.maxLogs);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs));
      
      // Also log to console for immediate visibility
      console.log(`📧 Email Debug:`, {
        success: logEntry.success,
        method: logEntry.method,
        to: logEntry.to.split('@')[1] || 'unknown',
        timestamp: logEntry.timestamp
      });

    } catch (error) {
      console.warn('Failed to log email attempt:', error);
    }
  }

  // Get all logged attempts
  getLogs(): EmailAttempt[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to retrieve email logs:', error);
      return [];
    }
  }

  // Get failure analysis
  getFailureAnalysis(): {
    totalAttempts: number;
    successRate: number;
    failuresByMethod: Record<string, number>;
    recentFailures: EmailAttempt[];
    commonErrors: string[];
  } {
    const logs = this.getLogs();
    const failures = logs.filter(log => !log.success);
    
    const failuresByMethod = failures.reduce((acc, failure) => {
      acc[failure.method] = (acc[failure.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonErrors = failures
      .map(f => f.error)
      .filter(Boolean)
      .reduce((acc, error) => {
        acc[error!] = (acc[error!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalAttempts: logs.length,
      successRate: logs.length > 0 ? (logs.filter(l => l.success).length / logs.length) * 100 : 0,
      failuresByMethod,
      recentFailures: failures.slice(0, 10),
      commonErrors: Object.entries(commonErrors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([error]) => error)
    };
  }

  // Clear logs
  clearLogs() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
    console.log('📧 Email debug logs cleared');
  }

  // Export logs for analysis
  exportLogs(): string {
    const logs = this.getLogs();
    const analysis = this.getFailureAnalysis();
    
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      analysis,
      logs
    }, null, 2);
  }

  // Check EmailJS configuration
  checkEmailJSConfig(): {
    configured: boolean;
    missingVars: string[];
    recommendations: string[];
  } {
    const requiredVars = ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_USER_ID'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    const recommendations = [];
    if (missingVars.length > 0) {
      recommendations.push('Add missing EmailJS environment variables to .env.local');
      recommendations.push('Verify EmailJS account is active and templates are published');
    }
    
    if (missingVars.length === 0) {
      recommendations.push('Test EmailJS configuration with a simple email');
      recommendations.push('Check EmailJS dashboard for delivery statistics');
    }

    return {
      configured: missingVars.length === 0,
      missingVars,
      recommendations
    };
  }
}

// Export singleton instance
export const emailDebugger = new EmailDebugger();

// Helper function for API routes
export function logEmailAttempt(
  to: string,
  subject: string,
  method: EmailAttempt['method'],
  success: boolean,
  error?: string
) {
  // This will be called from API routes, so we need to handle server-side
  const logData = {
    timestamp: new Date().toISOString(),
    to: to.includes('@') ? to.split('@')[1] : 'unknown',
    subject: subject.substring(0, 50),
    method,
    success,
    error: error?.substring(0, 200),
    environment: process.env.NODE_ENV || 'unknown'
  };

  console.log('📧 Email Attempt:', logData);
  
  // In production, you might want to send this to a logging service
  // For now, we'll just console log for server-side visibility
}
