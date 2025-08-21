'use client'

import React from 'react';
import { MessageCircle } from 'lucide-react';
import HubPageTemplate from '@/components/demo/HubPageTemplate';
import ProgressionBadge from '@/components/demo/ProgressionBadge';

import { chatSeeds } from '@/data/chatSeeds';


export default function ChatHubPage() {

  return (
    <HubPageTemplate
      hubName="Chat"
      hubIcon="💬"
      heroTitle="Chat Threads - Where Ideas Connect"
      heroDescription="Join threaded conversations that grew from news discussions. Watch ideas evolve and see the most engaging threads get promoted to dedicated rooms."
      heroStats={[
        { value: '23', label: 'Active Threads' },
        { value: '156', label: 'Participants' },
        { value: '8', label: 'Promoted to Rooms' }
      ]}
      heroImageContent={{
        icon: <MessageCircle className="w-8 h-8 text-white" />,
        title: 'CHAT',
        subtitle: 'Threaded discussions'
      }}
      cards={chatSeeds}
      endMessage={{
        title: 'Ready to Create Your Own Room?',
        description: 'When chat threads reach 10+ replies and 30% engagement, they become eligible for promotion to dedicated rooms where deeper collaboration happens.',
        actionText: 'Explore Rooms →',
        actionLink: '/rooms'
      }}
    >
      {/* Progression Demo */}
      <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">🎯 Progression Demo</h3>
          <p className="text-purple-600 text-sm">See how conversations progress from news comments to chat threads to rooms</p>
        </div>
        <ProgressionBadge
          currentLevel="chat"
          nextLevel="rooms"
          progress={{
            current: 23,
            required: 10,
            type: 'replies'
          }}
          isEligible={true}
        />
      </div>
    </HubPageTemplate>
  );
}
