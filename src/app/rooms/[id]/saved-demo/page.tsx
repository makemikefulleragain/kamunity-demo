'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { memoryStore } from '@/lib/demo/memoryStore';
import { UnifiedRoomData } from '@/components/rooms/generators/shared/types';
import GeneratedRoom from '@/components/rooms/generators/GeneratedRoom';

export default function SavedDemoRoomPage() {
  const params = useParams();
  const [roomData, setRoomData] = useState<UnifiedRoomData | null>(null);
  const [savedStats, setSavedStats] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      // Look for saved room data
      const savedRoomKey = `saved-room-${params.id}`;
      const savedRoom = memoryStore.get(savedRoomKey);
      
      if (savedRoom && savedRoom.roomData) {
        setRoomData(savedRoom.roomData);
        setSavedStats(savedRoom.stats);
      }
    }
  }, [params.id]);

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved Demo Room Not Found</h2>
          <p className="text-gray-600 mb-4">This saved demo room may have been removed or the link is invalid.</p>
          <Link href="/rooms" className="text-blue-600 hover:text-blue-700">
            ← Back to Room Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <div className="flex-1">
        <GeneratedRoom 
          roomData={roomData}
          onBack={() => window.history.back()}
          onEnhance={() => {}}
        />
      </div>
      
      {/* Saved Demo Banner - prominent bottom banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 border-t-4 border-green-400 mt-auto shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              <div className="text-center md:text-left">
                <div className="text-lg font-bold text-white mb-1">
                  💾 Saved Demo Room
                </div>
                <div className="text-green-100 text-sm">
                  This is your saved Focus Room from the generator - explore all features!
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/rooms" 
                className="bg-white text-green-600 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View All Rooms →
              </Link>
              <Link 
                href="/rooms/generate" 
                className="bg-green-400 text-green-900 hover:bg-green-300 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Generate New Room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
