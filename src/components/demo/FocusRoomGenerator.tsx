'use client'

import React, { useState } from 'react';
import { X, Sparkles, Target, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface FocusRoomGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FocusRoomData) => void;
}

interface FocusRoomData {
  roomName: string;
  primaryGoal: string;
  targetAudience: string;
  timeCommitment: string;
  keyFeatures: string[];
  successMetrics: string[];
}

const FocusRoomGenerator: React.FC<FocusRoomGeneratorProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FocusRoomData>({
    roomName: '',
    primaryGoal: '',
    targetAudience: '',
    timeCommitment: '',
    keyFeatures: [],
    successMetrics: []
  });

  const [showSpecSheet, setShowSpecSheet] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setShowSpecSheet(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.includes(feature)
        ? prev.keyFeatures.filter(f => f !== feature)
        : [...prev.keyFeatures, feature]
    }));
  };

  const handleMetricToggle = (metric: string) => {
    setFormData(prev => ({
      ...prev,
      successMetrics: prev.successMetrics.includes(metric)
        ? prev.successMetrics.filter(m => m !== metric)
        : [...prev.successMetrics, metric]
    }));
  };

  const generateDayInTheLife = () => {
    const timeframe = formData.timeCommitment.includes('daily') ? 'day' : 'week';
    return `
**A ${timeframe} in the life of your ${formData.roomName}:**

**Morning (9:00 AM):** Sarah logs into her ${formData.roomName} and sees 3 new updates from overnight. The AI assistant has already summarized key discussions and highlighted 2 action items that need her attention.

**Mid-Morning (10:30 AM):** The weekly check-in begins. 12 members join the video call, with 8 more participating asynchronously. The AI facilitates by tracking speaking time and suggesting agenda items based on recent activity.

**Afternoon (2:00 PM):** A breakthrough moment! The collaborative workspace shows real progress on ${formData.primaryGoal}. Members vote on next steps using the integrated decision-making tools.

**Evening (6:00 PM):** Impact achieved! The room&apos;s dashboard shows measurable progress: ${formData.successMetrics.slice(0, 2).join(' and ')}. Members celebrate and plan the next milestone.

**Result:** What used to take 3 separate meetings and countless emails now happens seamlessly in one integrated space, saving 5+ hours per week while achieving better outcomes.
    `;
  };

  const generateROICalculation = () => {
    const memberCount = 15; // Average room size
    const hoursSaved = 5; // Per week per member
    const hourlyValue = 35; // Average hourly value
    const weeklyROI = memberCount * hoursSaved * hourlyValue;
    const monthlyROI = weeklyROI * 4;
    const yearlyROI = monthlyROI * 12;

    return {
      weekly: weeklyROI,
      monthly: monthlyROI,
      yearly: yearlyROI,
      memberCount,
      hoursSaved
    };
  };

  if (showSpecSheet) {
    const roi = generateROICalculation();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Focus Room Specification</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Room Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                {formData.roomName}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Primary Goal:</strong> {formData.primaryGoal}
                </div>
                <div>
                  <strong>Target Audience:</strong> {formData.targetAudience}
                </div>
                <div>
                  <strong>Time Commitment:</strong> {formData.timeCommitment}
                </div>
                <div>
                  <strong>Key Features:</strong> {formData.keyFeatures.join(', ')}
                </div>
              </div>
            </div>

            {/* ROI Analysis */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                ROI & Time Savings
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${roi.weekly.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Weekly Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${roi.monthly.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${roi.yearly.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Annual Value</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                Based on {roi.memberCount} members saving {roi.hoursSaved} hours/week each
              </div>
            </div>

            {/* Day in the Life */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Day in the Life
              </h3>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-gray-700">
                  {generateDayInTheLife()}
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Success Metrics
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {formData.successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-sm">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Ready to Launch Your Focus Room?</h3>
              <p className="mb-4 opacity-90">Get your detailed implementation plan and start building your community today.</p>
              <Button 
                onClick={() => onSubmit(formData)}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Send Me the Complete Spec Sheet
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Your Focus Room</h2>
            <p className="text-gray-600">Step {step} of 4</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What&apos;s your room about?</h3>
                <input
                  type="text"
                  placeholder="e.g., Urban Gardening Collective"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.roomName}
                  onChange={(e) => setFormData(prev => ({ ...prev, roomName: e.target.value }))}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What&apos;s your primary goal?</h3>
                <textarea
                  placeholder="e.g., Create a network of community gardens across the city"
                  className="w-full p-3 border border-gray-300 rounded-lg h-24"
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryGoal: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Who&apos;s your target audience?</h3>
                <input
                  type="text"
                  placeholder="e.g., Urban residents interested in sustainable living"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Time commitment?</h3>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.timeCommitment}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                >
                  <option value="">Select time commitment</option>
                  <option value="1-2 hours weekly">1-2 hours weekly</option>
                  <option value="3-5 hours weekly">3-5 hours weekly</option>
                  <option value="Daily check-ins">Daily check-ins</option>
                  <option value="Monthly deep dives">Monthly deep dives</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Key features you need:</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Real-time chat',
                  'Video meetings',
                  'Document sharing',
                  'Task management',
                  'Voting system',
                  'Calendar integration',
                  'AI assistance',
                  'Progress tracking'
                ].map(feature => (
                  <button
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    className={`p-3 rounded-lg border text-left ${
                      formData.keyFeatures.includes(feature)
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">How will you measure success?</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Number of active members',
                  'Projects completed',
                  'Community impact metrics',
                  'Member satisfaction scores',
                  'Knowledge sharing frequency',
                  'Collaboration quality',
                  'Goal achievement rate',
                  'Time to decision making'
                ].map(metric => (
                  <button
                    key={metric}
                    onClick={() => handleMetricToggle(metric)}
                    className={`p-3 rounded-lg border text-left ${
                      formData.successMetrics.includes(metric)
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.roomName || !formData.primaryGoal)) ||
                (step === 2 && (!formData.targetAudience || !formData.timeCommitment)) ||
                (step === 3 && formData.keyFeatures.length === 0) ||
                (step === 4 && formData.successMetrics.length === 0)
              }
            >
              {step === 4 ? 'Generate Spec Sheet' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusRoomGenerator;
