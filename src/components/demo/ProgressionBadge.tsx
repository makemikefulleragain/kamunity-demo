'use client';

import React from 'react';
import { ArrowRight, Users, MessageCircle, Home, Building, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/Typography';

type ProgressionLevel = 'news' | 'chat' | 'rooms' | 'clubs' | 'communities' | 'values-exchange';

interface ProgressionBadgeProps {
  currentLevel: ProgressionLevel;
  nextLevel?: ProgressionLevel;
  progress: {
    current: number;
    required: number;
    type: 'replies' | 'votes' | 'engagement';
  };
  isEligible?: boolean;
  isPromoted?: boolean;
  className?: string;
}

const levelConfig = {
  news: {
    icon: MessageCircle,
    label: 'News',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100 text-blue-800'
  },
  chat: {
    icon: MessageCircle,
    label: 'Chat Thread',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100 text-purple-800'
  },
  rooms: {
    icon: Home,
    label: 'Room',
    color: 'bg-green-500',
    lightColor: 'bg-green-100 text-green-800'
  },
  clubs: {
    icon: Building,
    label: 'Club',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100 text-orange-800'
  },
  communities: {
    icon: Globe,
    label: 'Community',
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-100 text-indigo-800'
  },
  'values-exchange': {
    icon: Sparkles,
    label: 'Values Exchange',
    color: 'bg-pink-500',
    lightColor: 'bg-pink-100 text-pink-800'
  }
};

const ProgressionBadge: React.FC<ProgressionBadgeProps> = ({
  currentLevel,
  nextLevel,
  progress,
  isEligible = false,
  isPromoted = false,
  className
}) => {
  const currentConfig = levelConfig[currentLevel];
  const nextConfig = nextLevel ? levelConfig[nextLevel] : null;
  const CurrentIcon = currentConfig.icon;
  const NextIcon = nextConfig?.icon;

  const getProgressText = () => {
    if (isPromoted && nextLevel) {
      return `Promoted to ${nextConfig?.label}!`;
    }
    
    if (isEligible && nextLevel) {
      return `Ready for ${nextConfig?.label}`;
    }

    const progressPercent = Math.min((progress.current / progress.required) * 100, 100);
    const remaining = Math.max(progress.required - progress.current, 0);
    
    if (remaining === 0 && nextLevel) {
      return `Ready for ${nextConfig?.label}`;
    }
    
    return `${remaining} more ${progress.type} to ${nextConfig?.label || 'next level'}`;
  };

  const getProgressBarWidth = () => {
    return Math.min((progress.current / progress.required) * 100, 100);
  };

  const getBadgeStyle = () => {
    if (isPromoted) {
      return 'border-green-200 bg-green-50';
    }
    if (isEligible) {
      return 'border-yellow-200 bg-yellow-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  const getStatusIcon = () => {
    if (isPromoted) {
      return <span className="text-green-600">✅</span>;
    }
    if (isEligible) {
      return <span className="text-yellow-600">🔥</span>;
    }
    return null;
  };

  return (
    <div className={cn(
      "border-2 rounded-lg p-4 transition-all duration-200",
      getBadgeStyle(),
      className
    )}>
      {/* Current Level */}
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", currentConfig.color)}>
          <CurrentIcon className="w-4 h-4 text-white" />
        </div>
        <Text variant="body-small" className="font-semibold">
          {currentConfig.label}
        </Text>
        {getStatusIcon()}
      </div>

      {/* Progress to Next Level */}
      {nextLevel && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", nextConfig!.color)}>
              <NextIcon className="w-3 h-3 text-white" />
            </div>
            <Text variant="caption" color="muted">
              {nextConfig!.label}
            </Text>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  isPromoted ? "bg-green-500" : 
                  isEligible ? "bg-yellow-500" : 
                  "bg-primary-500"
                )}
                style={{ width: `${getProgressBarWidth()}%` }}
              />
            </div>
          </div>

          {/* Progress Text */}
          <Text variant="caption" className={cn(
            "font-medium",
            isPromoted ? "text-green-700" :
            isEligible ? "text-yellow-700" :
            "text-gray-600"
          )}>
            {getProgressText()}
          </Text>

          {/* Voting Requirements for Club/Community */}
          {(nextLevel === 'clubs' || nextLevel === 'communities') && !isPromoted && (
            <Text variant="caption" color="muted" className="mt-1 block">
              {nextLevel === 'clubs' ? 'Room members vote' : 'Related clubs vote'}
            </Text>
          )}
        </>
      )}

      {/* Values Exchange - Coming Soon */}
      {currentLevel === 'communities' && !nextLevel && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-pink-50 rounded-lg">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <Text variant="caption" className="text-pink-700 font-medium">
            Values Exchange - Coming Soon
          </Text>
        </div>
      )}
    </div>
  );
};

export default ProgressionBadge;
