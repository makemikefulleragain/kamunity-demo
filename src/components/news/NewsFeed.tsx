'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Filter, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Text, Heading } from '@/components/ui/Typography';
import { Container, Section, Grid } from '@/components/ui/Layout';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import NewsCard from './NewsCard';
import { toast } from 'react-hot-toast';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  content_type: 'room_summary' | 'chat_highlight' | 'kamunity_story' | 'external_story';
  source_id?: string;
  category?: string;
  tags: string[];
  image_url?: string;
  external_url?: string;
  engagement_score: number;
  comment_count: number;
  is_promoted_to_chat: boolean;
  promoted_chat_id?: string;
  created_at: string;
  author?: {
    id: string;
    name: string;
    emoji_avatar: string;
  };
  comments?: NewsComment[];
}

interface NewsComment {
  id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    emoji_avatar: string;
  };
}

interface NewsFeedProps {
  className?: string;
}

const contentTypeFilters = [
  { value: 'all', label: 'All Stories', icon: '📰' },
  { value: 'room_summary', label: 'Room Updates', icon: '🏠' },
  { value: 'chat_highlight', label: 'Chat Highlights', icon: '💬' },
  { value: 'kamunity_story', label: 'Community Stories', icon: '⭐' },
  { value: 'external_story', label: 'External News', icon: '🌐' }
];

const categoryFilters = [
  'All Categories',
  'Success Stories',
  'Education',
  'Health & Wellness',
  'Environment',
  'Technology',
  'Community Action',
  'Platform Updates'
];

export const NewsFeed: React.FC<NewsFeedProps> = ({ className }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load news items
  const loadNewsItems = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setError(null);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams({
        limit: '20',
        offset: refresh ? '0' : newsItems.length.toString()
      });

      if (selectedContentType !== 'all') {
        params.append('content_type', selectedContentType);
      }

      if (selectedCategory !== 'All Categories') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load news items');
      }

      if (refresh) {
        setNewsItems(data.news_items || []);
      } else {
        setNewsItems(prev => [...prev, ...(data.news_items || [])]);
      }

      setHasMore(data.has_more || false);

    } catch (error) {
      console.error('Error loading news items:', error);
      setError(error instanceof Error ? error.message : 'Failed to load news items');
      toast.error('Failed to load news items');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [selectedContentType, selectedCategory, newsItems.length]);

  // Initial load
  useEffect(() => {
    loadNewsItems();
  }, [selectedContentType, selectedCategory]);

  // Handle filter changes
  const handleContentTypeChange = (contentType: string) => {
    setSelectedContentType(contentType);
    setNewsItems([]);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setNewsItems([]);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadNewsItems(true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadNewsItems();
    }
  };

  // Handle comment added
  const handleCommentAdded = (newsItemId: string, comment: NewsComment) => {
    setNewsItems(prev => 
      prev.map(item => 
        item.id === newsItemId 
          ? { 
              ...item, 
              comment_count: item.comment_count + 1,
              comments: [...(item.comments || []), comment]
            }
          : item
      )
    );
  };

  // Handle promotion success
  const handlePromotionSuccess = (newsItemId: string, chatId: string) => {
    setNewsItems(prev =>
      prev.map(item =>
        item.id === newsItemId
          ? {
              ...item,
              is_promoted_to_chat: true,
              promoted_chat_id: chatId
            }
          : item
      )
    );
  };

  // Filter items by search query
  const filteredItems = newsItems.filter(item =>
    searchQuery === '' ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading && newsItems.length === 0) {
    return (
      <Section spacing="lg" className={className}>
        <Container>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <Text>Loading community stories...</Text>
          </div>
        </Container>
      </Section>
    );
  }

  if (error && newsItems.length === 0) {
    return (
      <Section spacing="lg" className={className}>
        <Container>
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Heading level={3} className="mb-2">Failed to Load Stories</Heading>
            <Text color="muted" className="mb-4">{error}</Text>
            <Button onClick={handleRefresh}>
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" className={className}>
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading level={2} className="mb-2">Community Stories</Heading>
            <Text color="muted">
              Discover inspiring stories, room highlights, and community achievements
            </Text>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw size={16} className={cn("mr-2", refreshing && "animate-spin")} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Content Type Filter */}
          <div>
            <Text variant="body-small" className="font-medium mb-2">Content Type</Text>
            <div className="flex flex-wrap gap-2">
              {contentTypeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleContentTypeChange(filter.value)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all",
                    selectedContentType === filter.value
                      ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                  )}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Text variant="body-small" className="font-medium mb-2">Category</Text>
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === category
                      ? "bg-secondary-100 text-secondary-800 border-2 border-secondary-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedContentType !== 'all' || selectedCategory !== 'All Categories' || searchQuery) && (
          <div className="flex items-center space-x-2 mb-6">
            <Text variant="body-small" color="muted">Active filters:</Text>
            {selectedContentType !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {contentTypeFilters.find(f => f.value === selectedContentType)?.label}
              </Badge>
            )}
            {selectedCategory !== 'All Categories' && (
              <Badge variant="secondary" className="text-xs">
                {selectedCategory}
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Search: "{searchQuery}"
              </Badge>
            )}
            <button
              onClick={() => {
                setSelectedContentType('all');
                setSelectedCategory('All Categories');
                setSearchQuery('');
                setNewsItems([]);
              }}
              className="text-xs text-primary-600 hover:text-primary-800 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* News Grid */}
        {filteredItems.length > 0 ? (
          <>
            <Grid cols={1} responsive={{ md: 2, xl: 3 }} gap="lg" className="mb-8">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NewsCard
                      newsItem={item}
                      onCommentAdded={handleCommentAdded}
                      onPromotionSuccess={handlePromotionSuccess}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Grid>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                      Loading more...
                    </>
                  ) : (
                    'Load More Stories'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <Heading level={3} className="mb-2">No Stories Found</Heading>
            <Text color="muted" className="mb-4">
              {searchQuery || selectedContentType !== 'all' || selectedCategory !== 'All Categories'
                ? 'Try adjusting your filters or search terms'
                : 'Check back soon for new community stories and updates'
              }
            </Text>
            {(searchQuery || selectedContentType !== 'all' || selectedCategory !== 'All Categories') && (
              <Button
                onClick={() => {
                  setSelectedContentType('all');
                  setSelectedCategory('All Categories');
                  setSearchQuery('');
                  setNewsItems([]);
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        {filteredItems.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-700">
                  {filteredItems.length}
                </div>
                <Text variant="body-small" color="muted">Stories</Text>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-700">
                  {filteredItems.reduce((sum, item) => sum + item.comment_count, 0)}
                </div>
                <Text variant="body-small" color="muted">Comments</Text>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {filteredItems.filter(item => item.is_promoted_to_chat).length}
                </div>
                <Text variant="body-small" color="muted">Promoted to Chat</Text>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default NewsFeed;
