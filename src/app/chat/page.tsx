'use client'

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Flex
} from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import KaiCharacter from '@/components/KaiCharacter';
import SummaryPanel from '@/components/summaries/SummaryPanel';

interface Conversation {
  id: string;
  topic: string | null;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

export default function ChatHubPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch('/api/conversations');
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data = await response.json();
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <>
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary-50/70 to-secondary-50/70">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Mobile: Image First - Desktop: Right Column (1/3 width) */}
              <div className="lg:col-span-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative w-64 h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center shadow-lg">
                  {/* Chat themed illustration */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <Text variant="body-small" className="font-medium text-primary-700">
                      CHAT
                    </Text>
                    <Text variant="body-small" color="muted" className="mt-1">
                      Spark connections
                    </Text>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-secondary-400 rounded-full opacity-60"></div>
                  <div className="absolute bottom-6 left-4 w-2 h-2 bg-primary-400 rounded-full opacity-40"></div>
                  <div className="absolute top-1/2 right-2 w-1 h-1 bg-secondary-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Mobile: Text Second - Desktop: Left Column (2/3 width) */}
              <div className="lg:col-span-2 lg:order-1">
                <Heading level={1} className="mb-4 text-center lg:text-left">
                  💬 Chat Hub - Where Conversations Spark Change
                </Heading>
                <Text variant="body-large" color="muted" className="mb-6 text-center lg:text-left">
                  Connect with community members, share ideas, and discover conversations that could become collaborative Focus Rooms.
                </Text>
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <Text variant="body-small" color="muted">Discover</Text>
                  </div>
                  <div className="w-8 h-1 bg-primary-500"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm ring-4 ring-primary-200">2</div>
                    <Text variant="body-small" className="font-medium text-primary-600">Connect</Text>
                  </div>
                  <div className="w-8 h-1 bg-neutral-200"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 text-sm">3</div>
                    <Text variant="body-small" color="muted">Create</Text>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Kai's Community Chat Summary */}
        <Section spacing="lg">
          <Container>
            <SummaryPanel onFilterChange={(timeframe, category) => {
              // Handle filter changes for chat-specific content
              console.log('Chat filters changed:', { timeframe, category });
            }} />
          </Container>
        </Section>

        {/* Loading Content */}
        <Section spacing="lg">
          <Container>
            <div className="text-center p-10">Loading conversations...</div>
          </Container>
        </Section>
      </>
    );
  }

  const handlePromoteToRoom = (conversationId: string, topic: string) => {
    // TODO: Implement promote to room functionality
    console.log('Promoting conversation to room:', conversationId, topic);
    // This would open the Room Generator with pre-filled data
  };

  return (
    <>
      {/* Hero Section */}
      <Section spacing="lg" className="bg-gradient-to-br from-primary-50/70 to-secondary-50/70">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Mobile: Image First - Desktop: Right Column (1/3 width) */}
            <div className="lg:col-span-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-64 h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center shadow-lg">
                {/* Chat themed illustration */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <Text variant="body-small" className="font-medium text-primary-700">
                    CHAT
                  </Text>
                  <Text variant="body-small" color="muted" className="mt-1">
                    Spark connections
                  </Text>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-secondary-400 rounded-full opacity-60"></div>
                <div className="absolute bottom-6 left-4 w-2 h-2 bg-primary-400 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-secondary-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Mobile: Text Second - Desktop: Left Column (2/3 width) */}
            <div className="lg:col-span-2 lg:order-1">
              <Heading level={1} className="mb-4 text-center lg:text-left">
                💬 Chat Hub - Where Conversations Spark Change
              </Heading>
              <Text variant="body-large" color="muted" className="mb-6 text-center lg:text-left">
                Connect with community members, share ideas, and discover conversations that could become collaborative Focus Rooms.
              </Text>
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <Text variant="body-small" color="muted">Discover</Text>
                </div>
                <div className="w-8 h-1 bg-primary-500"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm ring-4 ring-primary-200">2</div>
                  <Text variant="body-small" className="font-medium text-primary-600">Connect</Text>
                </div>
                <div className="w-8 h-1 bg-neutral-200"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 text-sm">3</div>
                  <Text variant="body-small" color="muted">Create</Text>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Kai's Community Chat Summary */}
      <Section spacing="lg">
        <Container>
          <SummaryPanel onFilterChange={(timeframe, category) => {
            // Handle filter changes for chat-specific content
            console.log('Chat filters changed:', { timeframe, category });
          }} />
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container>

        {/* Conversations Grid */}
        <div className="grid gap-6">
          {error ? (
            <div className="text-center p-10">
              <Text color="error" className="mb-4">Unable to load conversations right now</Text>
              <Text variant="body-small" color="muted">Please try refreshing the page or check back later</Text>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map(conv => (
              <Card key={conv.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <Flex justify="between" align="start">
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        {conv.topic || 'Untitled Conversation'}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Last activity: {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{conv.messageCount} messages</Badge>
                  </Flex>
                </CardHeader>
                <CardContent>
                  <Text className="mb-4 line-clamp-2">
                    <strong>Latest:</strong> {conv.lastMessage}
                  </Text>
                  
                  {/* Action Buttons */}
                  <Flex gap="sm" className="flex-wrap">
                    <Button variant="outline" size="sm">
                      Join Chat
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handlePromoteToRoom(conv.id, conv.topic || 'Untitled')}
                    >
                      🎯 Promote to Room
                    </Button>
                  </Flex>
                </CardContent>
              </Card>
            ))
          ) : (
            <KaiCharacter
              variant="card"
              expression="encouraging"
              size="lg"
              title="Ready to Connect?"
              message="This is where great conversations begin! Start chatting with community members, share your ideas, and discover topics that could spark amazing collaborative projects."
              actionButton={{
                text: "💬 Start Your First Chat",
                onClick: () => console.log('Start new chat'),
                variant: 'primary'
              }}
            />
          )}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <CardContent className="p-8 text-center">
            <Heading level={3} className="mb-4 text-primary-700">
              Ready to Create Impact?
            </Heading>
            <Text className="mb-6 max-w-xl mx-auto">
              Found a conversation that could become something bigger? Promote it to a Focus Room and start organizing collaborative action.
            </Text>
            <Flex gap="md" justify="center" className="flex-col sm:flex-row">
              <Link href="/rooms/generate">
                <Button variant="primary" size="lg">
                  Create New Room
                </Button>
              </Link>
              <Link href="/news">
                <Button variant="outline" size="lg">
                  Discover More Topics
                </Button>
              </Link>
            </Flex>
          </CardContent>
        </Card>
        </Container>
      </Section>
    </>
  );
}
