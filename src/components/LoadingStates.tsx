'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

// Full page loading state
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// Section loading state
export function SectionLoader({ height = '200px' }: { height?: string }) {
  return (
    <div 
      className="flex items-center justify-center bg-gray-50 rounded-lg"
      style={{ minHeight: height }}
    >
      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
    </div>
  )
}

// Inline loading state
export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  return (
    <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin inline-block`} />
  )
}

// Button loading state
export function ButtonLoader({ children, loading, ...props }: any) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

// Skeleton loaders for content
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Chat message skeleton
export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
          <div className={`max-w-[70%] ${i % 2 === 0 ? 'order-2' : ''}`}>
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Loading overlay
export function LoadingOverlay({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return <>{children}</>
  
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    </div>
  )
}
