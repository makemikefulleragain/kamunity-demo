"use client";

import React from 'react';
import { Globe } from 'lucide-react';
import HubPageTemplate from '@/components/demo/HubPageTemplate';
import ProgressionBadge from '@/components/demo/ProgressionBadge';

import { communitySeeds } from '@/data/communitySeeds';

export default function CommunitiesPage() {
  return (
    <HubPageTemplate
      hubName="Communities"
      hubIcon="🌍"
      heroTitle="Communities - Autonomous Networks"
      heroDescription="Self-governing federations of clubs that operate with democratic decision-making. These communities have their own governance structures while staying connected to the broader Kamunity network."
      heroStats={[
        { value: '40', label: 'Active Communities' },
        { value: '312', label: 'Member Clubs' },
        { value: '8,934', label: 'Total Members' }
      ]}
      heroImageContent={{
        icon: <Globe className="w-8 h-8 text-white" />,
        title: 'COMMUNITIES',
        subtitle: 'Autonomous networks'
      }}
      cards={communitySeeds.map(community => ({
        ...community,
        description: `${community.description} | ${community.memberClubs} member clubs • ${community.totalMembers} total members • ${community.governanceModel} • ${community.autonomyLevel}`
      }))}
      endMessage={{
        title: 'The Future of Community',
        description: 'Communities represent the highest level of organization in Kamunity - autonomous, democratic, and powerful. The Values Exchange will soon connect communities for resource sharing and mutual aid.',
        actionText: 'Values Exchange (Coming Soon) →',
        actionLink: '/values-exchange'
      }}
    >
      {/* Community Governance Demo */}
      <div className="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">🌍 Community Autonomy</h3>
          <p className="text-indigo-600 text-sm">Communities operate independently with federated governance and democratic decision-making</p>
        </div>
        
        {/* Community Structure Example */}
        <div className="bg-white rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Green City Network</h4>
            <span className="text-sm text-gray-500">289 members across 5 clubs</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm font-medium text-green-700">🏢 Sustainable Living Club</span>
              <span className="text-xs text-green-600">127 members</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm font-medium text-blue-700">🏢 Urban Transit Advocates</span>
              <span className="text-xs text-blue-600">89 members</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span className="text-sm font-medium text-purple-700">🏢 Climate Policy Network</span>
              <span className="text-xs text-purple-600">73 members</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Governance Model:</span>
              <span className="font-medium text-indigo-600">Federated Democracy</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Decision Making:</span>
              <span className="font-medium text-indigo-600">Consensus + Voting</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <ProgressionBadge
            currentLevel="communities"
            progress={{
              current: 0,
              required: 0,
              type: 'engagement'
            }}
          />
        </div>
      </div>
    </HubPageTemplate>
  );
}
