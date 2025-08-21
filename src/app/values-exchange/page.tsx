"use client";

import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import HubPageTemplate from '@/components/demo/HubPageTemplate';
import ProgressionBadge from '@/components/demo/ProgressionBadge';

// Mock values exchange data for demo
const mockExchangeItems = [
  {
    id: '1',
    title: 'Community Tool Library',
    description: 'Coming Soon: Share tools, equipment, and resources across communities. Democratic resource allocation based on community needs and contributions.',
    category: 'Resource Exchange',
    engagement: 0,
    commentCount: 0,
    tags: ['tools', 'sharing', 'resources'],
    createdAt: new Date().toISOString(),
    promotionStatus: 'none' as const
  },
  {
    id: '2',
    title: 'Skill & Knowledge Network',
    description: 'Coming Soon: Connect communities for knowledge sharing, mentorship, and collaborative learning across different domains and expertise areas.',
    category: 'Knowledge Exchange',
    engagement: 0,
    commentCount: 0,
    tags: ['skills', 'knowledge', 'mentorship'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    promotionStatus: 'none' as const
  },
  {
    id: '3',
    title: 'Mutual Aid Coordination',
    description: 'Coming Soon: Coordinate mutual aid efforts between communities. Emergency response, resource sharing, and solidarity networks.',
    category: 'Mutual Aid',
    engagement: 0,
    commentCount: 0,
    tags: ['mutual-aid', 'emergency', 'solidarity'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    promotionStatus: 'none' as const
  }
];

export default function ValuesExchangePage() {
  return (
    <HubPageTemplate
      hubName="Values Exchange"
      hubIcon="⚖️"
      heroTitle="Values Exchange - Coming Soon"
      heroDescription="The future of inter-community collaboration. A democratic marketplace for sharing resources, knowledge, and mutual aid between autonomous communities based on shared values rather than profit."
      heroStats={[
        { value: '∞', label: 'Potential Connections' },
        { value: '0', label: 'Active Exchanges' },
        { value: 'Soon', label: 'Launch Status' }
      ]}
      heroImageContent={{
        icon: <ArrowRightLeft className="w-8 h-8 text-white" />,
        title: 'VALUES EXCHANGE',
        subtitle: 'Coming soon'
      }}
      cards={mockExchangeItems}
      endMessage={{
        title: 'The Vision Ahead',
        description: 'The Values Exchange will enable communities to share resources, knowledge, and support based on mutual aid principles rather than market transactions. A new economy built on cooperation and shared values.',
        actionText: 'Join the Conversation →',
        actionLink: '/chat'
      }}
    >
      {/* Coming Soon Features */}
      <div className="mt-12 p-6 bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-violet-700 mb-2">⚖️ Values-Based Exchange</h3>
          <p className="text-violet-600 text-sm">A new model for community resource sharing built on cooperation, not competition</p>
        </div>
        
        {/* Feature Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-violet-200 opacity-75">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm">🔧</span>
              </div>
              <h4 className="font-semibold text-gray-700">Resource Sharing</h4>
            </div>
            <p className="text-sm text-gray-600">Tools, equipment, and materials shared democratically across communities</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-violet-200 opacity-75">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-sm">🧠</span>
              </div>
              <h4 className="font-semibold text-gray-700">Knowledge Exchange</h4>
            </div>
            <p className="text-sm text-gray-600">Skills, expertise, and learning opportunities shared across networks</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-violet-200 opacity-75">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 text-sm">🤝</span>
              </div>
              <h4 className="font-semibold text-gray-700">Mutual Aid Networks</h4>
            </div>
            <p className="text-sm text-gray-600">Coordinated support systems for emergencies and community needs</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-violet-200 opacity-75">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-sm">⚖️</span>
              </div>
              <h4 className="font-semibold text-gray-700">Values Alignment</h4>
            </div>
            <p className="text-sm text-gray-600">Exchanges based on shared principles rather than market value</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-violet-100 to-pink-100 rounded-lg p-4">
          <div className="text-center">
            <h4 className="font-semibold text-violet-800 mb-2">🚀 Coming in Phase 4</h4>
            <p className="text-sm text-violet-700 mb-3">
              The Values Exchange represents the culmination of the Kamunity vision - autonomous communities 
              cooperating through shared values rather than competing through market forces.
            </p>
            <ProgressionBadge
              currentLevel="values-exchange"
              progress={{
                current: 0,
                required: 0,
                type: 'development'
              }}
            />
          </div>
        </div>
      </div>
    </HubPageTemplate>
  );
}
