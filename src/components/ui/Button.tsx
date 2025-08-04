import React from 'react'
import { cn, a11y } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    ...props 
  }, ref) => {
    const baseClasses = [
      // Base styles
      "inline-flex items-center justify-center font-medium transition-all duration-200",
      "rounded-button shadow-button",
      // Focus styles for accessibility
      a11y.focusRing,
      // Disabled styles
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
    ].join(" ")

    const variants = {
      primary: [
        "bg-primary-500 hover:bg-primary-600 active:bg-primary-700",
        "text-white border border-transparent",
        "shadow-sm hover:shadow-md"
      ].join(" "),
      
      secondary: [
        "bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700", 
        "text-white border border-transparent",
        "shadow-sm hover:shadow-md"
      ].join(" "),
      
      outline: [
        "bg-transparent hover:bg-primary-50 active:bg-primary-100",
        "text-primary-600 border-2 border-primary-500",
        "hover:border-primary-600 active:border-primary-700"
      ].join(" "),
      
      ghost: [
        "bg-transparent hover:bg-neutral-100 active:bg-neutral-200",
        "text-neutral-700 border border-transparent"
      ].join(" "),
      
      danger: [
        "bg-error-500 hover:bg-error-600 active:bg-error-700",
        "text-white border border-transparent",
        "shadow-sm hover:shadow-md"
      ].join(" ")
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2.5 text-body-base gap-2", 
      lg: "px-6 py-3 text-body-large gap-2.5"
    }

    const isDisabled = disabled || loading

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        <span className={loading ? "opacity-0" : ""}>
          {children}
        </span>
        
        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
