'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Circle, ChevronRight, Sparkles, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { memoryStore } from '@/lib/demo/memoryStore';
import { calculateCompleteness } from '@/components/rooms/generators/shared/utils';
import { UnifiedRoomData } from '@/components/rooms/generators/shared/types';

export default function EnhanceRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  
  const [roomData, setRoomData] = useState<Partial<UnifiedRoomData>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [completeness, setCompleteness] = useState(70);
  const [targetCompleteness, setTargetCompleteness] = useState(100);
  
  // Enhancement steps to reach 100% completeness
  const enhancementSteps = [
    {
      id: 'description',
      title: 'Detailed Description',
      field: 'description',
      prompt: 'Provide a comprehensive description of your room\'s vision and goals',
      type: 'textarea',
      impact: 10
    },
    {
      id: 'outcomes',
      title: 'Expected Outcomes',
      field: 'expectedOutcomes',
      prompt: 'What specific outcomes do you expect from this room?',
      type: 'multitext',
      placeholder: 'Add an expected outcome',
      impact: 8
    },
    {
      id: 'skills',
      title: 'Skills Needed',
      field: 'skillsNeeded',
      prompt: 'What skills are needed for members to contribute effectively?',
      type: 'multitext',
      placeholder: 'Add a skill',
      impact: 7
    },
    {
      id: 'tools',
      title: 'Tools & Resources',
      field: 'tools',
      prompt: 'What tools and resources will your room use?',
      type: 'multitext',
      placeholder: 'Add a tool or resource',
      impact: 5
    },
    {
      id: 'milestones',
      title: 'Key Milestones',
      field: 'milestones',
      prompt: 'Define key milestones for your room\'s journey',
      type: 'milestones',
      impact: 10
    }
  ];

  // Load room data
  useEffect(() => {
    const storedData = memoryStore.get(`room_${roomId}`);
    if (storedData) {
      setRoomData(storedData);
      const currentComp = storedData.completeness || calculateCompleteness(storedData);
      setCompleteness(currentComp);
      
      // Check URL params for target completeness
      const urlParams = new URLSearchParams(window.location.search);
      const target = urlParams.get('target');
      if (target === 'comprehensive') {
        setTargetCompleteness(100);
      }
    }
  }, [roomId]);

  const handleFieldUpdate = (field: string, value: any) => {
    const updatedData = { ...roomData, [field]: value };
    setRoomData(updatedData);
    
    // Recalculate completeness
    const newCompleteness = calculateCompleteness(updatedData);
    setCompleteness(newCompleteness);
  };

  const handleComplete = () => {
    // Update room data in memory store
    const updatedData = { ...roomData, completeness };
    memoryStore.set(`room_${roomId}`, updatedData);
    
    // Track enhancement
    memoryStore.track('room_enhanced', {
      roomId,
      fromCompleteness: roomData.completeness || 70,
      toCompleteness: completeness
    });
    
    // Navigate back to focus room
    router.push(`/rooms/${roomId}/focus`);
  };

  const handleSkip = () => {
    router.push(`/rooms/${roomId}/focus`);
  };

  // Multi-text input component
  const MultiTextInput = ({ field, placeholder }: { field: string; placeholder: string }) => {
    const [items, setItems] = useState<string[]>(roomData[field as keyof UnifiedRoomData] as string[] || []);
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
      if (newItem.trim()) {
        const updated = [...items, newItem.trim()];
        setItems(updated);
        handleFieldUpdate(field, updated);
        setNewItem('');
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
              {item}
              <button
                onClick={() => {
                  const updated = items.filter((_, i) => i !== index);
                  setItems(updated);
                  handleFieldUpdate(field, updated);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Milestones input component
  const MilestonesInput = ({ field }: { field: string }) => {
    const [milestones, setMilestones] = useState<Array<{ title: string; date: string }>>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');

    const addMilestone = () => {
      if (newTitle.trim() && newDate) {
        const updated = [...milestones, { title: newTitle.trim(), date: newDate }];
        setMilestones(updated);
        handleFieldUpdate(field, updated);
        setNewTitle('');
        setNewDate('');
      }
    };

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Milestone title"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addMilestone}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{milestone.title}</p>
                <p className="text-sm text-gray-600">{new Date(milestone.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => {
                  const updated = milestones.filter((_, i) => i !== index);
                  setMilestones(updated);
                  handleFieldUpdate(field, updated);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const currentStepData = enhancementSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/rooms/${roomId}/focus`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Room
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Enhance Your Room</h1>
          <p className="text-gray-600 mt-2">Complete additional details to unlock advanced features</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Current Completeness</h2>
              <p className="text-sm text-gray-600">Add more details to reach {targetCompleteness}%</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{completeness}%</p>
              <p className="text-sm text-gray-600">Target: {targetCompleteness}%</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>

          {completeness >= targetCompleteness && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <p className="font-medium">Target reached! Your room now has access to all features.</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhancement Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Enhancement Steps</h3>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {enhancementSteps.length}
            </span>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mb-8">
            {enhancementSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep ? 'bg-green-500 text-white' :
                  index === currentStep ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                {index < enhancementSteps.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          {currentStepData && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold mb-2">{currentStepData.title}</h4>
                <p className="text-gray-600">{currentStepData.prompt}</p>
                <p className="text-sm text-blue-600 mt-1">
                  +{currentStepData.impact}% completeness
                </p>
              </div>

              <div>
                {currentStepData.type === 'textarea' && (
                  <textarea
                    value={roomData[currentStepData.field as keyof UnifiedRoomData] as string || ''}
                    onChange={(e) => handleFieldUpdate(currentStepData.field, e.target.value)}
                    placeholder="Enter your description here..."
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {currentStepData.type === 'multitext' && (
                  <MultiTextInput 
                    field={currentStepData.field} 
                    placeholder={currentStepData.placeholder || 'Add item'} 
                  />
                )}

                {currentStepData.type === 'milestones' && (
                  <MilestonesInput field={currentStepData.field} />
                )}
              </div>

              <div className="flex gap-4 pt-4">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < enhancementSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Complete Enhancement
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Benefits Preview */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">What You'll Unlock at 100%</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 mt-1" />
              <div>
                <p className="font-medium">Predictive Analytics</p>
                <p className="text-sm text-white/80">AI-powered insights and forecasting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 mt-1" />
              <div>
                <p className="font-medium">Advanced Automation</p>
                <p className="text-sm text-white/80">Automated workflows and suggestions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 mt-1" />
              <div>
                <p className="font-medium">Priority Support</p>
                <p className="text-sm text-white/80">Direct access to expert guidance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1" />
              <div>
                <p className="font-medium">Full Feature Access</p>
                <p className="text-sm text-white/80">All premium room capabilities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Skip for now and continue with {completeness}% completeness
          </button>
        </div>
      </div>
    </div>
  );
}
