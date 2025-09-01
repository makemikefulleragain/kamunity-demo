'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Wrench, Search, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { memoryStore } from '@/lib/demo/memoryStore';
import { UnifiedRoomData } from '@/components/rooms/generators/shared/types';
import KamunityRoomGenerator from '@/components/rooms/generators/KamunityRoomGenerator';
import PreBuiltRoomSelector from '@/components/rooms/generators/PreBuiltRoomSelector';

type WorkflowType = 'kamunity' | 'prebuilt' | null;
type PreBuiltRoomType = 'project' | 'exploration' | 'advocate' | 'get-together';

export default function RoomGeneratorPage() {
  const router = useRouter();
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType>(null);
  const [selectedPreBuiltType, setSelectedPreBuiltType] = useState<PreBuiltRoomType | null>(null);
  // Removed roomData state - data now passed directly to demo room
  // Removed showDemo state - now navigates directly to demo room

  const preBuiltRoomTemplates = {
    project: {
      name: 'Project Room',
      description: 'Organize and execute community projects with clear goals and timelines',
      icon: Wrench,
      features: ['Task Management', 'Timeline Tracking', 'Resource Sharing', 'Progress Reports'],
      color: 'blue'
    },
    exploration: {
      name: 'Exploration Room', 
      description: 'Discover new ideas and opportunities through collaborative research',
      icon: Search,
      features: ['Research Tools', 'Idea Board', 'Discussion Forums', 'Knowledge Base'],
      color: 'green'
    },
    advocate: {
      name: 'Advocate Room',
      description: 'Rally support and drive change for important community causes',
      icon: Users,
      features: ['Campaign Tools', 'Petition System', 'Event Planning', 'Impact Tracking'],
      color: 'red'
    },
    'get-together': {
      name: 'Get Together Room',
      description: 'Build connections through social events and community gatherings',
      icon: Calendar,
      features: ['Event Calendar', 'RSVP System', 'Social Feed', 'Photo Sharing'],
      color: 'purple'
    }
  };

  const handleWorkflowComplete = (data: Partial<UnifiedRoomData>) => {
    // Generate unique room ID
    const roomId = `room_${Date.now()}`;
    
    // Store room data in memory
    memoryStore.set(`room_${roomId}`, data);
    
    // Track room creation
    memoryStore.track('room_created', {
      roomId,
      workflow: selectedWorkflow,
      preBuiltType: selectedPreBuiltType,
      timestamp: new Date().toISOString()
    });
    
    // Navigate directly to demo room
    router.push(`/rooms/${roomId}/demo`);
  };

  const handleCancel = () => {
    setSelectedWorkflow(null);
    setSelectedPreBuiltType(null);
  };

  // Removed handleGoToDemo - functionality moved to handleWorkflowComplete

  // Main 50/50 Split Layout
  if (!selectedWorkflow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/rooms" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Focus Room</h1>
            <p className="text-xl text-gray-600">Choose your preferred approach to room creation</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Kamunity Room Generator */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Kamunity Room Generator</h2>
                <p className="text-gray-600">Professional consultation approach with comprehensive specification</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-purple-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Introduction & Safeguards</h4>
                    <p className="text-sm text-gray-600">Clear purpose explanation with transparency checks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-purple-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Clarifying Questions</h4>
                    <p className="text-sm text-gray-600">Deep dive into audience, goals, and constraints</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Confirmation & Alignment</h4>
                    <p className="text-sm text-gray-600">Explicit confirmation before proceeding</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-purple-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Comprehensive Specification</h4>
                    <p className="text-sm text-gray-600">Full 8-section professional room spec with wireframes</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedWorkflow('kamunity')}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg"
              >
                Let's Design a Kamunity Room
              </button>
            </div>

            {/* Right Column - Pre-built Room Templates */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pre-built Room Templates</h2>
                <p className="text-gray-600">Quick start with proven room configurations</p>
                <p className="text-sm text-blue-600 font-medium mt-2">NB: Once open, you can tweak the settings</p>
              </div>
              
              <div className="space-y-4">
                {Object.entries(preBuiltRoomTemplates).map(([key, template]) => {
                  const IconComponent = template.icon;
                  const colorClasses = {
                    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
                    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                  };
                  
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedPreBuiltType(key as PreBuiltRoomType);
                        setSelectedWorkflow('prebuilt');
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[template.color]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {template.features.slice(0, 2).map((feature, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                            {template.features.length > 2 && (
                              <span className="text-xs text-gray-500">+{template.features.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Removed intermediate "Demo Room is Ready" step - now goes directly to demo room

  // Show Workflow Components
  if (selectedWorkflow === 'kamunity') {
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
          
          <KamunityRoomGenerator 
            onComplete={handleWorkflowComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }
  
  if (selectedWorkflow === 'prebuilt' && selectedPreBuiltType) {
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
          
          <PreBuiltRoomSelector 
            roomType={selectedPreBuiltType}
            template={preBuiltRoomTemplates[selectedPreBuiltType]}
            onComplete={handleWorkflowComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <button
          onClick={handleCancel}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
