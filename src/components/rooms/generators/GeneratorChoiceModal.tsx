'use client';

import React, { useState } from 'react';
import { Zap, Target, Trophy, X, Clock, CheckCircle } from 'lucide-react';
import FastTrackGenerator from './FastTrackGenerator';
import BalancedGenerator from './BalancedGenerator';
import ComprehensiveGenerator from './ComprehensiveGenerator';
import { UnifiedRoomData } from './shared/types';

interface GeneratorChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (roomData: UnifiedRoomData) => void;
  triggerSource?: 'homepage' | 'rooms' | 'welcome' | 'manual';
}

export default function GeneratorChoiceModal({ 
  isOpen, 
  onClose, 
  onRoomCreated,
  triggerSource = 'manual'
}: GeneratorChoiceModalProps) {
  const [selectedGenerator, setSelectedGenerator] = useState<'fast' | 'balanced' | 'comprehensive' | null>(null);

  if (!isOpen) return null;

  const handleRoomComplete = (roomData: UnifiedRoomData) => {
    onRoomCreated(roomData);
    setSelectedGenerator(null);
    onClose();
  };

  const handleCancel = () => {
    setSelectedGenerator(null);
  };

  // Show selected generator
  if (selectedGenerator === 'fast') {
    return (
      <FastTrackGenerator
        onComplete={handleRoomComplete}
        onCancel={handleCancel}
        triggerSource={triggerSource}
      />
    );
  }

  if (selectedGenerator === 'balanced') {
    return (
      <BalancedGenerator
        onComplete={handleRoomComplete}
        onCancel={handleCancel}
        triggerSource={triggerSource}
      />
    );
  }

  if (selectedGenerator === 'comprehensive') {
    return (
      <ComprehensiveGenerator
        onComplete={handleRoomComplete}
        onCancel={handleCancel}
        triggerSource={triggerSource}
      />
    );
  }

  // Show choice modal
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Room Creation Path</h2>
              <p className="text-blue-100 mt-1">Select the experience that matches your needs</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Fast Track */}
            <button
              onClick={() => setSelectedGenerator('fast')}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                POPULAR
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Fast Track</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>30-60 seconds</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                Perfect when you know what you want. Quick form, instant room creation with AI-enhanced features.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Single-screen form</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>AI auto-generates details</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant demo room</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700">Best for:</p>
                <p className="text-sm text-gray-600">Quick ideas, testing concepts, urgent needs</p>
              </div>
            </button>

            {/* Balanced */}
            <button
              onClick={() => setSelectedGenerator('balanced')}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all text-left"
            >
              <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                RECOMMENDED
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Balanced</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>2-3 minutes</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                Guided experience with smart suggestions. Perfect balance of speed and customization.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>4-step guided process</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>AI recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Feature selection</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700">Best for:</p>
                <p className="text-sm text-gray-600">Most users, thoughtful planning, team rooms</p>
              </div>
            </button>

            {/* Comprehensive */}
            <button
              onClick={() => setSelectedGenerator('comprehensive')}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all text-left"
            >
              <div className="absolute -top-3 -right-3 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                PROFESSIONAL
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg text-white">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Comprehensive</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>5-8 minutes</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                Professional consultation for serious community builders. Full strategic planning included.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>6-step methodology</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>ROI analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional spec</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700">Best for:</p>
                <p className="text-sm text-gray-600">Organizations, funded projects, long-term vision</p>
              </div>
            </button>
          </div>

          {/* Help text */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Not sure which to choose?</strong> Start with Balanced for the best experience. 
              You can always enhance your room spec after creation!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
