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
import { newsSeeds } from '@/data/newsSeeds';

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
            {newsSeeds.map((item) => (
              <SimpleNewsCard key={item.id} newsItem={{
                id: item.id,
                title: item.title,
                content: item.description,
                summary: item.description.substring(0, 100) + '...',
                content_type: 'community_story',
                category: item.category,
                tags: item.tags,
                engagement_score: item.engagement,
                comment_count: item.commentCount,
                created_at: item.createdAt
              }} />
            ))}
          </Grid>

          {/* Golden Threads Demo */}
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <Heading level={3} className="text-lg font-semibold mb-3 text-green-700">
              🧵 Golden Threads in Action
            </Heading>
            <div className="text-sm text-green-600 space-y-2">
              <p><strong>🌱 Parks & Gardens:</strong> Follow community garden stories from news to clubs</p>
              <p><strong>🎉 Street Events:</strong> Trace block parties evolving into cultural networks</p>
              <p><strong>🏛️ Civics:</strong> See how budget discussions become democratic movements</p>
              <p><strong>🤝 Social Support:</strong> Watch mutual aid grow into care confederations</p>
              <p className="font-medium text-green-700 mt-3">Each story connects to chats, rooms, clubs, and communities. Discover the progression!</p>
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
