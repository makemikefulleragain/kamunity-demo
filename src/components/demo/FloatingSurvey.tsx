'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Cat } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Text, Heading } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { demoAnalytics } from '@/lib/demo/analytics';
import toast from 'react-hot-toast';

interface SurveyData {
  email?: string;
  experience: 'excellent' | 'good' | 'okay' | 'needs-work' | '';
  mostInteresting: string;
  suggestions: string;
  wouldUseAgain: 'definitely' | 'probably' | 'maybe' | 'unlikely' | '';
  additionalFeatures: string;
  roomIdeas: string;
}

interface FloatingSurveyProps {
  onClose?: () => void;
  triggerDelay?: number; // milliseconds before showing survey
  recurringInterval?: number; // milliseconds between recurring surveys
}

type SurveyState = 'never_shown' | 'waiting_for_trigger' | 'visible' | 'completed' | 'dismissed' | 'waiting_for_next';

const FloatingSurvey: React.FC<FloatingSurveyProps> = ({ 
  onClose, 
  triggerDelay = 45000, // 45 seconds default
  recurringInterval = 45000 // 45 seconds recurring
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyState, setSurveyState] = useState<SurveyState>('never_shown');
  const [nextTriggerTime, setNextTriggerTime] = useState<number | null>(null);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    email: '',
    experience: '',
    mostInteresting: '',
    suggestions: '',
    wouldUseAgain: '',
    additionalFeatures: '',
    roomIdeas: ''
  });

  // Enhanced timer management for recurring surveys
  useEffect(() => {
    console.log('🎯 FloatingSurvey useEffect triggered - initializing survey state');
    
    const loadSurveyState = () => {
      try {
        const stored = localStorage.getItem('kamunity_survey_state');
        if (stored) {
          const { state, nextTrigger } = JSON.parse(stored);
          console.log('📋 Loaded survey state from localStorage:', { state, nextTrigger });
          setSurveyState(state);
          setNextTriggerTime(nextTrigger);
          return { state, nextTrigger };
        }
      } catch (error) {
        console.warn('Failed to load survey state:', error);
      }
      console.log('📋 No stored survey state found, using defaults');
      return { state: 'never_shown', nextTrigger: null };
    };

    const saveSurveyState = (state: SurveyState, nextTrigger: number | null = null) => {
      try {
        localStorage.setItem('kamunity_survey_state', JSON.stringify({
          state,
          nextTrigger
        }));
        setSurveyState(state);
        setNextTriggerTime(nextTrigger);
      } catch (error) {
        console.warn('Failed to save survey state:', error);
      }
    };

    const checkAndTriggerSurvey = () => {
      const { state, nextTrigger } = loadSurveyState();
      const now = Date.now();

      console.log('🔍 Survey state check:', { 
        state, 
        nextTrigger, 
        now, 
        isVisible, 
        timeUntilTrigger: nextTrigger ? nextTrigger - now : 'N/A' 
      });

      if (state === 'never_shown' && !isVisible) {
        console.log(`⏰ Setting first timer for ${triggerDelay}ms`);
        setTimeout(() => {
          console.log('🎯 First survey trigger!');
          setIsVisible(true);
          saveSurveyState('visible');
        }, triggerDelay);
      } else if (state === 'waiting_for_next' && nextTrigger && now >= nextTrigger && !isVisible) {
        console.log('🎯 Recurring survey trigger (time reached)!');
        setIsVisible(true);
        saveSurveyState('visible');
      } else if (state === 'waiting_for_next' && nextTrigger && now < nextTrigger && !isVisible) {
        const remainingTime = nextTrigger - now;
        console.log(`⏰ Setting recurring timer for ${remainingTime}ms`);
        setTimeout(() => {
          console.log('🎯 Recurring survey trigger!');
          setIsVisible(true);
          saveSurveyState('visible');
        }, remainingTime);
      } else if (state === 'visible' && !isVisible) {
        console.log('🎯 Survey should be visible but isVisible is false - showing now');
        setIsVisible(true);
      }
    };

    // Initial check
    checkAndTriggerSurvey();

    // Poll every 5 seconds to check for state changes
    const pollInterval = setInterval(checkAndTriggerSurvey, 5000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [triggerDelay, recurringInterval, isVisible]);

  const handleInputChange = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const handleDismiss = () => {
    // Track dismissal
    demoAnalytics.trackEvent('engagement_action', { 
      action: 'survey_dismissed',
      engagementLevel: 'low'
    });

    // Schedule next survey appearance
    const nextTrigger = Date.now() + recurringInterval;
    try {
      localStorage.setItem('kamunity_survey_state', JSON.stringify({
        state: 'waiting_for_next',
        nextTrigger
      }));
      setSurveyState('waiting_for_next');
      setNextTriggerTime(nextTrigger);
    } catch (error) {
      console.warn('Failed to save survey state after dismissal:', error);
    }

    // Close survey
    setIsExpanded(false);
    setIsVisible(false);
    setCurrentStep(1);
    setHasSubmitted(false);
    
    // Reset survey data
    setSurveyData({
      email: '',
      experience: '',
      mostInteresting: '',
      suggestions: '',
      wouldUseAgain: '',
      additionalFeatures: '',
      roomIdeas: ''
    });
  };

  const handleSubmit = async () => {
    console.log('🎯 handleSubmit called - Survey submission starting');
    
    if (isSubmitting) {
      console.log('⚠️ Already submitting, returning early');
      return;
    }

    setIsSubmitting(true);
    toast.loading('Sending your feedback...');

    try {
      // Collect analytics data to include in email
      const analyticsData = demoAnalytics.getBehaviorSummary();
      console.log('📊 Analytics data collected:', analyticsData);
      
      // Submit survey data
      console.log('🚀 Submitting survey to API:', { 
        surveyData: {
          ...surveyData,
          email: surveyData.email ? surveyData.email.substring(0, 3) + '***' : 'none'
        }, 
        analyticsData 
      });
      
      const response = await fetch('/api/demo/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyData,
          analyticsData,
          timestamp: new Date().toISOString()
        })
      });

      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📡 API Error:', errorText);
        throw new Error(`Failed to submit survey: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('📡 API Response data:', responseData);

      // Track survey completion
      demoAnalytics.trackEvent('engagement_action', { 
        action: 'survey_completed',
        engagementLevel: 'high'
      });

      toast.dismiss();
      toast.success('Thank you! Your feedback has been sent 🎉');
      
      setHasSubmitted(true);
      
      // Schedule next survey appearance
      const nextTrigger = Date.now() + recurringInterval;
      try {
        localStorage.setItem('kamunity_survey_state', JSON.stringify({
          state: 'waiting_for_next',
          nextTrigger
        }));
        setSurveyState('waiting_for_next');
        setNextTriggerTime(nextTrigger);
      } catch (error) {
        console.warn('Failed to save survey state after completion:', error);
      }
      
      // Auto-close after showing thank you
      setTimeout(() => {
        setIsVisible(false);
        setIsExpanded(false);
        setHasSubmitted(false);
        setCurrentStep(1);
        // Reset survey data for next time
        setSurveyData({
          email: '',
          experience: '',
          mostInteresting: '',
          suggestions: '',
          wouldUseAgain: '',
          additionalFeatures: '',
          roomIdeas: ''
        });
        onClose?.();
      }, 3000);

    } catch (error) {
      console.error('Survey submission error:', error);
      toast.dismiss();
      toast.error('Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return surveyData.experience && surveyData.mostInteresting.trim();
      case 2:
        return surveyData.wouldUseAgain;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  if (!isVisible) {
    console.log('🚫 FloatingSurvey not rendering - isVisible:', isVisible);
    return null;
  }
  
  console.log('✅ FloatingSurvey rendering - isVisible:', isVisible, 'isExpanded:', isExpanded);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed State - Floating Cat Icon */}
      {!isExpanded && !hasSubmitted && (
        <div 
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 bg-primary-500 hover:bg-primary-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
        >
          <Cat className="w-8 h-8 text-white" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">?</span>
          </div>
        </div>
      )}

      {/* Expanded Survey Card */}
      {isExpanded && !hasSubmitted && (
        <Card className="w-96 max-w-[calc(100vw-3rem)] shadow-2xl border-2 border-primary-200 animate-slide-up">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cat className="w-6 h-6 text-primary-600" />
                <Heading level={4} className="text-primary-600">
                  Quick Feedback
                </Heading>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss()}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-colors",
                    step <= currentStep ? "bg-primary-500" : "bg-gray-200"
                  )}
                />
              ))}
            </div>

            {/* Step 1: Experience & Interest */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Text variant="body-small" className="font-medium mb-2">
                    How was your Kamunity experience?
                  </Text>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'excellent', label: '🤩 Excellent', color: 'bg-green-100 text-green-800' },
                      { value: 'good', label: '😊 Good', color: 'bg-blue-100 text-blue-800' },
                      { value: 'okay', label: '😐 Okay', color: 'bg-yellow-100 text-yellow-800' },
                      { value: 'needs-work', label: '🤔 Needs Work', color: 'bg-orange-100 text-orange-800' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('experience', option.value)}
                        className={cn(
                          "p-2 rounded-lg text-xs font-medium transition-colors border-2",
                          surveyData.experience === option.value
                            ? `${option.color} border-current`
                            : "bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Text variant="body-small" className="font-medium mb-2">
                    What was most interesting to you?
                  </Text>
                  <textarea
                    value={surveyData.mostInteresting}
                    onChange={(e) => handleInputChange('mostInteresting', e.target.value)}
                    placeholder="The news system, chat features, room concepts..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Usage & Suggestions */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Text variant="body-small" className="font-medium mb-2">
                    Would you use Kamunity again?
                  </Text>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'definitely', label: '💯 Definitely', color: 'bg-green-100 text-green-800' },
                      { value: 'probably', label: '👍 Probably', color: 'bg-blue-100 text-blue-800' },
                      { value: 'maybe', label: '🤷 Maybe', color: 'bg-yellow-100 text-yellow-800' },
                      { value: 'unlikely', label: '👎 Unlikely', color: 'bg-red-100 text-red-800' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('wouldUseAgain', option.value)}
                        className={cn(
                          "p-2 rounded-lg text-xs font-medium transition-colors border-2",
                          surveyData.wouldUseAgain === option.value
                            ? `${option.color} border-current`
                            : "bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Text variant="body-small" className="font-medium mb-2">
                    Any suggestions for improvement?
                  </Text>
                  <textarea
                    value={surveyData.suggestions}
                    onChange={(e) => handleInputChange('suggestions', e.target.value)}
                    placeholder="What could make this better?"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Ideas & Contact */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Text variant="body-small" className="font-medium mb-2">
                    Ideas for new features or rooms?
                  </Text>
                  <textarea
                    value={surveyData.additionalFeatures}
                    onChange={(e) => handleInputChange('additionalFeatures', e.target.value)}
                    placeholder="Features you'd love to see..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Text variant="body-small" className="font-medium mb-2">
                    Room ideas for communities?
                  </Text>
                  <textarea
                    value={surveyData.roomIdeas}
                    onChange={(e) => handleInputChange('roomIdeas', e.target.value)}
                    placeholder="Gardening club, book discussions, local events..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Text variant="body-small" className="font-medium mb-2">
                    Email (optional) - to receive your feedback summary
                  </Text>
                  <input
                    type="email"
                    value={surveyData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <Text variant="caption" color="muted" className="mt-1">
                    Optional: Get a copy of your feedback and demo summary.
                  </Text>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="text-gray-500"
              >
                Back
              </Button>

              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thank You State */}
      {hasSubmitted && (
        <Card className="w-80 max-w-[calc(100vw-3rem)] shadow-2xl border-2 border-green-200 animate-slide-up">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cat className="w-8 h-8 text-green-600" />
            </div>
            <Heading level={4} className="text-green-600 mb-2">
              Thank You! 🎉
            </Heading>
            <Text variant="body-small" color="muted" className="mb-4">
              Your feedback helps us build Kamunity together. 
              {surveyData.email && " Check your email for a summary!"}
            </Text>
            <div className="flex gap-2 justify-center">
              <a 
                href="https://kamunity.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700 underline"
              >
                kamunity.org
              </a>
              <span className="text-xs text-gray-400">•</span>
              <a 
                href="https://kamunitydemo.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700 underline"
              >
                Try again
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FloatingSurvey;
