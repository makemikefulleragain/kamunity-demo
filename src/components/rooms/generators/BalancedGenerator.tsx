'use client';

import React, { useState } from 'react';
import { Target, Users, Shield, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { UnifiedRoomData, GeneratorProps, ROOM_CATEGORIES, COMMUNITY_TYPES } from './shared/types';
import { generateRoomId, generateDemoConfig, generateSpecSections, calculateCompleteness, validateRoomData, generateAdaptiveQuestions } from './shared/utils';

type Step = 'purpose' | 'community' | 'features' | 'review';

export default function BalancedGenerator({ onComplete, onCancel, initialData, triggerSource }: GeneratorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('purpose');
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    purpose: initialData?.purpose || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    communityType: '',
    estimatedMembers: initialData?.estimatedMembers || '10-50',
    timeCommitment: initialData?.timeCommitment || 'Weekly (2-3 hours/week)',
    privacy: initialData?.privacy || 'Public' as 'Public' | 'Private',
    features: [] as string[],
    successMetrics: [] as string[]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const steps: Step[] = ['purpose', 'community', 'features', 'review'];
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

  const handleSubmit = async () => {
    setIsGenerating(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate complete room data
    const roomData: UnifiedRoomData = {
      id: generateRoomId(),
      name: formData.name,
      purpose: formData.purpose,
      description: formData.description,
      category: formData.category,
      estimatedMembers: formData.estimatedMembers,
      timeCommitment: formData.timeCommitment,
      skillsNeeded: generateSkillsFromFeatures(formData.features),
      expectedOutcomes: formData.successMetrics,
      tools: formData.features,
      tags: generateTags(formData),
      privacy: formData.privacy,
      completeness: calculateCompleteness(formData),
      specSections: generateSpecSections(formData),
      demoRoomConfig: generateDemoConfig(formData),
      questions: generateAdaptiveQuestions(formData),
      tier: 'balanced',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).demoAnalytics) {
      (window as any).demoAnalytics.captureInterests({
        passionAreas: [formData.category],
        communityTypes: [formData.communityType],
        topicInterests: roomData.tags
      });
    }
    
    setIsGenerating(false);
    onComplete(roomData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
            index <= currentStepIndex 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {index < currentStepIndex ? <Check className="w-5 h-5" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-20 h-1 transition-all ${
              index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderPurposeStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Purpose & Vision
        </h3>
        <p className="text-gray-600 mb-6">Let's define what your room is all about</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Room Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Sustainable Living Hub"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          required
        />
        {formData.name && (
          <p className="mt-2 text-sm text-gray-500">
            AI Suggestions: {formData.name} Network, {formData.name} Community, {formData.name} Collective
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Purpose Statement <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          placeholder="What is the main goal of this room? What change do you want to create?"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors h-24 resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ROOM_CATEGORIES.slice(0, 8).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFormData({ ...formData, category })}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
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
    </div>
  );

  const renderCommunityStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Community Building
        </h3>
        <p className="text-gray-600 mb-6">Who will join and how will they engage?</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Target Audience
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe who would benefit most from this room..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors h-20 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Community Type
        </label>
        <div className="space-y-3">
          {COMMUNITY_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({ ...formData, communityType: type.id })}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                formData.communityType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800">{type.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expected Members
          </label>
          <select
            value={formData.estimatedMembers}
            onChange={(e) => setFormData({ ...formData, estimatedMembers: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="1-10">1-10 members</option>
            <option value="10-50">10-50 members</option>
            <option value="50-100">50-100 members</option>
            <option value="100-500">100-500 members</option>
            <option value="500+">500+ members</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time Commitment
          </label>
          <select
            value={formData.timeCommitment}
            onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="Daily (30 min/day)">Daily (30 min/day)</option>
            <option value="Weekly (2-3 hours/week)">Weekly (2-3 hours/week)</option>
            <option value="Monthly (5-10 hours/month)">Monthly (5-10 hours/month)</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Privacy Setting
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, privacy: 'Public' })}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.privacy === 'Public'
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            Public (Anyone can join)
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, privacy: 'Private' })}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.privacy === 'Private'
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            Private (Invite only)
          </button>
        </div>
      </div>
    </div>
  );

  const renderFeaturesStep = () => {
    const suggestedFeatures = getSuggestedFeatures(formData.category);
    const suggestedMetrics = getSuggestedMetrics(formData.category);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Smart Features
          </h3>
          <p className="text-gray-600 mb-6">AI-recommended features based on your purpose</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Recommended Features (Select up to 5)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {suggestedFeatures.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => {
                  const newFeatures = formData.features.includes(feature)
                    ? formData.features.filter(f => f !== feature)
                    : [...formData.features, feature].slice(0, 5);
                  setFormData({ ...formData, features: newFeatures });
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  formData.features.includes(feature)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{feature}</span>
                  {formData.features.includes(feature) && <Check className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Success Metrics (Pick your top 3)
          </label>
          <div className="space-y-2">
            {suggestedMetrics.map((metric) => (
              <button
                key={metric}
                type="button"
                onClick={() => {
                  const newMetrics = formData.successMetrics.includes(metric)
                    ? formData.successMetrics.filter(m => m !== metric)
                    : [...formData.successMetrics, metric].slice(0, 3);
                  setFormData({ ...formData, successMetrics: newMetrics });
                }}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  formData.successMetrics.includes(metric)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{metric}</span>
                  {formData.successMetrics.includes(metric) && <Check className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Quick Review
        </h3>
        <p className="text-gray-600 mb-6">Everything look good? Let's create your room!</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600">Room Name</p>
          <p className="font-semibold text-gray-800">{formData.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Purpose</p>
          <p className="text-gray-800">{formData.purpose}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-semibold text-gray-800">{formData.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Privacy</p>
            <p className="font-semibold text-gray-800">{formData.privacy}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Expected Members</p>
            <p className="font-semibold text-gray-800">{formData.estimatedMembers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time Commitment</p>
            <p className="font-semibold text-gray-800">{formData.timeCommitment}</p>
          </div>
        </div>

        {formData.features.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature) => (
                <span key={feature} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {formData.successMetrics.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Success Metrics</p>
            <div className="flex flex-wrap gap-2">
              {formData.successMetrics.map((metric) => (
                <span key={metric} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Spec Completeness: {calculateCompleteness(formData)}%</strong>
          <br />
          Your room will be created with a professional spec sheet. You can enhance it further after creation!
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Balanced Room Generator</h2>
              <p className="text-blue-100">Guided creation with smart suggestions</p>
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

        {/* Progress Indicator */}
        <div className="px-6 pt-6">
          {renderStepIndicator()}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {currentStep === 'purpose' && renderPurposeStep()}
          {currentStep === 'community' && renderCommunityStep()}
          {currentStep === 'features' && renderFeaturesStep()}
          {currentStep === 'review' && renderReviewStep()}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-between items-center bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </div>

          {currentStep === 'review' ? (
            <button
              onClick={handleSubmit}
              disabled={isGenerating || !formData.name || !formData.purpose || !formData.category}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  Create Room
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 'purpose' && (!formData.name || !formData.purpose || !formData.category))
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getSuggestedFeatures(category: string): string[] {
  const featuresMap: Record<string, string[]> = {
    'Community Building': ['Discussion Forums', 'Event Calendar', 'Member Directory', 'Polls & Voting', 'Resource Library', 'Announcements'],
    'Environmental Action': ['Project Tracker', 'Carbon Calculator', 'Resource Library', 'Action Alerts', 'Impact Dashboard', 'Event Planning'],
    'Social Justice': ['Campaign Tools', 'Petition Platform', 'Resource Hub', 'Event Organizer', 'Media Library', 'Volunteer Coordination'],
    'Education & Learning': ['Course Platform', 'Resource Library', 'Discussion Boards', 'Assignment Tracker', 'Progress Tracking', 'Peer Review'],
    'Health & Wellness': ['Support Groups', 'Resource Directory', 'Event Calendar', 'Progress Tracking', 'Expert Q&A', 'Wellness Challenges'],
    default: ['Discussion Forums', 'Resource Library', 'Event Calendar', 'Member Directory', 'Announcements', 'Polls & Voting']
  };
  return featuresMap[category] || featuresMap.default;
}

function getSuggestedMetrics(category: string): string[] {
  const metricsMap: Record<string, string[]> = {
    'Community Building': ['Member engagement rate', 'Event attendance', 'Content creation', 'Community growth', 'Member retention'],
    'Environmental Action': ['Carbon reduction', 'Projects completed', 'Policy changes', 'Community reach', 'Resource efficiency'],
    'Social Justice': ['Campaign success', 'Policy impact', 'Community mobilization', 'Awareness metrics', 'Volunteer hours'],
    'Education & Learning': ['Course completion', 'Skill development', 'Knowledge sharing', 'Student satisfaction', 'Learning outcomes'],
    'Health & Wellness': ['Health improvements', 'Support provided', 'Resource utilization', 'Member wellbeing', 'Program participation'],
    default: ['Member engagement', 'Content creation', 'Goal achievement', 'Community growth', 'Impact metrics']
  };
  return metricsMap[category] || metricsMap.default;
}

function generateSkillsFromFeatures(features: string[]): string[] {
  const skills = [];
  if (features.includes('Discussion Forums')) skills.push('Communication');
  if (features.includes('Event Calendar') || features.includes('Event Organizer')) skills.push('Event Planning');
  if (features.includes('Project Tracker')) skills.push('Project Management');
  if (features.includes('Campaign Tools')) skills.push('Advocacy');
  if (features.includes('Course Platform')) skills.push('Teaching');
  return skills.length > 0 ? skills : ['Collaboration', 'Communication'];
}

function generateTags(formData: any): string[] {
  const tags = [formData.category];
  if (formData.communityType) tags.push(formData.communityType);
  const keywords = formData.purpose.toLowerCase().split(' ')
    .filter((word: string) => word.length > 4 && !['with', 'from', 'that', 'this', 'have'].includes(word));
  tags.push(...keywords.slice(0, 3));
  return tags;
}
