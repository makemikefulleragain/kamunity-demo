'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { UnifiedRoomData, AdaptiveQuestion } from '../shared/types';
import { generateAdaptiveQuestions, calculateCompleteness } from '../shared/utils';

interface QuestionEngineProps {
  roomData: UnifiedRoomData;
  onUpdate: (updatedData: UnifiedRoomData) => void;
  onComplete: () => void;
  onSkip: () => void;
}

export default function QuestionEngine({ 
  roomData, 
  onUpdate, 
  onComplete,
  onSkip 
}: QuestionEngineProps) {
  const [questions, setQuestions] = useState<AdaptiveQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Generate questions based on missing data
    const adaptiveQuestions = generateAdaptiveQuestions(roomData);
    setQuestions(adaptiveQuestions);
  }, [roomData]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = async (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    // Update room data with new answer
    const updatedData = {
      ...roomData,
      [currentQuestion.field]: answer,
      completeness: calculateCompleteness({
        ...roomData,
        [currentQuestion.field]: answer
      })
    };

    onUpdate(updatedData);

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Apply all answers to room data
    const finalData = {
      ...roomData,
      ...Object.entries(answers).reduce((acc, [questionId, answer]) => {
        const question = questions.find(q => q.id === questionId);
        if (question) {
          acc[question.field] = answer;
        }
        return acc;
      }, {} as any),
      completeness: 100
    };

    onUpdate(finalData);
    onComplete();
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Spec Already Complete!</h3>
          <p className="text-gray-600 mb-6">
            Your room specification is already 100% complete. Great job!
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
          >
            View Spec Sheet
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
          <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Enhancing Your Spec...</h3>
          <p className="text-gray-600">
            Applying your answers to create a comprehensive specification
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Enhance Your Spec</h2>
            </div>
            <button
              onClick={onSkip}
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              Skip All
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-sm mt-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start gap-2 mb-2">
              {currentQuestion.priority === 'high' && (
                <AlertCircle className="w-5 h-5 text-orange-500 mt-1" />
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                {currentQuestion.question}
              </h3>
            </div>
            {currentQuestion.context && (
              <p className="text-gray-600 text-sm ml-7">
                {currentQuestion.context}
              </p>
            )}
          </div>

          {/* Answer Options */}
          {currentQuestion.type === 'select' && currentQuestion.options && (
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {option}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <div className="mb-6">
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Type your answer here..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    const value = e.currentTarget.value.trim();
                    if (value) handleAnswer(value);
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Press Ctrl+Enter to submit
              </p>
            </div>
          )}

          {currentQuestion.type === 'number' && (
            <div className="mb-6">
              <input
                type="number"
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Enter a number..."
                min={currentQuestion.validation?.min}
                max={currentQuestion.validation?.max}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt(e.currentTarget.value);
                    if (!isNaN(value)) handleAnswer(value);
                  }
                }}
              />
            </div>
          )}

          {currentQuestion.type === 'multiselect' && currentQuestion.options && (
            <div className="space-y-2 mb-6">
              {currentQuestion.options.map((option, index) => {
                const [selected, setSelected] = useState(false);
                return (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => setSelected(e.target.checked)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                );
              })}
              <button
                onClick={() => {
                  const selectedOptions = currentQuestion.options?.filter((_, i) => {
                    const checkbox = document.querySelectorAll('input[type="checkbox"]')[i] as HTMLInputElement;
                    return checkbox?.checked;
                  });
                  if (selectedOptions?.length) handleAnswer(selectedOptions);
                }}
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <button
              onClick={handleSkipQuestion}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip this question
            </button>
            
            <div className="flex items-center gap-3">
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Complete Enhancement
                </button>
              ) : (
                <span className="text-sm text-gray-500">
                  Answer to continue
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
