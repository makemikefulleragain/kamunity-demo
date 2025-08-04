import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Handles conditional classes and deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Accessibility utilities for consistent implementation
 */
export const a11y = {
  // Focus styles for interactive elements
  focusRing: "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  
  // Screen reader only text
  srOnly: "sr-only",
  
  // Common ARIA labels
  ariaLabels: {
    navigation: "Main navigation",
    search: "Search content", 
    userMenu: "User account menu",
    close: "Close",
    menu: "Menu",
    loading: "Loading content",
  },
  
  // Color contrast ratios (WCAG AA compliant)
  contrastRatios: {
    normal: 4.5,
    large: 3.0,
    graphical: 3.0,
  }
} as const

/**
 * Animation utilities for consistent motion design
 */
export const animations = {
  // Standard durations
  duration: {
    fast: "150ms",
    normal: "200ms", 
    slow: "300ms",
  },
  
  // Easing functions
  easing: {
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  }
} as const

/**
 * Spacing utilities following 8px grid system
 */
export const spacing = {
  // Component spacing
  component: {
    xs: "0.5rem",   // 8px
    sm: "1rem",     // 16px
    md: "1.5rem",   // 24px
    lg: "2rem",     // 32px
    xl: "3rem",     // 48px
    "2xl": "4rem",  // 64px
  },
  
  // Layout spacing
  layout: {
    xs: "1rem",     // 16px
    sm: "2rem",     // 32px
    md: "4rem",     // 64px
    lg: "6rem",     // 96px
    xl: "8rem",     // 128px
  }
} as const
