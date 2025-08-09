'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, ChevronDown, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

const supabase = createClient();

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

interface NewsCardProps {
  newsItem: NewsItem;
  onCommentAdded?: (newsItemId: string, comment: NewsComment) => void;
  onPromotionSuccess?: (newsItemId: string, chatId: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  newsItem,
  onCommentAdded,
  onPromotionSuccess
}) => {
  const { user } = useDemoAuth();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<NewsComment[]>(newsItem.comments || []);
  const [commentCount, setCommentCount] = useState(newsItem.comment_count);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [isPromoted, setIsPromoted] = useState(newsItem.is_promoted_to_chat);
  const [promotedChatId, setPromotedChatId] = useState(newsItem.promoted_chat_id);
  const [loading, setLoading] = useState(false);

  // Real-time subscription for comments
  useEffect(() => {
    const channel = supabase
      .channel(`news_comments:${newsItem.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'news_comments',
          filter: `news_item_id=eq.${newsItem.id}`
        },
        async (payload) => {
          // Fetch the complete comment with user data
          const { data: newComment } = await supabase
            .from('news_comments')
            .select(`
              id,
              content,
              created_at,
              user:users(id, name, emoji_avatar)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newComment) {
            setComments(prev => [...prev, newComment]);
            setCommentCount(prev => prev + 1);
            onCommentAdded?.(newsItem.id, newComment);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'news_items',
          filter: `id=eq.${newsItem.id}`
        },
        (payload) => {
          if (payload.new.is_promoted_to_chat && !isPromoted) {
            setIsPromoted(true);
            setPromotedChatId(payload.new.promoted_chat_id);
            toast.success('This discussion has been promoted to a live chat!');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newsItem.id, isPromoted, onCommentAdded]);

  // Load all comments when expanded
  const loadAllComments = async () => {
    if (comments.length >= commentCount) return;

    setLoading(true);
    try {
      const { data, error } = await fetch(`/api/news/${newsItem.id}/comments`).then(res => res.json());
      
      if (error) {
        toast.error('Failed to load comments');
        return;
      }

      setComments(data.comments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandToggle = () => {
    setExpanded(!expanded);
    if (!expanded && comments.length < commentCount) {
      loadAllComments();
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (newComment.length > 2000) {
      toast.error('Comment cannot exceed 2000 characters');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/news/${newsItem.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          user_id: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      setComments(prev => [
        ...prev,
        {
          id: data.id,
          content: data.content,
          created_at: data.created_at,
          user: {
            id: data.user.id,
            name: data.user.name,
            emoji_avatar: data.user.emoji_avatar
          }
        }
      ]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePromoteToChat = async () => {
    if (!user) {
      toast.error('Please log in to promote discussions');
      return;
    }

    if (commentCount < 10) {
      toast.error('This discussion needs at least 10 comments to be promoted');
      return;
    }

    setPromoting(true);
    try {
      const response = await fetch(`/api/news/${newsItem.id}/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promoted_by_user_id: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to promote to chat');
      }

      setIsPromoted(true);
      setPromotedChatId(data.chat_room.id);
      onPromotionSuccess?.(newsItem.id, data.chat_room.id);
      toast.success('Discussion promoted to live chat!');

    } catch (error) {
      console.error('Error promoting to chat:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to promote discussion');
    } finally {
      setPromoting(false);
    }
  };

  const getContentTypeIcon = () => {
    switch (newsItem.content_type) {
      case 'room_summary':
        return '🏠';
      case 'chat_highlight':
        return '💬';
      case 'kamunity_story':
        return '⭐';
      case 'external_story':
        return '🌐';
      default:
        return '📰';
    }
  };

  const getContentTypeLabel = () => {
    switch (newsItem.content_type) {
      case 'room_summary':
        return 'Room Summary';
      case 'chat_highlight':
        return 'Chat Highlight';
      case 'kamunity_story':
        return 'Community Story';
      case 'external_story':
        return 'External Story';
      default:
        return 'News';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
      <CardHeader>
        {/* Content Type and Category */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {getContentTypeIcon()} {getContentTypeLabel()}
            </Badge>
            {newsItem.category && (
              <Badge variant="outline" className="text-xs">
                {newsItem.category}
              </Badge>
            )}
          </div>
          
          {newsItem.external_url && (
            <Link 
              href={newsItem.external_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ExternalLink size={16} />
            </Link>
          )}
        </div>

        {/* Promotion Banner */}
        {isPromoted && promotedChatId && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">🚀</span>
                <Text variant="body-small" className="text-green-800 font-medium">
                  This discussion was promoted to live chat!
                </Text>
              </div>
              <Link href={`/chat/${promotedChatId}`}>
                <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-100">
                  Join Chat
                </Button>
              </Link>
            </div>
          </div>
        )}

        <CardTitle className="group-hover:text-primary-600 transition-colors">
          {newsItem.title}
        </CardTitle>
        
        <CardDescription>
          {newsItem.summary || newsItem.content.substring(0, 150)}
          {(newsItem.summary || newsItem.content).length > 150 && '...'}
        </CardDescription>

        {/* Author and Timestamp */}
        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-3">
          {newsItem.author && (
            <div className="flex items-center space-x-1">
              <span>{newsItem.author.emoji_avatar}</span>
              <span>{newsItem.author.name}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{formatDistanceToNow(new Date(newsItem.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Tags */}
        {newsItem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {newsItem.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {newsItem.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{newsItem.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      {/* Comments Section */}
      <div className="border-t border-gray-200">
        {/* Comment Count Header */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleExpandToggle}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MessageCircle size={16} />
            <span>{commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
            <ChevronDown 
              size={16} 
              className={cn("transition-transform", expanded && "rotate-180")} 
            />
          </button>

          {/* Promote to Chat Button */}
          {!isPromoted && commentCount >= 10 && (
            <Button
              onClick={handlePromoteToChat}
              disabled={promoting}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {promoting ? 'Promoting...' : '🚀 Promote to Chat'}
            </Button>
          )}
        </div>

        {/* Expandable Comments */}
        <div>
          {expanded && (
            <div
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                {loading ? (
                  <div className="text-center py-4">
                    <Text variant="body-small" color="muted">Loading comments...</Text>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <span className="text-lg">{comment.user?.emoji_avatar || '👤'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Text variant="body-small" className="font-medium">
                              {comment.user?.name || 'Anonymous'}
                            </Text>
                            <Text variant="body-small" color="muted">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </Text>
                          </div>
                          <Text variant="body-small" className="text-gray-700">
                            {comment.content}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Text variant="body-small" color="muted">No comments yet. Be the first to comment!</Text>
                  </div>
                )}

                {/* Comment Form */}
                {user ? (
                  <form onSubmit={handleSubmitComment} className="mt-4">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-lg">{user.emoji_avatar || '👤'}</span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={3}
                          maxLength={2000}
                          disabled={submitting}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <Text variant="body-small" color="muted">
                            {newComment.length}/2000 characters
                          </Text>
                          <Button
                            type="submit"
                            size="sm"
                            disabled={submitting || !newComment.trim()}
                          >
                            {submitting ? 'Posting...' : 'Post Comment'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <Text variant="body-small" color="muted" className="mb-2">
                      Please log in to join the discussion
                    </Text>
                    <Button size="sm" variant="outline">
                      Log In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
