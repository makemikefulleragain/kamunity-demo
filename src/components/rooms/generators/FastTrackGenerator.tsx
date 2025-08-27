'use client';

import React, { useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { UnifiedRoomData, GeneratorProps, ROOM_CATEGORIES } from './shared/types';
import { generateDemoConfig, generateSpecSections } from './shared/utils';

export default function FastTrackGenerator({ onComplete, onCancel, initialData, triggerSource }: GeneratorProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    purpose: initialData?.purpose || '',
    category: initialData?.category || ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) {
      newErrors.push('Room name is required');
    }
    if (!formData.purpose.trim()) {
      newErrors.push('Purpose is required');
    }
    if (!formData.category) {
      newErrors.push('Please select a category');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).demoAnalytics) {
      (window as any).demoAnalytics.track('room_generator_started', {
        generator: 'fast',
        category: formData.category,
        trigger: triggerSource
      });
    }
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate room data
    const roomData: UnifiedRoomData = {
      id: `room-${Date.now()}`,
      name: formData.name,
      purpose: formData.purpose,
      description: `A fast-track room focused on ${formData.purpose}`,
      category: formData.category,
      estimatedMembers: '10-50',
      timeCommitment: '2-3 hours/week',
      skillsNeeded: ['Communication', 'Collaboration', 'Initiative'],
      expectedOutcomes: ['Build community', 'Share knowledge', 'Drive action'],
      tools: ['Chat', 'Forums', 'Events'],
      tags: [formData.category.toLowerCase().replace(/\s+/g, '-'), 'community', 'action'],
      completeness: 60, // Fast track starts at 60% complete
      specSections: generateSpecSections(formData),
      demoRoomConfig: generateDemoConfig(formData),
      questions: [], // Will be populated after creation
      tier: 'fast',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).demoAnalytics) {
      (window as any).demoAnalytics.captureInterests({
        passionAreas: [formData.category],
        communityTypes: ['action'],
        topicInterests: roomData.tags
      });
    }
    
    setIsGenerating(false);
    onComplete(roomData);
  };

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
    setErrors([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Fast Track Room Generator</h2>
                <p className="text-blue-100">Create your room in under 60 seconds!</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Climate Action Network"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg"
              required
              autoFocus
            />
          </div>

          {/* One-line Purpose */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              One-line Purpose <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="e.g., Unite local climate activists to drive policy change"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROOM_CATEGORIES.slice(0, 6).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.category === category
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-red-500">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  Create Room & Spec
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
