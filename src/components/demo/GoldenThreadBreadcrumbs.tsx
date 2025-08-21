'use client'

import React from 'react';
import { ChevronRight, Home, MessageCircle, Users, Building, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  hub: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

interface GoldenThreadBreadcrumbsProps {
  currentHub: string;
  threadId?: string;
  className?: string;
}

const hubIcons = {
  news: <Home className="w-4 h-4" />,
  chat: <MessageCircle className="w-4 h-4" />,
  rooms: <Users className="w-4 h-4" />,
  clubs: <Building className="w-4 h-4" />,
  communities: <Globe className="w-4 h-4" />
};

const hubOrder = ['news', 'chat', 'rooms', 'clubs', 'communities'];

const GoldenThreadBreadcrumbs: React.FC<GoldenThreadBreadcrumbsProps> = ({ 
  currentHub, 
  threadId,
  className = '' 
}) => {
  const getCurrentHubIndex = () => hubOrder.indexOf(currentHub);
  const currentIndex = getCurrentHubIndex();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Add all hubs up to and including current
    for (let i = 0; i <= currentIndex; i++) {
      const hub = hubOrder[i];
      breadcrumbs.push({
        hub,
        title: hub.charAt(0).toUpperCase() + hub.slice(1),
        href: `/${hub}`,
        icon: hubIcons[hub as keyof typeof hubIcons],
        isActive: i === currentIndex
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg border border-blue-200">
        <span className="text-blue-600 font-medium mr-2">🧵 Golden Thread:</span>
        
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.hub}>
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-gray-400 mx-1" />
            )}
            
            {item.isActive ? (
              <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded text-blue-700 font-medium">
                {item.icon}
                <span>{item.title}</span>
              </div>
            ) : (
              <Link 
                href={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}
          </React.Fragment>
        ))}

        {/* Show next step if not at the end */}
        {currentIndex < hubOrder.length - 1 && (
          <>
            <ArrowRight className="w-3 h-3 text-gray-400 mx-2" />
            <Link
              href={`/${hubOrder[currentIndex + 1]}`}
              className="flex items-center space-x-1 text-gray-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors border border-dashed border-gray-300"
            >
              {hubIcons[hubOrder[currentIndex + 1] as keyof typeof hubIcons]}
              <span className="text-xs">Next: {hubOrder[currentIndex + 1].charAt(0).toUpperCase() + hubOrder[currentIndex + 1].slice(1)}</span>
            </Link>
          </>
        )}
      </div>

      {threadId && (
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Thread: {threadId}
        </div>
      )}
    </div>
  );
};

export default GoldenThreadBreadcrumbs;
