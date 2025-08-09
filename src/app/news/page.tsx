"use client";

import React from 'react';
import { 
  Container, 
  Section, 
  Heading, 
  Text,
  Grid,
  Flex,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge
} from '@/components/ui';
import SummaryPanel from '@/components/summaries/SummaryPanel';
import SimpleNewsCard from '@/components/news/SimpleNewsCard';
import { trackPageView, trackEngagement } from '@/lib/demo/analytics';
import { Toaster } from 'react-hot-toast';

// Mock news data for immediate testing
const mockNewsData = [
  {
    id: '1',
    title: 'Community Spotlight: Local Tech Meetup Grows to 500+ Members',
    content: 'What started as a small gathering of 12 developers in a coffee shop has transformed into the largest tech community in the region.',
    summary: 'Local tech meetup grows from 12 to 500+ members, launches 3 startups',
    content_type: 'kamunity_story',
    category: 'Community Success',
    tags: ['tech', 'meetup', 'community', 'startup'],
    engagement_score: 45,
    comment_count: 8,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Room Summary: "Climate Action Now" - Weekly Highlights',
    content: 'This week in the Climate Action Now room: Members organized a city-wide tree planting event (127 trees planted!), shared 15 sustainable living tips.',
    summary: 'Tree planting event, sustainability tips, carbon calculator milestone',
    content_type: 'room_summary',
    category: 'Environment',
    tags: ['climate', 'environment', 'action', 'community'],
    engagement_score: 32,
    comment_count: 12,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    title: 'Breaking: New Partnership with Local Universities',
    content: 'Kamunity announces partnerships with 5 local universities to create dedicated spaces for student-led initiatives.',
    summary: 'University partnerships enable student-led initiatives and mentorship',
    content_type: 'external_story',
    category: 'Partnerships',
    tags: ['education', 'university', 'students', 'mentorship'],
    engagement_score: 67,
    comment_count: 15,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

const NewsPage = () => {
  // Handle filter changes from SummaryPanel
  const handleSummaryFilterChange = (timeframe: string, category: string) => {
    console.log('Summary filter changed:', { timeframe, category });
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'kamunity_story': return 'bg-blue-100 text-blue-800';
      case 'room_summary': return 'bg-green-100 text-green-800';
      case 'chat_highlight': return 'bg-purple-100 text-purple-800';
      case 'external_story': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'kamunity_story': return 'Kamunity Story';
      case 'room_summary': return 'Room Summary';
      case 'chat_highlight': return 'Chat Highlight';
      case 'external_story': return 'External Story';
      default: return type;
    }
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
                {/* News/Media themed illustration placeholder */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <Text variant="body-small" className="font-medium text-primary-700">
                    NEWS
                  </Text>
                  <Text variant="body-small" color="muted" className="mt-1">
                    Stories that inspire
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
              <div className="text-center lg:text-left">
                <Heading level={1} className="text-4xl lg:text-5xl font-bold mb-6">
                  Community News & Stories
                </Heading>
                <Text variant="body-large" color="muted" className="mb-8 max-w-2xl mx-auto lg:mx-0">
                  Stay connected with the latest updates, success stories, and highlights from our vibrant community. 
                  Discover how conversations turn into real-world impact.
                </Text>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary-600">127</div>
                    <div className="text-neutral-600">Stories Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary-600">2.3k</div>
                    <div className="text-neutral-600">Community Reactions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary-600">45</div>
                    <div className="text-neutral-600">Actions Taken</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* AI Summary Section */}
      <Section spacing="md">
        <Container>
          <SummaryPanel 
            onFilterChange={handleSummaryFilterChange}
          />
        </Container>
      </Section>

      {/* News Feed with Mock Data */}
      <Section spacing="lg">
        <Container>
          <div className="mb-8">
            <Heading level={2} className="text-2xl font-bold mb-4">
              Latest Community Updates
            </Heading>
            <Text color="muted">
              Real-time updates from rooms, chats, and community stories
            </Text>
          </div>

          <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
            {mockNewsData.map((item) => (
              <SimpleNewsCard key={item.id} newsItem={item} />
            ))}
          </Grid>

          {/* Demo Instructions */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <Heading level={3} className="text-lg font-semibold mb-3 text-blue-900">
              🧪 News System Demo
            </Heading>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>✅ Working:</strong> News page now loads without authentication</p>
              <p><strong>📰 Content:</strong> Mock news items showing different content types</p>
              <p><strong>🎯 Next Steps:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Connect to database for real content</li>
                <li>Add expandable comments functionality</li>
                <li>Implement chat promotion workflow</li>
                <li>Add real-time updates</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

export default NewsPage;
