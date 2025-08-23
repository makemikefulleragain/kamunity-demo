'use client';

import { useEffect } from 'react';
import { 
  Container, 
  Section, 
  Flex,
  Heading, 
  Text, 
  Button,
  Card,
  CardContent
} from '@/components/ui';
import { trackPageView } from '@/lib/demo/analytics';
import Link from 'next/link';

const DemoPage = () => {
  useEffect(() => {
    trackPageView('demo_browsing');
  }, []);

  return (
    <>
      {/* Hero Section - Neutral and Welcoming */}
      <Section 
        spacing="xl" 
        className="bg-gradient-to-br from-gray-50 via-neutral-50 to-gray-50 relative overflow-hidden"
      >
        <div className="absolute top-20 right-20 w-40 h-40 bg-gray-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-neutral-100/30 rounded-full blur-2xl" />
        
        <Container className="relative z-10">
          <Flex direction="col" align="center" justify="center" className="text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gray-200/50 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto">
                <span className="text-4xl">👀</span>
              </div>
            </div>
            
            <Heading level={1} variant="display" className="text-gray-800 mb-6 max-w-3xl">
              Explore Kamunity at Your Own Pace
            </Heading>
            
            <Text variant="body-large" className="text-gray-600 mb-8 max-w-2xl">
              No pressure, no rush. Take your time to discover what Kamunity is all about. 
              Browse around, see what interests you, and join in whenever you feel ready.
            </Text>
          </Flex>
        </Container>
      </Section>

      {/* Quick Overview Section */}
      <Section spacing="lg" background="white">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              What is Kamunity?
            </Heading>
            <Text variant="body-large" color="muted" className="max-w-3xl mx-auto">
              Kamunity is a platform where communities come together to share, learn, and grow. 
              It&apos;s a space for real connections, meaningful conversations, and collective action.
            </Text>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">📰</div>
                <Heading level={3} className="text-lg mb-3">
                  Community News
                </Heading>
                <Text variant="body-small" color="muted" className="mb-4">
                  Stay informed about what&apos;s happening in your community. 
                  Read stories, share perspectives, and engage in discussions.
                </Text>
                <Link href="/news">
                  <Button variant="outline" size="sm">
                    Browse News
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">💬</div>
                <Heading level={3} className="text-lg mb-3">
                  Live Conversations
                </Heading>
                <Text variant="body-small" color="muted" className="mb-4">
                  Join real-time discussions with community members. 
                  Share ideas, ask questions, and build relationships.
                </Text>
                <Link href="/chat">
                  <Button variant="outline" size="sm">
                    View Chats
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🏠</div>
                <Heading level={3} className="text-lg mb-3">
                  Focus Rooms
                </Heading>
                <Text variant="body-small" color="muted" className="mb-4">
                  Create or join dedicated spaces for specific interests. 
                  Organize projects, events, and initiatives.
                </Text>
                <Link href="/rooms">
                  <Button variant="outline" size="sm">
                    Explore Rooms
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Community Values Section */}
      <Section spacing="lg" background="neutral">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Our Community Values
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <Heading level={4} className="text-base mb-2">
                Collaboration
              </Heading>
              <Text variant="body-small" color="muted">
                Working together to achieve common goals
              </Text>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <Heading level={4} className="text-base mb-2">
                Growth
              </Heading>
              <Text variant="body-small" color="muted">
                Learning and evolving as a community
              </Text>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <Heading level={4} className="text-base mb-2">
                Innovation
              </Heading>
              <Text variant="body-small" color="muted">
                Creating new solutions together
              </Text>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <Heading level={4} className="text-base mb-2">
                Empathy
              </Heading>
              <Text variant="body-small" color="muted">
                Understanding and supporting each other
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Call to Action - Gentle */}
      <Section spacing="lg" background="white">
        <Container>
          <Card className="bg-gradient-to-r from-gray-50 to-neutral-50 border-gray-200">
            <CardContent className="p-12 text-center">
              <Heading level={2} className="mb-4">
                Ready to Take the Next Step?
              </Heading>
              <Text variant="body-large" color="muted" className="mb-8 max-w-2xl mx-auto">
                When you&apos;re ready, choose how you&apos;d like to engage with the community. 
                There&apos;s no wrong way to start your journey.
              </Text>
              <Link href="/welcome">
                <Button variant="primary" size="lg">
                  Choose Your Path →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
};

export default DemoPage;
