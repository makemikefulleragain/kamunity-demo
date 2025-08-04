'use client';

import React from 'react';
import Link from 'next/link';
import { Text, Heading, Button, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

// Character expressions for different contexts
const characterExpressions = {
  welcome: '👋',
  celebrating: '🎉',
  encouraging: '🌟',
  thinking: '🤔',
  excited: '🚀',
  friendly: '😊',
  helpful: '💡',
  success: '✨',
  empty: '🌱',
  loading: '⏳',
  confused: '🤔',
  worried: '😅'
} as const;

type CharacterExpression = keyof typeof characterExpressions;

interface KaiCharacterProps {
  expression?: CharacterExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  title?: string;
  actionButton?: {
    text: string;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  variant?: 'default' | 'card' | 'inline' | 'celebration';
}

const KaiCharacter: React.FC<KaiCharacterProps> = ({
  expression = 'friendly',
  size = 'md',
  message,
  title,
  actionButton,
  className,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
    xl: 'w-24 h-24 text-4xl'
  };

  const CharacterAvatar = () => (
    <div className={cn(
      'bg-primary-100 rounded-full flex items-center justify-center',
      sizeClasses[size]
    )}>
      <span 
        className="select-none" 
        role="img" 
        aria-label={`Kai feeling ${expression}`}
      >
        {characterExpressions[expression]}
      </span>
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <CharacterAvatar />
        {(title || message) && (
          <div>
            {title && (
              <Text variant="body-small" weight="semibold" className="text-primary-700">
                {title}
              </Text>
            )}
            {message && (
              <Text variant="body-small" color="muted">
                {message}
              </Text>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'celebration') {
    return (
      <div className={cn(
        'text-center p-8 bg-gradient-to-r from-success-50 to-primary-50 rounded-2xl',
        className
      )}>
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CharacterAvatar />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning-400 rounded-full animate-bounce flex items-center justify-center">
              <span className="text-xs">🎊</span>
            </div>
          </div>
        </div>
        {title && (
          <Heading level={3} className="mb-2 text-success-700">
            {title}
          </Heading>
        )}
        {message && (
          <Text className="mb-4 max-w-md mx-auto text-success-600">
            {message}
          </Text>
        )}
        {actionButton && (
          actionButton.href ? (
            <Link href={actionButton.href}>
              <Button
                variant={actionButton.variant || 'primary'}
                className="mt-2"
              >
                {actionButton.text}
              </Button>
            </Link>
          ) : (
            <Button
              variant={actionButton.variant || 'primary'}
              onClick={actionButton.onClick}
              className="mt-2"
            >
              {actionButton.text}
            </Button>
          )
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={cn('text-center', className)}>
        <CardContent className="p-8">
          <div className="flex justify-center mb-4">
            <CharacterAvatar />
          </div>
          {title && (
            <Heading level={3} className="mb-2 text-primary-700">
              {title}
            </Heading>
          )}
          {message && (
            <Text color="muted" className="mb-4 max-w-md mx-auto">
              {message}
            </Text>
          )}
          {actionButton && (
            actionButton.href ? (
              <Link href={actionButton.href}>
                <Button
                  variant={actionButton.variant || 'primary'}
                >
                  {actionButton.text}
                </Button>
              </Link>
            ) : (
              <Button
                variant={actionButton.variant || 'primary'}
                onClick={actionButton.onClick}
              >
                {actionButton.text}
              </Button>
            )
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={cn('text-center', className)}>
      <div className="flex justify-center mb-4">
        <CharacterAvatar />
      </div>
      {title && (
        <Heading level={3} className="mb-2 text-primary-700">
          {title}
        </Heading>
      )}
      {message && (
        <Text color="muted" className="mb-4 max-w-md mx-auto">
          {message}
        </Text>
      )}
      {actionButton && (
        actionButton.href ? (
          <Link href={actionButton.href}>
            <Button
              variant={actionButton.variant || 'primary'}
            >
              {actionButton.text}
            </Button>
          </Link>
        ) : (
          <Button
            variant={actionButton.variant || 'primary'}
            onClick={actionButton.onClick}
          >
            {actionButton.text}
          </Button>
        )
      )}
    </div>
  );
};

export default KaiCharacter;
export type { CharacterExpression, KaiCharacterProps };
