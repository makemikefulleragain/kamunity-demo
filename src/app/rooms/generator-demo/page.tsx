'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Play, Plus, ArrowRight } from 'lucide-react';
import SpecBuilder from '@/components/rooms/generators/shared/SpecBuilder';
import QuestionEngine from '@/components/rooms/generators/shared/QuestionEngine';
import GeneratedRoom from '@/components/rooms/generators/GeneratedRoom';
import { UnifiedRoomData } from '@/components/rooms/generators/shared/types';

export default function GeneratorDemoPage() {
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [currentView, setCurrentView] = useState<'modal' | 'spec' | 'enhance' | 'room'>('modal');
  const [currentRoom, setCurrentRoom] = useState<UnifiedRoomData | null>(null);
  const [showSpec, setShowSpec] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const handleRoomCreated = (roomData: UnifiedRoomData) => {
    setCurrentRoom(roomData);
    setCurrentView('spec');
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).demoAnalytics) {
      (window as any).demoAnalytics.track('room_created', {
        generator: roomData.tier,
        category: roomData.category,
        completeness: roomData.completeness
      });
    }
  };

  const handleEnhanceSpec = () => {
    setCurrentView('enhance');
  };

  const handleQuestionsComplete = () => {
    setCurrentView('spec');
  };

  const handleRoomUpdate = (updatedData: UnifiedRoomData) => {
    setCurrentRoom(updatedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Room Generator Demo</h1>
              <p className="text-gray-600 mt-1">Test the unified room generation system</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>New Unified Generator System</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Perfect Community Room
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose from three tailored experiences: Fast Track (30-60s), Balanced (2-3min), or Comprehensive (5-8min). 
            Each path creates both a demo room and professional spec sheet.
          </p>

          <a
            href="/rooms/generate"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-6 h-6" />
            Create New Room
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">AI-Powered Defaults</h3>
            <p className="text-gray-600">
              Smart suggestions and auto-completion based on your room purpose and category
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Professional Spec Sheets</h3>
            <p className="text-gray-600">
              Generate detailed specifications with ROI analysis and implementation roadmaps
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Adaptive Enhancement</h3>
            <p className="text-gray-600">
              Complete your spec with intelligent questions that adapt to your needs
            </p>
          </div>
        </div>

        {/* Current Room Status */}
        {currentRoom && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4">Current Room</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{currentRoom.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold">{currentRoom.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Generator Used</p>
                <p className="font-semibold capitalize">{currentRoom.tier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completeness</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${currentRoom.completeness}%` }}
                    />
                  </div>
                  <span className="font-semibold">{currentRoom.completeness}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('room')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Generate Room
              </button>
              {currentRoom.completeness < 100 && (
                <button
                  onClick={() => setCurrentView('enhance')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Enhance Spec
                </button>
              )}
              <button
                onClick={() => {
                  setCurrentView('modal');
                  setCurrentRoom(null);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-lg mb-3">How to Test</h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              <span>Click "Create New Room" to open the generator selection modal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              <span>Choose between Fast Track, Balanced, or Comprehensive generators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              <span>Complete the form to create your room and spec sheet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">4.</span>
              <span>Use the Question Engine to enhance incomplete specs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">5.</span>
              <span>View and download your professional spec sheet</span>
            </li>
          </ol>
        </div>
      </div>


      {/* Spec View */}
      {currentView === 'spec' && currentRoom && (
        <SpecBuilder
          roomData={currentRoom}
          onClose={() => setCurrentView('modal')}
          onEnhance={currentRoom.completeness < 100 ? handleEnhanceSpec : undefined}
        />
      )}

      {/* Enhancement View */}
      {currentView === 'enhance' && currentRoom && (
        <QuestionEngine
          roomData={currentRoom}
          onUpdate={handleRoomUpdate}
          onComplete={handleQuestionsComplete}
          onSkip={() => setCurrentView('spec')}
        />
      )}

      {/* Generated Room View */}
      {currentView === 'room' && currentRoom && (
        <GeneratedRoom
          roomData={currentRoom}
          onBack={() => setCurrentView('spec')}
          onEnhance={() => setCurrentView('enhance')}
        />
      )}
    </div>
  );
}
