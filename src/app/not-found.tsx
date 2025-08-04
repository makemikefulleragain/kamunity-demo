import { Container, Section, Heading, Text } from '@/components/ui';
import KaiCharacter from '@/components/KaiCharacter';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Section spacing="xl" className="min-h-screen flex items-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <KaiCharacter
            variant="card"
            expression="confused"
            size="xl"
            title="🤔 Hmm, I can't find that page!"
            message="It looks like you've wandered into uncharted territory. Don't worry though - I'm here to help you find your way back to the good stuff!"
            actionButton={{
              text: "🏠 Take Me Home",
              href: "/",
              variant: "primary"
            }}
          />
          
          <div className="mt-8 space-y-4">
            <Text variant="body-large" color="muted">
              The page you're looking for might have been moved, deleted, or maybe it never existed. 
              But hey, that just means there's more to explore! 🌟
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link 
                href="/news"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                📰 Check The News
              </Link>
              <Link 
                href="/chat"
                className="inline-flex items-center px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
              >
                💬 Join Conversations
              </Link>
              <Link 
                href="/rooms"
                className="inline-flex items-center px-6 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
              >
                🎯 Explore Rooms
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
