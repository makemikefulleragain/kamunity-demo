'use client';

import { useEffect } from 'react';
import { Container, Section, Heading, Text } from '@/components/ui';
import KaiCharacter from '@/components/KaiCharacter';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Section spacing="xl" className="min-h-screen flex items-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <KaiCharacter
            variant="card"
            expression="worried"
            size="xl"
            title="😅 Oops! Something went wrong"
            message="I encountered an unexpected hiccup while trying to load this page. Don't worry - these things happen sometimes, and I'm here to help you get back on track!"
            actionButton={{
              text: "🔄 Try Again",
              onClick: reset,
              variant: "primary"
            }}
          />
          
          <div className="mt-8 space-y-4">
            <Text variant="body-large" color="muted">
              Technical glitches are like rainy days - they pass quickly and make us appreciate the sunshine even more! ☀️
            </Text>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <Text variant="body-small" color="muted" className="font-mono">
                {error.message || 'An unexpected error occurred'}
              </Text>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button 
                onClick={reset}
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                🔄 Try Again
              </button>
              <a 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
              >
                🏠 Go Home
              </a>
              <a 
                href="/chat"
                className="inline-flex items-center px-6 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
              >
                💬 Get Help
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
