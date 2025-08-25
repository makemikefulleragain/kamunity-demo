'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Zap, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';
import { memoryStore } from '@/lib/demo/memoryStore';
import { calculateCompleteness } from '@/components/rooms/generators/shared/utils';
import { UnifiedRoomData } from '@/components/rooms/generators/shared/types';
import FastTrackGenerator from '@/components/rooms/generators/FastTrackGenerator';
import BalancedGenerator from '@/components/rooms/generators/BalancedGenerator';
import ComprehensiveGenerator from '@/components/rooms/generators/ComprehensiveGenerator';

type GeneratorType = 'fast' | 'balanced' | 'comprehensive' | null;

export default function RoomGeneratorPage() {
  const router = useRouter();
  const [selectedGenerator, setSelectedGenerator] = useState<GeneratorType>(null);
  const [roomData, setRoomData] = useState<Partial<UnifiedRoomData> | null>(null);
  const [showSpec, setShowSpec] = useState(false);
  const [selectedQuickActions, setSelectedQuickActions] = useState<string[]>([]);
  const [completeness, setCompleteness] = useState(0);

  const quickActionOptions = [
    'Schedule Event',
    'View Analytics', 
    'Invite Members',
    'Share Resources',
    'Start Discussion',
    'Create Project',
    'Set Milestones',
    'Track Progress'
  ];

  const handleGeneratorComplete = (data: Partial<UnifiedRoomData>) => {
    // Calculate completeness
    const comp = calculateCompleteness(data);
    setCompleteness(comp);
    
    // Store room data with selected quick actions
    const enrichedData = {
      ...data,
      completeness: comp,
      quickActions: selectedQuickActions.length > 0 ? selectedQuickActions : quickActionOptions.slice(0, 5),
      requirements: [
        { id: 1, title: 'Define room objectives', status: 'active', priority: 'high' },
        { id: 2, title: 'Set up communication channels', status: 'pending', priority: 'medium' },
        { id: 3, title: 'Create onboarding process', status: 'pending', priority: 'high' }
      ],
      impactMetrics: [
        { label: 'Members', value: '0', trend: 'up' },
        { label: 'Projects', value: '0', trend: 'up' },
        { label: 'Impact Score', value: '0', trend: 'up' }
      ]
    };
    
    setRoomData(enrichedData);
    setShowSpec(true);
  };

  const handleCancel = () => {
    setSelectedGenerator(null);
    setSelectedQuickActions([]);
  };

  const handleGoToFocusRoom = () => {
    if (!roomData) return;
    
    // Generate unique room ID
    const roomId = `room_${Date.now()}`;
    
    // Store room data in memory
    memoryStore.set(`room_${roomId}`, roomData);
    
    // Track room creation
    memoryStore.track('room_created', {
      roomId,
      generator: selectedGenerator,
      completeness,
      quickActions: selectedQuickActions
    });
    
    // Navigate to focus room
    router.push(`/rooms/${roomId}/focus`);
  };

  const handleEnhanceRoom = () => {
    if (!roomData) return;
    
    const roomId = `room_${Date.now()}`;
    memoryStore.set(`room_${roomId}`, roomData);
    router.push(`/rooms/${roomId}/enhance`);
  };

  // Quick Actions Selection Component
  const QuickActionsSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Select Quick Actions (3-5)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActionOptions.map(action => {
          const isSelected = selectedQuickActions.includes(action);
          const canSelect = selectedQuickActions.length < 5;
          
          return (
            <button
              key={action}
              onClick={() => {
                if (isSelected) {
                  setSelectedQuickActions(prev => prev.filter(a => a !== action));
                } else if (canSelect) {
                  setSelectedQuickActions(prev => [...prev, action]);
                }
              }}
              disabled={!isSelected && !canSelect}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : canSelect
                    ? 'border-gray-200 hover:border-gray-300 bg-white'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{action}</span>
                {isSelected && <Check className="w-4 h-4 ml-2" />}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-sm text-gray-600 mt-3">
        Selected: {selectedQuickActions.length}/5 
        {selectedQuickActions.length < 3 && ' (minimum 3 required)'}
      </p>
    </div>
  );

  // Generator Selection Screen
  if (!selectedGenerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/rooms" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Focus Room</h1>
            <p className="text-xl text-gray-600">Choose a generator that matches your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Fast Track */}
            <button
              onClick={() => setSelectedGenerator('fast')}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 text-left border-2 border-transparent hover:border-green-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium">60-70% Complete</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Track</h3>
              <p className="text-gray-600 mb-4">Get started quickly with essential details</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Basic room setup
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Core features enabled
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Ready in 2 minutes
                </li>
              </ul>
            </button>

            {/* Balanced */}
            <button
              onClick={() => setSelectedGenerator('balanced')}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 text-left border-2 border-transparent hover:border-blue-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-blue-600 font-medium">75-85% Complete</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Balanced</h3>
              <p className="text-gray-600 mb-4">Comprehensive setup with good detail</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-500" />
                  Detailed objectives
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-500" />
                  Member roles defined
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-500" />
                  Most features unlocked
                </li>
              </ul>
            </button>

            {/* Comprehensive */}
            <button
              onClick={() => setSelectedGenerator('comprehensive')}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 text-left border-2 border-transparent hover:border-purple-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-purple-600 font-medium">90-100% Complete</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive</h3>
              <p className="text-gray-600 mb-4">Full professional setup with all details</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-500" />
                  Complete specification
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-500" />
                  All features unlocked
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-500" />
                  Priority support
                </li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show Spec Preview
  if (showSpec && roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={() => {
                setShowSpec(false);
                setSelectedGenerator(null);
                setSelectedQuickActions([]);
              }}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Over
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Room Specification</h2>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Completeness</p>
                  <p className="text-2xl font-bold text-blue-600">{completeness}%</p>
                </div>
                <div className="w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle cx="48" cy="48" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="48" cy="48" r="36"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(completeness / 100) * 226.2} 226.2`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700">Title</h3>
                <p className="text-gray-900">{roomData.title || 'Untitled Room'}</p>
              </div>
              
              {roomData.purpose && (
                <div>
                  <h3 className="font-semibold text-gray-700">Purpose</h3>
                  <p className="text-gray-900">{roomData.purpose}</p>
                </div>
              )}

              {roomData.description && (
                <div>
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-900">{roomData.description}</p>
                </div>
              )}

              {roomData.targetAudience && (
                <div>
                  <h3 className="font-semibold text-gray-700">Target Audience</h3>
                  <p className="text-gray-900">{roomData.targetAudience}</p>
                </div>
              )}

              {roomData.expectedOutcomes && roomData.expectedOutcomes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700">Expected Outcomes</h3>
                  <ul className="list-disc list-inside text-gray-900">
                    {roomData.expectedOutcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {completeness < 100 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Complete Your Room to 100%</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Unlock advanced features by adding more details:
                </p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• AI-powered insights and recommendations</li>
                  <li>• Automated workflow suggestions</li>
                  <li>• Advanced analytics and reporting</li>
                  <li>• Priority support and guidance</li>
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleGoToFocusRoom}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Go to Focus Room
              </button>
              {completeness < 100 && (
                <button
                  onClick={handleEnhanceRoom}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                >
                  Enhance Room
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Generator with Quick Actions
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </button>
        </div>

        {/* Quick Actions Selection */}
        {selectedQuickActions.length < 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <QuickActionsSelector />
          </div>
        )}

        {/* Generator Component */}
        {selectedQuickActions.length >= 3 && (
          <>
            {selectedGenerator === 'fast' && (
              <FastTrackGenerator onComplete={handleGeneratorComplete} onCancel={handleCancel} />
            )}
            {selectedGenerator === 'balanced' && (
              <BalancedGenerator onComplete={handleGeneratorComplete} onCancel={handleCancel} />
            )}
            {selectedGenerator === 'comprehensive' && (
              <ComprehensiveGenerator onComplete={handleGeneratorComplete} onCancel={handleCancel} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
