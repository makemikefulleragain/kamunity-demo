'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heading,
  Text
} from '@/components/ui';
import { cn } from '@/lib/utils';

interface SummaryPanelProps {
  onFilterChange?: (timeframe: string, category: string) => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ onFilterChange }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('TODAY');
  const [selectedCategory, setSelectedCategory] = useState('FEATURED');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(180); // 3 minutes default
  const audioRef = useRef<HTMLAudioElement>(null);

  const timeframes = ['TODAY', 'LAST WEEK', 'LAST MONTH', 'LAST YEAR'];
  const categories = ['FEATURED', 'FUN', 'FACTUAL', 'UNUSUAL', 'CURIOUS', 'SPICY', 'NICE'];

  // Key highlights from kamunity.org
  const keyHighlights = [
    'Gaming tournament attracted 120+ participants across platforms',
    'Meme contest generated over 500 community shares',
    'Comedy night featured 15 members performing tech humor'
  ];

  // Handle filter changes with mutual exclusivity logic
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    
    // When timeline is selected, deactivate FEATURED and auto-select FUN if no perspective is active
    if (selectedCategory === 'FEATURED') {
      setSelectedCategory('FUN');
      onFilterChange?.(timeframe, 'FUN');
    } else {
      onFilterChange?.(timeframe, selectedCategory);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (category === 'FEATURED') {
      // When FEATURED is selected, reset timeline and perspective to inactive state
      setSelectedCategory('FEATURED');
      setSelectedTimeframe('TODAY'); // Keep timeframe but it won't be visually active
      onFilterChange?.('TODAY', 'FEATURED');
    } else {
      // When perspective is selected, deactivate FEATURED and auto-select TODAY if needed
      setSelectedCategory(category);
      if (selectedCategory === 'FEATURED') {
        setSelectedTimeframe('TODAY');
        onFilterChange?.('TODAY', category);
      } else {
        onFilterChange?.(selectedTimeframe, category);
      }
    }
  };

  // Get audio file path
  const getAudioPath = useCallback(() => {
    return `/audio/kamunity-newsfeed-summary.mp3`;
  }, []);

  // Audio playback functionality
  const handlePlayToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = getAudioPath();
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setAudioProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    const handleError = () => {
      console.warn('Audio file not found:', getAudioPath());
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [getAudioPath]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Main Title */}
        <Heading level={1} className="text-3xl font-bold text-primary-600 mb-6">
          Kai&apos;s Kamunity Newsfeed
        </Heading>
        
        {/* 2x2 Grid Layout - Desktop, Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Top Left - Filters */}
          <div className="order-1">
            {/* Filter Layout: Left Column (FEATURED) + Right Side (Timeline + Perspective) */}
            <div className="flex gap-3 mb-4">
              {/* Left Column - FEATURED Button (matches 2-row height) */}
              <div className="flex flex-col justify-center">
                <button
                  onClick={() => handleCategoryChange('FEATURED')}
                  className={cn(
                    'px-4 py-6 text-sm font-bold rounded-lg transition-colors flex items-center justify-center',
                    'h-[76px] w-[100px]', // Fixed height to match two rows + gap
                    selectedCategory === 'FEATURED'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  )}
                >
                  FEATURED
                </button>
              </div>
              
              {/* Right Side - Two Rows */}
              <div className="flex-1 flex flex-col gap-2">
                {/* Top Row - Timeline Buttons */}
                <div className="flex flex-wrap gap-2 h-[36px] items-center">
                  {timeframes.map((timeframe) => {
                    // Timeline buttons: only show colors when FEATURED is not active
                    const getTimeframeColor = (tf: string) => {
                      // If FEATURED is active, all timeline buttons are gray
                      if (selectedCategory === 'FEATURED') {
                        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                      }
                      
                      // If FEATURED is not active, show contextual colors for selected timeline
                      if (selectedTimeframe === tf) {
                        switch(tf) {
                          case 'TODAY': return 'bg-green-500 text-white';
                          case 'LAST WEEK': return 'bg-blue-500 text-white';
                          case 'LAST MONTH': return 'bg-purple-500 text-white';
                          case 'LAST YEAR': return 'bg-gray-600 text-white';
                          default: return 'bg-gray-200 text-gray-800';
                        }
                      } else {
                        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                      }
                    };
                    
                    return (
                      <button
                        key={timeframe}
                        onClick={() => handleTimeframeChange(timeframe)}
                        className={cn(
                          'px-3 py-2 text-xs font-medium rounded-md transition-colors',
                          getTimeframeColor(timeframe)
                        )}
                      >
                        {timeframe}
                      </button>
                    );
                  })}
                </div>
                
                {/* Bottom Row - Perspective Buttons */}
                <div className="flex flex-wrap gap-1 h-[36px] items-center">
                  {categories.filter(cat => cat !== 'FEATURED').map((category) => {
                    // Perspective buttons: only show colors when FEATURED is not active
                    const getPerspectiveColor = (cat: string) => {
                      // If FEATURED is active, all perspective buttons are gray
                      if (selectedCategory === 'FEATURED') {
                        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                      }
                      
                      // If FEATURED is not active, show contextual colors for selected perspective
                      if (selectedCategory === cat) {
                        switch(cat) {
                          case 'FUN': return 'bg-yellow-500 text-white';
                          case 'FACTUAL': return 'bg-indigo-500 text-white';
                          case 'UNUSUAL': return 'bg-pink-500 text-white';
                          case 'CURIOUS': return 'bg-teal-500 text-white';
                          case 'SPICY': return 'bg-red-500 text-white';
                          case 'NICE': return 'bg-emerald-500 text-white';
                          default: return 'bg-gray-500 text-white';
                        }
                      } else {
                        // Unselected perspective buttons show their light theme colors
                        switch(cat) {
                          case 'FUN': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
                          case 'FACTUAL': return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200';
                          case 'UNUSUAL': return 'bg-pink-100 text-pink-700 hover:bg-pink-200';
                          case 'CURIOUS': return 'bg-teal-100 text-teal-700 hover:bg-teal-200';
                          case 'SPICY': return 'bg-red-100 text-red-700 hover:bg-red-200';
                          case 'NICE': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
                          default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                        }
                      }
                    };
                    
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-md transition-colors',
                          getPerspectiveColor(category)
                        )}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <Text variant="body-small" color="muted" className="mb-4">
              Showing 11 items
            </Text>
          </div>
          
          {/* Top Right - Headlines/Key Highlights */}
          <div className="order-3 md:order-2">
            <Heading level={4} className="text-lg font-semibold text-gray-900 mb-4">
              Three Key Highlights:
            </Heading>
            <ul className="space-y-3">
              {keyHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  <Text variant="body-base" className="text-gray-700 leading-relaxed">
                    {highlight}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Bottom Left - Meet the News Team */}
          <div className="order-4 md:order-3">
            <Heading level={3} className="text-xl font-semibold text-primary-600 mb-4">
              Meet the News Team
            </Heading>
            
            <Text variant="body-base" color="muted" className="mb-4">
              Meet the Kamunity News Team and find out what&apos;s happening in the Kamunity today.
            </Text>
          </div>
          
          {/* Bottom Right - Audio Player */}
          <div className="order-2 md:order-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <Heading level={4} className="text-lg font-semibold text-primary-600">
                  Listen to Summary
                </Heading>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayToggle}
                    className="w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Profile Avatar */}
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">K</span>
                  </div>
                </div>
              </div>
              
              {/* Audio Progress Bar */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formatTime(audioProgress)}</span>
                <div className="flex-1 h-1 bg-gray-300 rounded-full cursor-pointer"
                     onClick={(e) => {
                       if (audioRef.current) {
                         const rect = e.currentTarget.getBoundingClientRect();
                         const percent = (e.clientX - rect.left) / rect.width;
                         const newTime = percent * audioDuration;
                         audioRef.current.currentTime = newTime;
                         setAudioProgress(newTime);
                       }
                     }}>
                  <div 
                    className="h-1 bg-primary-500 rounded-full transition-all" 
                    style={{ width: `${(audioProgress / audioDuration) * 100}%` }}
                  ></div>
                </div>
                <span>{formatTime(audioDuration)}</span>
              </div>
              
              {/* Hidden Audio Element */}
              <audio ref={audioRef} preload="metadata" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
