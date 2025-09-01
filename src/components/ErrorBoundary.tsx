'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactElement
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // Log to memory store for demo analytics
    if (typeof window !== 'undefined') {
      try {
        import('@/lib/demo/memoryStore').then(({ memoryStore }) => {
          memoryStore.track('error_boundary', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
          })
        })
      } catch (e) {
        console.error('Failed to log error to memory store:', e)
      }
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Oops! Something went wrong
              </h2>
              
              <p className="text-gray-600 text-center mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-mono text-red-600 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Page
                </button>
                
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go to Homepage
                </Link>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-6">
                If this problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary;

// Lightweight error boundary for smaller components
export function SimpleErrorBoundary({ 
  children, 
  fallback = <div className="p-4 text-center text-gray-500">Unable to load this section</div> 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactElement; 
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

// Hook for manual error reporting
export function useErrorReporting() {
  const reportError = (error: Error, context?: string) => {
    console.error('Manual error report:', error, context);
    
    try {
      if (typeof window !== 'undefined') {
        const errorEvent = {
          error: error.message,
          context: context || 'Manual report',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        };
        
        const existingErrors = JSON.parse(localStorage.getItem('kamunity_demo_errors') || '[]');
        existingErrors.push(errorEvent);
        localStorage.setItem('kamunity_demo_errors', JSON.stringify(existingErrors.slice(-10)));
      }
    } catch (trackingError) {
      console.warn('Error reporting failed:', trackingError);
    }
  };

  return { reportError };
}
