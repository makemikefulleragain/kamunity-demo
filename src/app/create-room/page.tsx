'use client'

import React, { useState } from 'react';
import { Container, Section, Heading, Text, Card, CardContent } from '@/components/ui';
import { ArrowLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackPageView, trackEngagement } from '@/lib/demo/analytics';

const CreateRoomPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    roomName: '',
    primaryGoal: '',
    targetAudience: '',
    timeCommitment: '',
    keyFeatures: [] as string[],
    successMetrics: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    trackPageView('create-room');
  }, []);

  const questions = [
    {
      id: 'roomName',
      question: "What's your room about?",
      placeholder: "e.g., Urban Gardening Enthusiasts",
      type: 'text'
    },
    {
      id: 'primaryGoal',
      question: "What's your primary goal?",
      placeholder: "e.g., Create a network of local gardeners sharing tips and organizing community plots",
      type: 'textarea'
    },
    {
      id: 'targetAudience',
      question: "Who is your target audience?",
      placeholder: "e.g., Local residents interested in sustainable living and community gardening",
      type: 'textarea'
    },
    {
      id: 'timeCommitment',
      question: "What's your time commitment?",
      placeholder: "e.g., 2-3 hours weekly for community coordination and content creation",
      type: 'text'
    },
    {
      id: 'keyFeatures',
      question: "What key features do you need?",
      options: [
        'Real-time chat',
        'Task management',
        'AI assistance',
        'Event scheduling',
        'Resource sharing',
        'Voting system',
        'Progress tracking',
        'Member profiles'
      ],
      type: 'checkbox'
    },
    {
      id: 'successMetrics',
      question: "How will you measure success?",
      placeholder: "e.g., Monthly community garden events, 50+ active members, measurable neighborhood impact",
      type: 'textarea'
    }
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
      trackEngagement('room_creation_step');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    trackEngagement('room_creation_submit');

    try {
      const response = await fetch('/api/demo/focus-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Room creation result:', result);
        router.push('/rooms?created=true');
      } else {
        const errorData = await response.json();
        console.error('Failed to create room:', errorData);
        alert(`Failed to create room: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep - 1];
  const isLastStep = currentStep === questions.length;
  const canProceed = formData[currentQuestion.id as keyof typeof formData];

  return (
    <Section spacing="lg" className="min-h-screen bg-gradient-to-br from-primary-50/30 to-secondary-50/30">
      <Container className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <Heading level={1} className="text-2xl font-bold text-primary-600">
              Create Your Focus Room
            </Heading>
            <Text color="muted" className="mt-1">
              Step {currentStep} of {questions.length}
            </Text>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <Heading level={2} className="text-xl font-semibold mb-6 text-gray-900">
              {currentQuestion.question}
            </Heading>

            {currentQuestion.type === 'text' && (
              <input
                type="text"
                value={formData[currentQuestion.id as keyof typeof formData] as string}
                onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            )}

            {currentQuestion.type === 'textarea' && (
              <textarea
                value={formData[currentQuestion.id as keyof typeof formData] as string}
                onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                autoFocus
              />
            )}

            {currentQuestion.type === 'checkbox' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options?.map((option) => (
                  <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.keyFeatures as string[]).includes(option)}
                      onChange={(e) => {
                        const current = formData.keyFeatures as string[];
                        if (e.target.checked) {
                          handleInputChange('keyFeatures', [...current, option]);
                        } else {
                          handleInputChange('keyFeatures', current.filter(f => f !== option));
                        }
                      }}
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Room'}
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default CreateRoomPage;
