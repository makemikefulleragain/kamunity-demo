'use client';

import React, { useState, useMemo } from 'react';
import { MessageCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Typography';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  content_type: string;
  category: string;
  tags: string[];
  engagement_score: number;
  comment_count: number;
  created_at: string;
}

interface SimpleNewsCardProps {
  newsItem: NewsItem;
}

const SimpleNewsCard: React.FC<SimpleNewsCardProps> = ({ newsItem }) => {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<string[]>([
    "This is amazing! Great to see community impact 🚀",
    "Love seeing grassroots communities thrive!",
    "The networking opportunities have been incredible.",
    "Which startups launched from this group?",
    "Planning to start a similar group in my city.",
    "The monthly format works really well.",
    "Coffee shop to 500 members - exponential growth!",
    "This should be featured in our newsletter!",
    "Participated in the tree planting! 🌳",
    "The carbon calculator is super helpful.",
    "Those sustainability tips are gold!",
    "Can we organize another event next month?"
  ]);
  const [newComment, setNewComment] = useState('');
  const [isPromoted, setIsPromoted] = useState(false);
  const [promotedChatId, setPromotedChatId] = useState<string | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    setComments(prev => [...prev, newComment]);
    setNewComment('');
    toast.success('Comment added!');
  };

  const handlePromoteToChat = async () => {
    if (isPromoting) return;
    
    setIsPromoting(true);
    toast.loading('🚀 Creating chat room...');
    
    try {
      // Generate a proper UUID for the chat room
      const chatId = crypto.randomUUID();
      
      // Simulate API call to create chat room
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update state to show promotion success
      setIsPromoted(true);
      setPromotedChatId(chatId);
      
      toast.dismiss();
      toast.success('✅ Chat room created successfully!');
      
      // Show redirect option
      setTimeout(() => {
        toast.success(
          <div className="flex flex-col gap-2">
            <span>Chat room is ready!</span>
            <button 
              onClick={() => window.open(`/chat/${chatId}`, '_blank')}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Open Chat Room →
            </button>
          </div>,
          { duration: 6000 }
        );
      }, 1000);
      
    } catch {
      toast.dismiss();
      toast.error('Failed to create chat room. Please try again.');
    } finally {
      setIsPromoting(false);
    }
  };

  const displayedComments = expanded ? comments : comments.slice(0, 3);
  const canPromote = comments.length >= 10;
  
  // Generate random values once using useMemo to avoid setState during render
  const readyForChat = useMemo(() => Math.random() > 0.7, []);
  const joinDiscussion = useMemo(() => Math.random() > 0.8, []);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${getContentTypeColor(newsItem.content_type)}`}>
              {getContentTypeLabel(newsItem.content_type)}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(newsItem.created_at), { addSuffix: true })}
            </span>
            {/* Auto-promotion status */}
            {readyForChat && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                🔥 Ready for Chat
              </span>
            )}
            {joinDiscussion && (
              <a 
                href="/chat" 
                className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                💬 Join Discussion
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{newsItem.comment_count} comments</span>
            <span>•</span>
            <span>{newsItem.engagement_score} engagement</span>
          </div>
        </div>
        
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
          {newsItem.title}
        </CardTitle>
        
        <CardDescription className="text-sm text-gray-600 line-clamp-3 mb-4">
          {newsItem.content}
        </CardDescription>

        {/* Promotion Banner */}
        {isPromoted ? (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">✅ Promoted to Chat!</span>
                <Text variant="body-small" className="text-green-700">
                  Discussion moved to dedicated chat room
                </Text>
              </div>
              <Button
                size="sm"
                onClick={() => window.open(`/chat/${promotedChatId}`, '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open Chat
              </Button>
            </div>
          </div>
        ) : canPromote && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 font-medium">🔥 Hot Discussion!</span>
                <Text variant="body-small" className="text-yellow-700">
                  {comments.length} comments - Ready for chat promotion
                </Text>
              </div>
              <Button
                size="sm"
                onClick={handlePromoteToChat}
                disabled={isPromoting}
                className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50"
              >
                {isPromoting ? 'Creating...' : 'Promote to Chat'}
              </Button>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Text variant="body-small" className="font-medium">
              Comments ({comments.length})
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1"
            >
              {expanded ? (
                <>Show Less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show All <ChevronDown className="w-4 h-4" /></>
              )}
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            {displayedComments.map((comment, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    {String.fromCharCode(65 + (index % 26))}
                  </div>
                  <div className="flex-1">
                    <Text variant="body-small">{comment}</Text>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button size="sm" onClick={handleAddComment}>
              Post
            </Button>
          </div>
        </div>

        {/* Tags and Date */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {newsItem.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                #{tag}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(newsItem.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SimpleNewsCard;
