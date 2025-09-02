'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Container, 
  Section, 
  Heading, 
  Text,
  Grid,
  Card,
  CardContent
} from '@/components/ui';
import SummaryPanel from '@/components/summaries/SummaryPanel';
import GoldenThreadBreadcrumbs from '@/components/demo/GoldenThreadBreadcrumbs';
import RelatedContentSidebar from '@/components/demo/RelatedContentSidebar';
import MobileOptimizations from '@/components/demo/MobileOptimizations';
import { trackPageView } from '@/lib/demo/analytics';

interface HubPageTemplateProps {
  hubName: string;
  hubIcon: string;
  heroTitle: string;
  heroDescription: string;
  heroStats: Array<{
    value: string;
    label: string;
  }>;
  heroImageContent: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
  };
  cards: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    engagement: number;
    commentCount: number;
    tags: string[];
    createdAt: string;
    promotionStatus?: 'eligible' | 'promoted' | 'none';
    promotionTarget?: string;
    demoType?: string;
    hasDetailedSpec?: boolean;
    roomData?: any;
  }>;
  endMessage: {
    title: string;
    description: string;
    actionText?: string;
    actionLink?: string;
  };
  children?: React.ReactNode;
}

const HubPageTemplate: React.FC<HubPageTemplateProps> = ({
  hubName,
  hubIcon,
  heroTitle,
  heroDescription,
  heroStats,
  heroImageContent,
  cards,
  endMessage,
  children
}) => {
  // Track page view
  React.useEffect(() => {
    trackPageView(hubName.toLowerCase());
  }, [hubName]);

  const getPromotionBadge = (status?: string, target?: string) => {
    switch (status) {
      case 'eligible':
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            🔥 Ready for {target}
          </div>
        );
      case 'promoted':
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            ✅ Promoted to {target}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MobileOptimizations hubName={hubName}>
      {/* Golden Thread Breadcrumbs */}
      <GoldenThreadBreadcrumbs currentHub={hubName.toLowerCase()} />
      
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Hero Section */}
          <Section spacing="lg" className="bg-gradient-to-br from-primary-50/70 to-secondary-50/70">
            <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Mobile: Image First - Desktop: Right Column (1/3 width) */}
            <div className="lg:col-span-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-64 h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center shadow-lg">
                {/* Hub themed illustration */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    {heroImageContent.icon}
                  </div>
                  <Text variant="body-small" className="font-medium text-primary-700">
                    {heroImageContent.title}
                  </Text>
                  <Text variant="body-small" color="muted" className="mt-1">
                    {heroImageContent.subtitle}
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
                  {hubIcon} {heroTitle}
                </Heading>
                <Text variant="body-large" color="muted" className="mb-8 max-w-2xl mx-auto lg:mx-0">
                  {heroDescription}
                </Text>
                
                {/* Quick Stats and Design Button */}
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm">
                  {heroStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="font-semibold text-primary-600">{stat.value}</div>
                      <div className="text-neutral-600">{stat.label}</div>
                    </div>
                  ))}
                  
                  {/* Design a Room Button - only show for Rooms hub */}
                  {hubName === 'Rooms' && (
                    <Link 
                      href="/rooms/generate"
                      className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-base flex items-center gap-2"
                    >
                      🎨 Design a Room
                    </Link>
                  )}
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
            onFilterChange={(timeframe, category) => {
              console.log(`${hubName} filter changed:`, { timeframe, category });
            }}
          />
        </Container>
      </Section>

      {/* Hub Content Cards */}
      <Section spacing="lg">
        <Container>
          <div className="mb-8">
            <Heading level={2} className="text-2xl font-bold mb-4">
              Latest from {hubName}
            </Heading>
            <Text color="muted">
              Real-time updates and community highlights
            </Text>
          </div>

          <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
            {cards.map((card) => {
              // Special handling for different room types
              let cardLink;
              if (card.id === 'room-lore-campaign') {
                cardLink = '/rooms/lore-campaign';
              } else if (card.demoType === 'saved-focus-room') {
                cardLink = `/rooms/${card.id}/saved-demo`;
              } else {
                cardLink = `/${hubName.toLowerCase()}/${card.id}`;
              }
              
              return (
              <Link key={card.id} href={cardLink} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {card.category}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>💬 {card.commentCount}</span>
                      <span>⚡ {card.engagement}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Heading level={4} className="text-lg font-semibold mb-2 line-clamp-2">
                    {card.title}
                  </Heading>

                  {/* Description */}
                  <Text variant="body-small" color="muted" className="mb-4 line-clamp-3">
                    {card.description}
                  </Text>

                  {/* Promotion Status */}
                  {card.promotionStatus && card.promotionStatus !== 'none' && (
                    <div className="mb-4">
                      {getPromotionBadge(card.promotionStatus, card.promotionTarget)}
                    </div>
                  )}

                  {/* Tags, Date, and Spec Button */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {card.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                        {card.hasDetailedSpec && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">
                            📋 Full Spec
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(card.createdAt).toLocaleDateString('en-AU', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    {/* View Spec Button for rooms with detailed specs */}
                    {card.hasDetailedSpec && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // This will be handled by the parent component
                          const event = new CustomEvent('viewRoomSpec', { detail: card });
                          window.dispatchEvent(event);
                        }}
                        className="w-full px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                      >
                        📋 View Full Specification
                      </button>
                    )}
                  </div>
                  </CardContent>
                </Card>
              </Link>
            );
            })}
          </Grid>

          {/* Custom content slot */}
          {children}
        </Container>
      </Section>

      {/* End Message Section */}
      <Section spacing="md" background="primary">
        <Container>
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Heading level={3} className="mb-4 text-primary-700">
                {endMessage.title}
              </Heading>
              <Text className="mb-6 max-w-2xl mx-auto">
                {endMessage.description}
              </Text>
              {endMessage.actionText && endMessage.actionLink && (
                <a 
                  href={endMessage.actionLink}
                  className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  {endMessage.actionText}
                </a>
              )}
            </CardContent>
          </Card>
            </Container>
          </Section>
          
          {children}
        </div>
        
        {/* Related Content Sidebar */}
        <RelatedContentSidebar />
      </div>
    </MobileOptimizations>
  );
};

export default HubPageTemplate;
