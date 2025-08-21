'use client'

import React from 'react';
import { ExternalLink, TrendingUp, Users, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RelatedContent {
  id: string;
  title: string;
  hub: string;
  engagement: number;
  type: 'news' | 'chat' | 'room' | 'club' | 'community';
  goldenThread?: string;
}

interface RelatedContentSidebarProps {
  currentContent?: {
    id: string;
    tags: string[];
    goldenThread?: string;
  };
  className?: string;
}

const RelatedContentSidebar: React.FC<RelatedContentSidebarProps> = ({ 
  currentContent,
  className = '' 
}) => {
  // Mock related content based on current content tags/golden thread
  const getRelatedContent = (): RelatedContent[] => {
    if (!currentContent) return [];

    // Simulate smart recommendations based on tags and golden threads
    const mockRelated: RelatedContent[] = [
      {
        id: '1',
        title: 'Community Garden Planning - Spring 2025',
        hub: 'chat',
        engagement: 78,
        type: 'chat',
        goldenThread: 'parks-gardens'
      },
      {
        id: '2',
        title: 'Urban Gardening Collective',
        hub: 'rooms',
        engagement: 92,
        type: 'room',
        goldenThread: 'parks-gardens'
      },
      {
        id: '3',
        title: 'Green Neighborhoods Alliance',
        hub: 'clubs',
        engagement: 85,
        type: 'club',
        goldenThread: 'parks-gardens'
      },
      {
        id: '4',
        title: 'Sustainable Living Workshop',
        hub: 'chat',
        engagement: 67,
        type: 'chat',
        goldenThread: 'skills-practice'
      },
      {
        id: '5',
        title: 'Climate Action Network',
        hub: 'communities',
        engagement: 94,
        type: 'community',
        goldenThread: 'global-issues'
      }
    ];

    return mockRelated.slice(0, 4); // Show top 4 recommendations
  };

  const relatedContent = getRelatedContent();

  const getHubColor = (hub: string) => {
    const colors = {
      news: 'text-blue-600 bg-blue-50',
      chat: 'text-purple-600 bg-purple-50',
      rooms: 'text-green-600 bg-green-50',
      clubs: 'text-orange-600 bg-orange-50',
      communities: 'text-indigo-600 bg-indigo-50'
    };
    return colors[hub as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      news: <ExternalLink className="w-3 h-3" />,
      chat: <MessageSquare className="w-3 h-3" />,
      room: <Users className="w-3 h-3" />,
      club: <Users className="w-3 h-3" />,
      community: <Users className="w-3 h-3" />
    };
    return icons[type as keyof typeof icons] || <ExternalLink className="w-3 h-3" />;
  };

  if (relatedContent.length === 0) return null;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
          Related Content
        </h3>
        <span className="text-xs text-gray-500">Smart recommendations</span>
      </div>

      <div className="space-y-3">
        {relatedContent.map((item) => (
          <Link
            key={item.id}
            href={`/${item.hub}`}
            className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getHubColor(item.hub)}`}>
                {getTypeIcon(item.type)}
                <span className="ml-1 capitalize">{item.hub}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                {item.engagement}%
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-700 mb-1 line-clamp-2">
              {item.title}
            </h4>
            
            {item.goldenThread && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  🧵 {item.goldenThread.replace('-', ' ')}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link
          href="/communities"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          Explore all golden threads
          <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default RelatedContentSidebar;
