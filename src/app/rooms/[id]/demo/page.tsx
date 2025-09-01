'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Mail } from 'lucide-react';
import Link from 'next/link';
import { memoryStore } from '@/lib/demo/memoryStore';
import { UnifiedRoomData } from '@/components/rooms/generators/shared/types';
import GeneratedRoom from '@/components/rooms/generators/GeneratedRoom';

export default function DemoRoomPage() {
  const params = useParams();
  const [roomData, setRoomData] = useState<UnifiedRoomData | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    if (params.id) {
      const data = memoryStore.get(`room_${params.id}`);
      if (data) {
        setRoomData(data as UnifiedRoomData);
      }
    }
  }, [params.id]);

  const handleEmailRoom = async () => {
    if (!roomData || !email.trim()) return;

    const emailData = {
      to_email: email,
      user_email: email,
      room_name: roomData.name,
      room_purpose: roomData.purpose,
      room_features: roomData.tools?.join(', ') || '',
      rating: rating,
      feedback: feedback,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/demo/room-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        alert('Room details emailed successfully!');
        setShowRating(false);
      } else {
        alert('Email failed. Please try again.');
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('Email failed. Please try again.');
    }
  };

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room Not Found</h2>
          <Link href="/rooms/generate" className="text-blue-600 hover:text-blue-700">
            Create a New Room
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <GeneratedRoom 
          roomData={roomData}
          onBack={() => window.history.back()}
          onEnhance={() => {}}
        />

        {/* Rating Modal */}
        {showRating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Email Room Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate this room (1-5 stars)
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want this room? (Optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us why this room would be valuable to you..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowRating(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleEmailRoom}
                  disabled={!email.trim() || rating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
