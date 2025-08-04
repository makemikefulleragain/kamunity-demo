import React from 'react'
import { cn } from '@/lib/utils'

// Heading component with semantic levels
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  variant?: 'display' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4'
  color?: 'default' | 'muted' | 'primary' | 'secondary'
  children: React.ReactNode
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ 
    className, 
    level = 1, 
    variant,
    color = 'default',
    children,
    ...props 
  }, ref) => {
    // Auto-determine variant based on level if not specified
    const resolvedVariant = variant || {
      1: 'heading-1',
      2: 'heading-2', 
      3: 'heading-3',
      4: 'heading-4',
      5: 'heading-4',
      6: 'heading-4'
    }[level] as HeadingProps['variant']

    const variantClasses = {
      display: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
      'heading-1': 'text-heading-1',
      'heading-2': 'text-heading-2',
      'heading-3': 'text-heading-3', 
      'heading-4': 'text-heading-4'
    }

    const colorClasses = {
      default: 'text-neutral-900',
      muted: 'text-neutral-600',
      primary: 'text-primary-600',
      secondary: 'text-secondary-600'
    }

    const Component = `h${level}` as keyof JSX.IntrinsicElements

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          variantClasses[resolvedVariant!],
          colorClasses[color],
          className
        ),
        ...props
      },
      children
    )
  }
)

Heading.displayName = "Heading"

// Text component for body text
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body-large' | 'body-base' | 'body-small' | 'caption'
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  as?: 'p' | 'span' | 'div'
  children: React.ReactNode
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ 
    className, 
    variant = 'body-base',
    color = 'default',
    weight = 'normal',
    as = 'p',
    children,
    ...props 
  }, ref) => {
    const variantClasses = {
      'body-large': 'text-body-large',
      'body-base': 'text-body-base',
      'body-small': 'text-body-small',
      'caption': 'text-caption'
    }

    const colorClasses = {
      default: 'text-neutral-800',
      muted: 'text-neutral-600',
      primary: 'text-primary-600',
      secondary: 'text-secondary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      error: 'text-error-600'
    }

    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    }

    return React.createElement(
      as,
      {
        ref,
        className: cn(
          variantClasses[variant],
          colorClasses[color],
          weightClasses[weight],
          className
        ),
        ...props
      },
      children
    )
  }
)

Text.displayName = "Text"

// Link component with proper accessibility
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'muted'
  underline?: 'always' | 'hover' | 'never'
  external?: boolean
  children: React.ReactNode
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    className, 
    variant = 'default',
    underline = 'hover',
    external = false,
    children,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'text-primary-600 hover:text-primary-700',
      primary: 'text-primary-600 hover:text-primary-700',
      secondary: 'text-secondary-600 hover:text-secondary-700',
      muted: 'text-neutral-600 hover:text-neutral-700'
    }

    const underlineClasses = {
      always: 'underline',
      hover: 'hover:underline',
      never: 'no-underline'
    }

    return (
      <a
        ref={ref}
        className={cn(
          'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded-sm',
          variantClasses[variant],
          underlineClasses[underline],
          className
        )}
        {...(external && {
          target: '_blank',
          rel: 'noopener noreferrer'
        })}
        {...props}
      >
        {children}
        {external && (
          <span className="sr-only"> (opens in new tab)</span>
        )}
      </a>
    )
  }
)

Link.displayName = "Link"

export { Heading, Text, Link }
