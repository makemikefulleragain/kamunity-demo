'use client';

import React, { useState } from 'react';
import { Shield, Target, Users, Lightbulb, BarChart, Rocket, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { UnifiedRoomData, GeneratorProps, ROOM_CATEGORIES } from './shared/types';
import { generateRoomId, generateDemoConfig, generateSpecSections, calculateCompleteness } from './shared/utils';

type Step = 'discovery' | 'strategic' | 'design' | 'technical' | 'roadmap' | 'output';

export default function ComprehensiveGenerator({ onComplete, onCancel, initialData }: GeneratorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('discovery');
  const [formData, setFormData] = useState({
    problemStatement: '',
    stakeholders: [] as string[],
    painPoints: [] as string[],
    desiredTransformation: '',
    vision: '',
    mission: '',
    smartGoals: [] as string[],
    resources: '',
    timeline: '',
    communityArchitecture: '',
    governanceModel: '',
    engagementMechanics: [] as string[],
    growthStrategy: '',
    integrations: [] as string[],
    featureMatrix: { mvp: [] as string[], pro: [] as string[], full: [] as string[] },
    analyticsKPIs: [] as string[],
    budget: '',
    risks: [] as { risk: string; mitigation: string }[],
    successCriteria: [] as string[]
  });
  const [roomName, setRoomName] = useState('');
  const [category, setCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const steps: Step[] = ['discovery', 'strategic', 'design', 'technical', 'roadmap', 'output'];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const handleGenerateSpec = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const roomData: UnifiedRoomData = {
      id: generateRoomId(),
      name: roomName || 'Professional Community Room',
      purpose: formData.mission || formData.problemStatement,
      description: formData.desiredTransformation,
      category: category || 'Community Building',
      estimatedMembers: '50-100',
      timeCommitment: formData.timeline || 'Flexible',
      skillsNeeded: ['Leadership', 'Communication', 'Strategy'],
      expectedOutcomes: formData.successCriteria,
      tools: [...formData.integrations, ...formData.engagementMechanics],
      tags: [category, 'professional', 'consultation'],
      privacy: 'Public',
      completeness: 95,
      specSections: generateSpecSections(formData),
      demoRoomConfig: generateDemoConfig(formData),
      questions: [],
      tier: 'comprehensive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setIsGenerating(false);
    onComplete(roomData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'discovery':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Discovery Phase</h3>
            <textarea
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              placeholder="Describe the problem or opportunity..."
              className="w-full p-3 border-2 rounded-lg h-32"
            />
            <input
              type="text"
              placeholder="Add stakeholders (press Enter)"
              className="w-full p-3 border-2 rounded-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  e.preventDefault();
                  setFormData({ ...formData, stakeholders: [...formData.stakeholders, e.currentTarget.value] });
                  e.currentTarget.value = '';
                }
              }}
            />
            <textarea
              value={formData.desiredTransformation}
              onChange={(e) => setFormData({ ...formData, desiredTransformation: e.target.value })}
              placeholder="Desired transformation..."
              className="w-full p-3 border-2 rounded-lg h-24"
            />
          </div>
        );
      
      case 'strategic':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Strategic Planning</h3>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
              className="w-full p-3 border-2 rounded-lg"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border-2 rounded-lg"
            >
              <option value="">Select Category</option>
              {ROOM_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              placeholder="Vision statement..."
              className="w-full p-3 border-2 rounded-lg h-20"
            />
            <textarea
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              placeholder="Mission statement..."
              className="w-full p-3 border-2 rounded-lg h-20"
            />
          </div>
        );
      
      case 'design':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Design Workshop</h3>
            <select
              value={formData.governanceModel}
              onChange={(e) => setFormData({ ...formData, governanceModel: e.target.value })}
              className="w-full p-3 border-2 rounded-lg"
            >
              <option value="">Select Governance Model</option>
              <option value="democratic">Democratic</option>
              <option value="consensus">Consensus</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="open">Open</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              {['Gamification', 'Rewards', 'Leaderboards', 'Badges'].map(mechanic => (
                <button
                  key={mechanic}
                  type="button"
                  onClick={() => {
                    const mechanics = formData.engagementMechanics.includes(mechanic)
                      ? formData.engagementMechanics.filter(m => m !== mechanic)
                      : [...formData.engagementMechanics, mechanic];
                    setFormData({ ...formData, engagementMechanics: mechanics });
                  }}
                  className={`p-3 rounded-lg border-2 ${
                    formData.engagementMechanics.includes(mechanic)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                >
                  {mechanic}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'technical':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Technical Specification</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Slack', 'Discord', 'Email', 'Calendar'].map(integration => (
                <button
                  key={integration}
                  type="button"
                  onClick={() => {
                    const integrations = formData.integrations.includes(integration)
                      ? formData.integrations.filter(i => i !== integration)
                      : [...formData.integrations, integration];
                    setFormData({ ...formData, integrations });
                  }}
                  className={`p-3 rounded-lg border-2 ${
                    formData.integrations.includes(integration)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                >
                  {integration}
                </button>
              ))}
            </div>
            <textarea
              placeholder="MVP Features (one per line)"
              className="w-full p-3 border rounded-lg h-20"
              onBlur={(e) => {
                const features = e.target.value.split('\n').filter(f => f.trim());
                setFormData({ ...formData, featureMatrix: { ...formData.featureMatrix, mvp: features } });
              }}
            />
          </div>
        );
      
      case 'roadmap':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Implementation Roadmap</h3>
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="Budget estimation"
              className="w-full p-3 border-2 rounded-lg"
            />
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              placeholder="Timeline (e.g., 6 months)"
              className="w-full p-3 border-2 rounded-lg"
            />
            <textarea
              placeholder="Success criteria (one per line)"
              className="w-full p-3 border rounded-lg h-20"
              onBlur={(e) => {
                const criteria = e.target.value.split('\n').filter(c => c.trim());
                setFormData({ ...formData, successCriteria: criteria });
              }}
            />
          </div>
        );
      
      case 'output':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Professional Output</h3>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Your Comprehensive Spec is Ready!</h4>
              <ul className="space-y-2 text-sm">
                <li>✅ Executive Summary</li>
                <li>✅ Implementation Roadmap</li>
                <li>✅ ROI Calculator</li>
                <li>✅ Risk Assessment</li>
                <li>✅ 30-day Action Plan</li>
              </ul>
              <button
                onClick={handleGenerateSpec}
                disabled={isGenerating}
                className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold"
              >
                {isGenerating ? 'Generating...' : 'Generate Room & Download Spec'}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Comprehensive Room Generator</h2>
          <p className="text-indigo-100">Professional consultation for serious community builders</p>
        </div>

        <div className="px-6 pt-6">
          <div className="flex items-center justify-center mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStepIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                }`}>
                  {index < currentStepIndex ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 ${index < currentStepIndex ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {renderStepContent()}
        </div>

        <div className="border-t px-6 py-4 flex justify-between bg-gray-50">
          <button onClick={onCancel} className="text-gray-600">Cancel</button>
          <div className="flex gap-3">
            {currentStepIndex > 0 && (
              <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 text-gray-600">
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            )}
            {currentStepIndex < steps.length - 1 && (
              <button onClick={handleNext} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
