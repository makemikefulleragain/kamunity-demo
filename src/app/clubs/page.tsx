"use client";

import React from 'react';
import { Building } from 'lucide-react';
import HubPageTemplate from '@/components/demo/HubPageTemplate';
import ProgressionBadge from '@/components/demo/ProgressionBadge';
import { goldenThreads } from '@/data/goldenThreads';


export default function ClubsPage() {
  return (
    <HubPageTemplate
      hubName="Clubs"
      hubIcon="🏢"
      heroTitle="Clubs - Organized Community Groups"
      heroDescription="Established organizations formed when rooms unite around shared missions. Clubs have governance structures, multiple rooms, and drive significant community impact."
      heroStats={[
        { value: '15', label: 'Active Clubs' },
        { value: '45', label: 'Member Rooms' },
        { value: '3,073', label: 'Total Members' }
      ]}
      heroImageContent={{
        icon: <Building className="w-8 h-8 text-white" />,
        title: 'CLUBS',
        subtitle: 'Organized groups'
      }}
      cards={goldenThreads
        .filter(thread => thread.club)
        .map(thread => ({
          id: thread.club!.id,
          title: thread.club!.name,
          description: `${thread.club!.description} | ${thread.club!.memberRooms.length} member rooms • ${thread.club!.totalMembers} total members`,
          category: `${thread.category.charAt(0).toUpperCase() + thread.category.slice(1)} Club`,
          engagement: thread.club!.impactScore,
          commentCount: Math.floor(thread.club!.totalMembers / 3),
          tags: [thread.category, 'collaborative', 'community-driven'],
          createdAt: new Date().toISOString(),
          promotionStatus: 'none' as const
        }))}
      endMessage={{
        title: 'Ready to Build a Community?',
        description: 'When clubs demonstrate strong governance and connect with related clubs, they can form autonomous communities with federated decision-making power.',
        actionText: 'Explore Communities →',
        actionLink: '/communities'
      }}
    >
      {/* Club Features Demo */}
      <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">🏢 Club Capabilities</h3>
          <p className="text-orange-600 text-sm">Clubs can manage multiple rooms, set governance policies, and coordinate large-scale initiatives</p>
        </div>
        
        {/* Expandable Club Example */}
        <div className="bg-white rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Sustainable Living Club</h4>
            <span className="text-sm text-gray-500">127 members</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="bg-green-50 p-2 rounded text-center">
              <div className="font-medium text-green-700">Urban Gardens</div>
              <div className="text-green-600">23 members</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="font-medium text-blue-700">Solar Energy</div>
              <div className="text-blue-600">18 members</div>
            </div>
            <div className="bg-purple-50 p-2 rounded text-center">
              <div className="font-medium text-purple-700">Zero Waste</div>
              <div className="text-purple-600">31 members</div>
            </div>
            <div className="bg-yellow-50 p-2 rounded text-center">
              <div className="font-medium text-yellow-700">Policy Advocacy</div>
              <div className="text-yellow-600">15 members</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <ProgressionBadge
            currentLevel="clubs"
            nextLevel="communities"
            progress={{
              current: 3,
              required: 1,
              type: 'votes'
            }}
            isEligible={true}
          />
        </div>
      </div>
    </HubPageTemplate>
  );
}
