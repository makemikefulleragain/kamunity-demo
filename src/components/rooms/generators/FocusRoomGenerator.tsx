'use client';

import React, { useState } from 'react';
import { UnifiedRoomData } from './shared/types';
import { GeneratorProps } from './shared/types';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function FocusRoomGenerator({ onComplete, onCancel }: GeneratorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UnifiedRoomData>>({
    title: '',
    purpose: '',
    description: '',
    category: 'innovation',
    targetAudience: '',
    expectedOutcomes: [],
    skillsNeeded: [],
    tools: [],
    milestones: [],
    memberLimit: 15,
    privacy: 'public',
    requirements: []
  });

  const steps = [
    {
      title: 'Room Basics',
      description: 'Define the core identity of your room',
      fields: ['title', 'category', 'purpose']
    },
    {
      title: 'Target & Goals',
      description: 'Who will join and what will you achieve?',
      fields: ['targetAudience', 'expectedOutcomes']
    },
    {
      title: 'Requirements',
      description: 'What skills and tools are needed?',
      fields: ['skillsNeeded', 'tools']
    },
    {
      title: 'Planning',
      description: 'Set milestones and structure',
      fields: ['milestones', 'memberLimit']
    },
    {
      title: 'Details',
      description: 'Add comprehensive description',
      fields: ['description', 'privacy']
    },
    {
      title: 'Review',
      description: 'Confirm your room specification',
      fields: []
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the generation
      onComplete({
        ...formData,
        generatorType: 'focus',
        completeness: 95 // Focus rooms are highly complete
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderField = (field: string) => {
    switch (field) {
      case 'title':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Title *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a compelling title for your room"
            />
          </div>
        );

      case 'category':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category || 'innovation'}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="innovation">Innovation</option>
              <option value="social-impact">Social Impact</option>
              <option value="education">Education</option>
              <option value="technology">Technology</option>
              <option value="arts-culture">Arts & Culture</option>
              <option value="health-wellness">Health & Wellness</option>
              <option value="environment">Environment</option>
              <option value="business">Business</option>
            </select>
          </div>
        );

      case 'purpose':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <textarea
              value={formData.purpose || ''}
              onChange={(e) => updateField('purpose', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What is the main purpose of this room?"
            />
          </div>
        );

      case 'description':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide a comprehensive description of your room's vision, goals, and approach"
            />
          </div>
        );

      case 'targetAudience':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience *
            </label>
            <input
              type="text"
              value={formData.targetAudience || ''}
              onChange={(e) => updateField('targetAudience', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Who should join this room?"
            />
          </div>
        );

      case 'expectedOutcomes':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Outcomes
            </label>
            <div className="space-y-2">
              {(formData.expectedOutcomes || []).map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => {
                      const newOutcomes = [...(formData.expectedOutcomes || [])];
                      newOutcomes[index] = e.target.value;
                      updateField('expectedOutcomes', newOutcomes);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newOutcomes = (formData.expectedOutcomes || []).filter((_, i) => i !== index);
                      updateField('expectedOutcomes', newOutcomes);
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateField('expectedOutcomes', [...(formData.expectedOutcomes || []), ''])}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Add Outcome
              </button>
            </div>
          </div>
        );

      case 'skillsNeeded':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Needed
            </label>
            <div className="space-y-2">
              {(formData.skillsNeeded || []).map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...(formData.skillsNeeded || [])];
                      newSkills[index] = e.target.value;
                      updateField('skillsNeeded', newSkills);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newSkills = (formData.skillsNeeded || []).filter((_, i) => i !== index);
                      updateField('skillsNeeded', newSkills);
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateField('skillsNeeded', [...(formData.skillsNeeded || []), ''])}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Add Skill
              </button>
            </div>
          </div>
        );

      case 'tools':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tools & Resources
            </label>
            <div className="space-y-2">
              {(formData.tools || []).map((tool, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tool}
                    onChange={(e) => {
                      const newTools = [...(formData.tools || [])];
                      newTools[index] = e.target.value;
                      updateField('tools', newTools);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newTools = (formData.tools || []).filter((_, i) => i !== index);
                      updateField('tools', newTools);
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateField('tools', [...(formData.tools || []), ''])}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Add Tool
              </button>
            </div>
          </div>
        );

      case 'memberLimit':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Limit
            </label>
            <input
              type="number"
              value={formData.memberLimit || 15}
              onChange={(e) => updateField('memberLimit', parseInt(e.target.value))}
              min="5"
              max="50"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'privacy':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy Setting
            </label>
            <select
              value={formData.privacy || 'public'}
              onChange={(e) => updateField('privacy', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public - Anyone can join</option>
              <option value="private">Private - Invite only</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index < currentStep ? 'bg-green-500 text-white' :
                index === currentStep ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
        <p className="text-gray-600 mb-6">{currentStepData.description}</p>

        {currentStep < steps.length - 1 ? (
          <div className="space-y-6">
            {currentStepData.fields.map(field => (
              <div key={field}>
                {renderField(field)}
              </div>
            ))}
          </div>
        ) : (
          // Review Step
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Room Specification Summary</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Title:</span> {formData.title || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Category:</span> {formData.category}
              </div>
              <div>
                <span className="font-medium">Purpose:</span> {formData.purpose || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Target Audience:</span> {formData.targetAudience || 'Not specified'}
              </div>
              {formData.expectedOutcomes && formData.expectedOutcomes.length > 0 && (
                <div>
                  <span className="font-medium">Expected Outcomes:</span>
                  <ul className="list-disc list-inside mt-1">
                    {formData.expectedOutcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">Your Focus Room will be created with ~95% completeness</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={currentStep === 0 ? onCancel : handleBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Create Room' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
