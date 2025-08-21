'use client'

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';

interface MobileOptimizationsProps {
  children: React.ReactNode;
  hubName: string;
}

const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ children, hubName }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-optimized">
      {/* Mobile Header Controls */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">{hubName}</h2>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            
            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                🧵 Golden Threads
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                High Engagement
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                Recent
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Touch Interactions */}
      <div className={`mobile-content ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
        {children}
      </div>

      <style jsx>{`
        .mobile-content {
          padding: 1rem;
        }
        
        .list-view :global(.grid) {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.75rem !important;
        }
        
        .list-view :global(.card) {
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
        
        .grid-view :global(.card) {
          min-height: 120px !important;
          touch-action: manipulation !important;
        }
        
        /* Enhanced touch targets */
        :global(.card:active) {
          transform: scale(0.98) !important;
          transition: transform 0.1s ease !important;
        }
        
        :global(.button:active) {
          transform: scale(0.95) !important;
          transition: transform 0.1s ease !important;
        }
        
        /* Improved scrolling */
        .mobile-content {
          -webkit-overflow-scrolling: touch !important;
          scroll-behavior: smooth !important;
        }
        
        /* Better tap highlights */
        :global(.card),
        :global(.button) {
          -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default MobileOptimizations;
