"use client";

import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import HubPageTemplate from '@/components/demo/HubPageTemplate';
import ProgressionBadge from '@/components/demo/ProgressionBadge';
import RoomSpecModal from '@/components/rooms/RoomSpecModal';
import { Text, Heading } from '@/components/ui';
import { roomSeeds, RoomItem } from '@/data/roomSeeds';
import { DemoRoomData } from '@/lib/admin/database';

export default function RoomsPage() {
  const [allRooms, setAllRooms] = useState<RoomItem[]>(roomSeeds);
  const [selectedRoom, setSelectedRoom] = useState<DemoRoomData | null>(null);
  const [showSpecModal, setShowSpecModal] = useState(false);

  // Load saved demo rooms from hybrid storage
  useEffect(() => {
    const loadSavedRooms = async () => {
      console.log('Loading saved rooms from hybrid storage...');
      
      try {
        const { HybridStorage } = await import('@/lib/storage/hybrid-storage');
        const localRooms = HybridStorage.getLocalRooms();
        
        const savedRooms = localRooms.map(room => ({
          id: room.id,
          title: room.title,
          description: room.description,
          category: room.category || 'Saved Demo',
          engagement: room.engagement || 0,
          commentCount: 0,
          tags: room.tags || [],
          createdAt: room.createdAt,
          demoType: 'saved-room',
          roomData: room.roomData,
          hasDetailedSpec: !!room.roomData
        }));

        console.log('Processed saved rooms:', savedRooms);
        
        // Combine saved rooms with existing room seeds (saved rooms first)
        const combinedRooms = [...savedRooms, ...roomSeeds];
        console.log('Combined rooms total:', combinedRooms.length);
        setAllRooms(combinedRooms);
      } catch (error) {
        console.error('Failed to load saved rooms:', error);
        setAllRooms(roomSeeds);
      }
    };

    // Initial load
    loadSavedRooms();
    
    // Listen for URL parameters to force refresh
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('refresh') || urlParams.get('t')) {
      console.log('Refresh parameter detected, forcing room reload...');
      setTimeout(loadSavedRooms, 100);
    }
    
    // Listen for room spec modal events
    const handleViewRoomSpec = (event: CustomEvent) => {
      const room = event.detail;
      setSelectedRoom(room);
      setShowSpecModal(true);
    };
    
    // Also listen for storage events in case rooms are saved from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kamunity_demo_rooms') {
        console.log('Storage change detected, reloading rooms...');
        loadSavedRooms();
      }
    };
    
    window.addEventListener('viewRoomSpec', handleViewRoomSpec);
    window.addEventListener('storage', handleStorageChange);
    
    // Set up interval to check for new rooms periodically
    const interval = setInterval(loadSavedRooms, 30000);
    
    return () => {
      window.removeEventListener('viewRoomSpec', handleViewRoomSpec);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);


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
      cards={allRooms}
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
              href="/rooms/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              <span className="text-lg">✨</span>
              Create Your Focus Room Now
            </a>
          </div>
        </div>
      </div>
    </HubPageTemplate>
    
    
    {/* Room Spec Modal */}
    <RoomSpecModal
      room={selectedRoom}
      isOpen={showSpecModal}
      onClose={() => setShowSpecModal(false)}
    />
    </>
  );
}
