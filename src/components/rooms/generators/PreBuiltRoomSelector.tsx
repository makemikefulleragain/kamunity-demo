'use client';

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { UnifiedRoomData } from './shared/types';

interface PreBuiltRoomSelectorProps {
  roomType: string;
  template: {
    name: string;
    description: string;
    icon: any;
    features: string[];
    color: string;
  };
  onComplete: (data: UnifiedRoomData) => void;
  onCancel: () => void;
}

interface CustomizationData {
  name: string;
  purpose: string;
  goals: string;
  metrics: string;
}

export default function PreBuiltRoomSelector({ roomType, template, onComplete, onCancel }: PreBuiltRoomSelectorProps) {
  const [step, setStep] = useState<'customize' | 'confirm' | 'complete'>('customize');
  const [customization, setCustomization] = useState<CustomizationData>({
    name: '',
    purpose: '',
    goals: '',
    metrics: ''
  });
  const [rating, setRating] = useState(0);

  const handleCustomizationSubmit = () => {
    if (customization.name && customization.purpose && customization.goals) {
      setStep('confirm');
    }
  };

  const handleConfirm = () => {
    const roomData: UnifiedRoomData = {
      id: `room_${Date.now()}`,
      name: customization.name,
      title: customization.name,
      purpose: customization.purpose,
      description: `${template.description} - ${customization.purpose}`,
      category: template.name,
      targetAudience: 'Community members',
      expectedOutcomes: [customization.goals],
      estimatedMembers: '10-25',
      timeCommitment: 'Regular engagement',
      skillsNeeded: ['Communication', 'Collaboration'],
      tools: template.features,
      tags: [roomType],
      privacy: 'Public',
      completeness: 85,
      specSections: [],
      demoRoomConfig: {
        theme: roomType,
        mockMembers: 15,
        activityLevel: 'medium' as const,
        contentSeeds: [customization.goals],
        features: template.features.slice(0, 3)
      },
      questions: [],
      tier: 'balanced' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onComplete(roomData);
  };

  const IconComponent = template.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-gradient-to-br from-${template.color}-500 to-${template.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h2>
          <p className="text-gray-600">{template.description}</p>
        </div>

        {step === 'customize' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Pre-built Features</h3>
              <div className="flex flex-wrap gap-2">
                {template.features.map((feature, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
              <p className="text-sm text-blue-700 mt-2">
                <strong>NB:</strong> Once open, you can tweak these settings in your demo room.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  value={customization.name}
                  onChange={(e) => setCustomization(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Give your room a unique name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose & Focus *
                </label>
                <textarea
                  value={customization.purpose}
                  onChange={(e) => setCustomization(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="What is the main purpose of this room? What will members focus on?"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goals & Success Metrics *
                </label>
                <textarea
                  value={customization.goals}
                  onChange={(e) => setCustomization(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="What specific goals do you want to achieve? How will you measure success?"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Metrics to Track (Optional)
                </label>
                <input
                  type="text"
                  value={customization.metrics}
                  onChange={(e) => setCustomization(prev => ({ ...prev, metrics: e.target.value }))}
                  placeholder="e.g., participation rate, projects completed, community engagement"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleCustomizationSubmit}
              disabled={!customization.name || !customization.purpose || !customization.goals}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              Continue to Preview
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Confirm Your Room Setup</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Room Name</h4>
                <p className="text-gray-700">{customization.name}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Purpose</h4>
                <p className="text-gray-700">{customization.purpose}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Goals</h4>
                <p className="text-gray-700">{customization.goals}</p>
              </div>
              
              {customization.metrics && (
                <div>
                  <h4 className="font-semibold text-gray-900">Metrics</h4>
                  <p className="text-gray-700">{customization.metrics}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-900">Pre-built Features</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {template.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('customize')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Back to Edit
              </button>
              
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Create Demo Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
