/**
 * Console warning suppression for demo environment
 * Suppresses non-critical warnings that don't affect functionality
 */

export function suppressDemoWarnings() {
  if (typeof window === 'undefined') return;

  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  // Suppress specific non-critical warnings for demo
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    // Suppress Grammarly extension warnings
    if (message.includes('data-new-gr-c-s-check-loaded') || 
        message.includes('data-gr-ext-installed') ||
        message.includes('Extra attributes from the server')) {
      return;
    }
    
    // Allow other warnings through
    originalWarn.apply(console, args);
  };

  // Suppress React DevTools suggestion for demo
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Suppress React DevTools download suggestion
    if (message.includes('Download the React DevTools')) {
      return;
    }
    
    // Allow other errors through (important for debugging)
    originalError.apply(console, args);
  };
}

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  suppressDemoWarnings();
}
