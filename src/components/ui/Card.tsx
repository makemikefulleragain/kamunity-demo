import React from 'react'
import { cn, a11y } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md',
    interactive = false,
    children,
    ...props 
  }, ref) => {
    const baseClasses = [
      "rounded-card transition-all duration-200",
      // Interactive states
      interactive && [
        "cursor-pointer",
        a11y.focusRing,
        "hover:shadow-card-hover"
      ].filter(Boolean).join(" ")
    ].filter(Boolean).join(" ")

    const variants = {
      default: [
        "bg-white shadow-card border border-neutral-200"
      ].join(" "),
      
      elevated: [
        "bg-white shadow-card-hover border border-neutral-100"
      ].join(" "),
      
      outlined: [
        "bg-white border-2 border-neutral-300 shadow-none"
      ].join(" "),
      
      ghost: [
        "bg-transparent border border-transparent shadow-none"
      ].join(" ")
    }

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6", 
      lg: "p-8"
    }

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          className
        )}
        ref={ref}
        {...(interactive && { 
          tabIndex: 0, 
          role: "button",
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              props.onClick?.(e as any)
            }
          }
        })}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

// Card sub-components for better composition
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-heading-4 font-semibold text-neutral-900", className)}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-body-base text-neutral-600", className)}
      {...props}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = "CardFooter"

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
}
