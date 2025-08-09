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

interface ChatRoom {
  id: string;
  name: string;
  description: string | null;
  emoji_theme: string;
  current_participants: number;
  max_participants: number;
  is_active: boolean;
  messageCount: number;
  lastActivity: string;
}

export default function ChatHubPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch('/api/rooms/chat');
        if (!response.ok) {
          throw new Error('Failed to fetch chat rooms');
        }
        const data = await response.json();
        setChatRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChatRooms();
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
            <div className="text-center p-10">Loading chat rooms...</div>
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
          {loading ? (
            <div className="text-center py-8">
              <Text>Loading chat rooms...</Text>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Text className="text-red-600">Error: {error}</Text>
            </div>
          ) : chatRooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <span className="text-6xl">💬</span>
              </div>
              <Heading level={2} className="text-2xl mb-4">
                No active chats yet
              </Heading>
              <Text className="text-gray-600 mb-8">
                Chat rooms will appear here as conversations become active
              </Text>
              <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
                <Text className="text-sm text-blue-800">
                  💡 <strong>Demo Tip:</strong> We can seed some sample chats to demonstrate the promotion feature!
                </Text>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {chatRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{room.emoji_theme}</span>
                          <Heading level={3} className="text-lg font-semibold">
                            {room.name}
                          </Heading>
                        </div>
                        <Text className="text-sm text-gray-600 mb-3">
                          {room.description}
                        </Text>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>
                        👥 {room.current_participants}/{room.max_participants} members
                      </span>
                      <span>
                        💬 {room.messageCount} messages
                      </span>
                    </div>
                    
                    {room.messageCount >= 10 && (
                      <div className="mb-3">
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          🚀 Ready for Room Promotion
                        </Badge>
                      </div>
                    )}
                    
                    <Link href={`/chat/${room.id}`}>
                      <Button className="w-full">
                        Join Chat
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
