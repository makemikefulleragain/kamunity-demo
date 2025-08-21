"use client";

import React, { useState } from 'react';
import { Home } from 'lucide-react';
import HubPageTemplate from '@/components/demo/HubPageTemplate';
import ProgressionBadge from '@/components/demo/ProgressionBadge';
import FocusRoomGenerator from '@/components/demo/FocusRoomGenerator';
import { Text, Heading } from '@/components/ui';
import { roomSeeds } from '@/data/roomSeeds';
import { trackPageView, trackEngagement } from '@/lib/demo/analytics';

export default function RoomsPage() {
  const [showFocusRoomGenerator, setShowFocusRoomGenerator] = useState(false);

  const handleFocusRoomSubmit = async (data: {
    roomName: string;
    primaryGoal: string;
    targetAudience: string;
    timeCommitment: string;
    keyFeatures: string[];
    successMetrics: string[];
  }) => {
    try {
      const response = await fetch('/api/demo/focus-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Focus Room spec sheet generated successfully');
      } else {
        console.error('Failed to generate Focus Room spec sheet');
      }
    } catch (error) {
      console.error('Error submitting Focus Room data:', error);
    }
    
    setShowFocusRoomGenerator(false);
  };

  return (
    <>
    <HubPageTemplate
      hubName="Rooms"
      hubIcon="🏠"
      heroTitle="Rooms - Focused Collaboration Spaces"
      heroDescription="Dedicated spaces where chat threads evolved into ongoing projects. Members collaborate, make decisions, and create real impact together."
      heroStats={[
        { value: '12', label: 'Active Rooms' },
        { value: '89', label: 'Members' },
        { value: '5', label: 'Ready for Clubs' }
      ]}
      heroImageContent={{
        icon: <Home className="w-8 h-8 text-white" />,
        title: 'ROOMS',
        subtitle: 'Collaborative spaces'
      }}
      cards={roomSeeds}
      endMessage={{
        title: 'Ready to Form a Club?',
        description: 'When rooms build strong communities and governance structures, members can vote to promote them to clubs with expanded capabilities and autonomy.',
        actionText: 'Explore Clubs →',
        actionLink: '/clubs'
      }}
    >
      {/* Progression Demo */}
      <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">🏠 Room Governance</h3>
          <p className="text-green-600 text-sm">Rooms introduce member voting and project management capabilities</p>
        </div>
        <ProgressionBadge
          currentLevel="rooms"
          nextLevel="clubs"
          progress={{
            current: 45,
            required: 1,
            type: 'votes'
          }}
          isEligible={true}
        />
        
        {/* Focus Room Generation CTA */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">✨</span>
              <Text className="text-purple-600 font-semibold uppercase tracking-wide">Ready to Create</Text>
            </div>
            <Heading level={3} className="mb-2 text-purple-800">Ready to Create Your Focus Room?</Heading>
            <Text color="muted" className="mb-4 max-w-md mx-auto">
              Get a custom spec sheet with ROI analysis and implementation roadmap tailored to your community vision.
            </Text>
            <a
              href="/create-room"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              <span className="text-lg">✨</span>
              Create Your Focus Room Now
            </a>
          </div>
        </div>
      </div>
    </HubPageTemplate>
    
    <FocusRoomGenerator
      isOpen={showFocusRoomGenerator}
      onClose={() => setShowFocusRoomGenerator(false)}
      onSubmit={handleFocusRoomSubmit}
    />
    </>
  );
}
