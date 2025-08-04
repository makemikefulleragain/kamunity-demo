"use client";

import { useState } from 'react';
import { 
  Container, 
  Section, 
  Grid, 
  Heading, 
  Text, 
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui';
import SummaryPanel from '@/components/summaries/SummaryPanel';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const mockNewsData = [
  {
    title: 'Community Spotlight: Building Bridges Through Technology',
    description: 'Meet Sarah Chen, a software engineer who used our platform to connect local nonprofits with volunteer developers, creating lasting impact in her community.',
    link: '/news/1',
    category: 'Featured',
    timestamp: '2024-01-15T10:30:00.000Z'
  },
  {
    title: 'Platform Update: Enhanced Chat Features Now Live',
    description: 'We\'ve rolled out improved chat functionality including message threading, emoji reactions, and better mobile support based on your feedback.',
    link: '/news/2',
    category: 'Updates',
    timestamp: '2024-01-14T14:20:00.000Z'
  },
  {
    title: 'Success Story: From Idea to Action in 30 Days',
    description: 'How the "Green Campus Initiative" room transformed from a casual conversation into a university-wide sustainability program affecting 15,000 students.',
    link: '/news/3',
    category: 'Featured',
    timestamp: '2024-01-12T09:15:00.000Z'
  },
  {
    title: 'New Feature: Room Analytics Dashboard',
    description: 'Track your room\'s impact with our new analytics dashboard. See engagement metrics, action completion rates, and community growth over time.',
    link: '/news/4',
    category: 'Latest',
    timestamp: '2024-01-10T16:45:00.000Z'
  },
  {
    title: 'Community Guidelines Update: Fostering Inclusive Spaces',
    description: 'We\'ve updated our community guidelines with input from 500+ members to ensure our platform remains welcoming and productive for everyone.',
    link: '/news/5',
    category: 'Updates',
    timestamp: '2024-01-08T11:30:00.000Z'
  },
  {
    title: 'Deep Dive: The Science Behind Collective Impact',
    description: 'A deep dive into the principles that guide our community and how we measure our collective impact.',
    link: '/news/6',
    category: 'Updates',
    timestamp: '2024-01-01T12:00:00.000Z'
  },
];

const NewsPage = () => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [emojiReactions, setEmojiReactions] = useState<Record<string, Record<string, number>>>({});
  const [filteredNews, setFilteredNews] = useState(mockNewsData);

  // Handle filter changes from SummaryPanel
  const handleSummaryFilterChange = (timeframe: string, category: string) => {
    // Filter news based on timeframe and category
    let filtered = mockNewsData;
    
    // Apply timeframe filter
    const now = new Date();
    const timeframeDays = {
      'TODAY': 1,
      'LAST WEEK': 7,
      'LAST MONTH': 30,
      'LAST YEAR': 365
    };
    
    const daysBack = timeframeDays[timeframe as keyof typeof timeframeDays] || 1;
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    filtered = filtered.filter(item => {
      // Use a default timestamp if not provided
      const timestamp = item.timestamp || new Date().toISOString();
      const itemDate = new Date(timestamp);
      return itemDate >= cutoffDate;
    });
    
    // Apply category filter (map summary categories to news categories)
    if (category !== 'FEATURED') {
      const categoryMap: Record<string, string> = {
        'FUN': 'Community',
        'FACTUAL': 'Updates',
        'UNUSUAL': 'Community',
        'CURIOUS': 'Featured',
        'SPICY': 'Community',
        'NICE': 'Community'
      };
      
      const newsCategory = categoryMap[category];
      if (newsCategory) {
        filtered = filtered.filter(item => item.category === newsCategory);
      }
    }
    
    setFilteredNews(filtered);
  };

  const displayedNews = filteredNews;

  // Emoji reaction handlers
  const handleEmojiClick = (articleLink: string, emoji: string) => {
    setEmojiReactions(prev => ({
      ...prev,
      [articleLink]: {
        ...prev[articleLink],
        [emoji]: (prev[articleLink]?.[emoji] || 0) + 1
      }
    }));
  };

  const handleCardExpand = (articleLink: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleLink)) {
        newSet.delete(articleLink);
      } else {
        newSet.add(articleLink);
      }
      return newSet;
    });
  };

  const emojiOptions = [
    { emoji: '😀', label: 'fun' },
    { emoji: '🎯', label: 'factual' },
    { emoji: '🌶️', label: 'spicy' },
    { emoji: '❤️', label: 'nice' },
    { emoji: '🤨', label: 'weird' },
    { emoji: '🔍', label: 'intriguing' }
  ];

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
              <Heading level={1} className="mb-4 text-center lg:text-left">
                📰 The News - Stories That Inspire Action
              </Heading>
              <Text variant="body-large" color="muted" className="mb-6 text-center lg:text-left">
                Discover inspiring stories, celebrate community wins, and stay connected with the amazing things happening across the Kamunity network every day.
              </Text>
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm ring-4 ring-primary-200">1</div>
                  <Text variant="body-small" className="font-medium text-primary-600">Discover</Text>
                </div>
                <div className="w-8 h-1 bg-neutral-200"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 text-sm">2</div>
                  <Text variant="body-small" color="muted">Connect</Text>
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

      {/* AI Summary Section */}
      <Section spacing="md">
        <Container>
          <SummaryPanel 
            onFilterChange={handleSummaryFilterChange}
          />
        </Container>
      </Section>



      {/* News Grid */}
      <Section spacing="lg">
        <Container>
          {displayedNews.length > 0 ? (
            <Grid cols={1} responsive={{ lg: 2, xl: 3 }} gap="lg">
              {displayedNews.map((article) => (
                <Card 
                  key={article.link} 
                  className="group hover:shadow-card-hover transition-all duration-300 h-full"
                >
                  <CardHeader>
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        article.category === 'Featured' && "bg-primary-100 text-primary-800",
                        article.category === 'Latest' && "bg-success-100 text-success-800",
                        article.category === 'Updates' && "bg-warning-100 text-warning-800"
                      )}>
                        {article.category}
                      </span>
                    </div>
                    
                    <CardTitle className="group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className={expandedCards.has(article.link) ? "line-clamp-10" : "line-clamp-3"}>
                      {article.description}
                      {expandedCards.has(article.link) && (
                        <span className="block mt-3 text-neutral-600">
                          This is additional extended content that appears when you click "Learn More...". 
                          Here you would see more detailed information about the article, including background context, 
                          key insights, related developments, and expert commentary. This expanded view gives readers 
                          a deeper understanding before deciding to read the full story. The content is designed to 
                          provide valuable context while maintaining engagement and encouraging further reading.
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  
                  {/* Emoji Reactions Row */}
                  <div className="px-6 pb-4">
                    {/* Vibe Question */}
                    <div className="text-center mb-3">
                      <Text variant="body-small" color="muted" className="font-medium">
                        What's the vibe?
                      </Text>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      {/* Emoji Reactions - Full Width Container */}
                      <div className="flex items-center gap-1 flex-wrap justify-center">
                        {emojiOptions.map(({ emoji, label }) => {
                          const count = emojiReactions[article.link]?.[emoji] || 0;
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleEmojiClick(article.link, emoji)}
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0",
                                "bg-neutral-100 hover:bg-neutral-200 border border-transparent hover:border-neutral-300",
                                count > 0 && "bg-primary-50 border-primary-200 text-primary-700"
                              )}
                              title={`React with ${label}`}
                            >
                              <span className="text-sm">{emoji}</span>
                              {count > 0 && (
                                <span className="text-xs font-semibold min-w-[1rem] text-center">
                                  {count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <CardFooter className="mt-auto pt-0">
                    {!expandedCards.has(article.link) ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 group-hover:border-primary-500 group-hover:text-primary-600"
                          onClick={() => handleCardExpand(article.link)}
                        >
                          Learn More...
                          <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3 group-hover:text-neutral-600 flex-shrink-0"
                          title="Share article"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex-1 group-hover:text-neutral-600"
                          onClick={() => handleCardExpand(article.link)}
                        >
                          Show Less
                          <svg className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </Button>
                        <Link href={article.link} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full group-hover:border-primary-500 group-hover:text-primary-600"
                          >
                            Read Full Story
                            <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3 group-hover:text-neutral-600 flex-shrink-0"
                          title="Share article"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5.657-2.343m0 0L12 12m5.657 5.657L12 12" />
                </svg>
              </div>
              <Heading level={3} color="muted" className="mb-2">
                No articles found
              </Heading>
              <Text color="muted">
                Try adjusting your search terms or filter criteria.
              </Text>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};

export default NewsPage;
