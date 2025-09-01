'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Bot, User, Sparkles, FileText, Mail, Download } from 'lucide-react';
import { UnifiedRoomData } from './shared/types';
import { AIContentEngine } from './AIContentEngine';
import { SpecExporter } from './SpecExporter';
import { memoryStore } from '@/lib/demo/memoryStore';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ConversationalState {
  currentStep: number;
  userResponses: Record<string, any>;
  generatedSpec: any[];
  roomData: Partial<UnifiedRoomData>;
  conversationHistory: Message[];
  isComplete: boolean;
}

interface ConversationalRoomGeneratorProps {
  onComplete: (data: UnifiedRoomData) => void;
  onCancel: () => void;
}

const CONVERSATION_STEPS = [
  {
    id: 'challenge',
    question: "What community challenge or opportunity would you like to tackle? For example: 'improving local parks', 'supporting elderly neighbors', 'organizing block parties', or 'creating a skill-sharing network'.",
    followUp: "Tell me more about what's driving your passion for this."
  },
  {
    id: 'audience',
    question: "Who would be involved in making this happen? Think about: neighbors, local organizations, age groups, or people with specific interests or skills.",
    followUp: "What brings these people together around this cause?"
  },
  {
    id: 'impact',
    question: "What does success look like for you and your community? For example: 'cleaner neighborhoods', 'stronger connections between neighbors', 'regular community events', or 'shared resources and skills'.",
    followUp: "How will you know when you've made a real difference?"
  },
  {
    id: 'approach',
    question: "How do you envision people working together on this? Consider: regular meetups, online coordination, project teams, social events, or skill-sharing sessions.",
    followUp: "What would make this feel welcoming and productive for everyone?"
  }
];

export default function ConversationalRoomGenerator({ onComplete, onCancel }: ConversationalRoomGeneratorProps) {
  console.log('ConversationalRoomGenerator: Component rendering');
  
  const [state, setState] = useState<ConversationalState>({
    currentStep: 0,
    userResponses: {},
    generatedSpec: [],
    roomData: {},
    conversationHistory: [],
    isComplete: false
  });
  
  const [currentInput, setCurrentInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);
  
  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    console.log('ConversationalRoomGenerator: Initializing component');
    addAIMessage("Hi! I'm here to help you design a Focus Room for your community. I'll ask you a few questions to understand your vision and create a tailored space for meaningful collaboration.");
    
    const timeoutId = setTimeout(() => {
      console.log('ConversationalRoomGenerator: Adding first question');
      addAIMessage("What community challenge or opportunity would you like to tackle? For example: 'improving local parks', 'supporting elderly neighbors', 'organizing block parties', or 'creating a skill-sharing network'.");
    }, 2000);
    
    return () => {
      console.log('ConversationalRoomGenerator: Cleanup');
      clearTimeout(timeoutId);
    };
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [state.conversationHistory]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const addAIMessage = (content: string, isTyping = false) => {
    console.log('addAIMessage called with:', content);
    const message: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      isTyping
    };
    
    setState(prev => {
      console.log('Previous conversation history:', prev.conversationHistory);
      const newHistory = [...prev.conversationHistory, message];
      console.log('New conversation history:', newHistory);
      return {
        ...prev,
        conversationHistory: newHistory
      };
    });
  };
  
  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setState(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, message]
    }));
  };
  
  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;
    
    addUserMessage(input);
    setCurrentInput('');
    setIsAITyping(true);
    
    // Store user response
    const currentStepId = CONVERSATION_STEPS[state.currentStep]?.id;
    const updatedResponses = {
      ...state.userResponses,
      [currentStepId]: input
    };
    
    // Generate AI response based on context
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(input, currentStepId, updatedResponses);
      setIsAITyping(false);
      addAIMessage(aiResponse);
      
      // Update state
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        userResponses: updatedResponses
      }));
      
      // Check if conversation is complete
      if (state.currentStep + 1 >= CONVERSATION_STEPS.length) {
        setTimeout(() => {
          completeConversation(updatedResponses);
        }, 2000);
      } else {
        // Ask next question
        setTimeout(() => {
          const nextStep = CONVERSATION_STEPS[state.currentStep + 1];
          addAIMessage(nextStep.question);
        }, 1500);
      }
    }, 1000 + Math.random() * 1000); // Realistic typing delay
  };
  
  const generateAIResponse = async (userInput: string, stepId: string, responses: Record<string, any>): Promise<string> => {
    // Context-aware AI responses
    const responses_map = {
      challenge: [
        "That sounds like a really meaningful challenge to tackle.",
        "I can see why this matters to you and your community.",
        "That's exactly the kind of issue that brings people together."
      ],
      audience: [
        "Great! It sounds like you have a clear sense of who would be passionate about this.",
        "Those are exactly the right people to have involved.",
        "I can already see how this group could make a real impact together."
      ],
      impact: [
        "That's a powerful vision of success.",
        "I love how specific and measurable that impact would be.",
        "That kind of clear outcome will really motivate people."
      ],
      approach: [
        "That approach sounds both practical and inclusive.",
        "I can see how that would create a welcoming environment for everyone.",
        "That's exactly the kind of collaborative approach that works."
      ]
    };
    
    const responseOptions = responses_map[stepId] || ["That's really helpful context."];
    return responseOptions[Math.floor(Math.random() * responseOptions.length)];
  };
  
  const completeConversation = async (responses: Record<string, any>) => {
    setIsAITyping(true);
    
    // Generate room specification using AI engine
    const roomData = generateRoomSpec(responses);
    
    setState(prev => ({
      ...prev,
      roomData,
      isComplete: true
    }));
    
    setIsAITyping(false);
    addAIMessage("Perfect! I've created a comprehensive Focus Room specification based on our conversation. Let me show you what this could look like in action.");
    
    setTimeout(() => {
      setShowExport(true);
      addAIMessage("Your Focus Room is ready! You can view the live demo, download the specification, or have it emailed to you.");
    }, 2000);
  };

  const generateRoomSpec = (responses: Record<string, any>): Partial<UnifiedRoomData> => {
    // Generate room data based on conversation responses
    const challenge = responses.challenge || '';
    const audience = responses.audience || '';
    const impact = responses.impact || '';
    const approach = responses.approach || '';

    // Determine category based on keywords
    let category = 'Community Building';
    if (challenge.toLowerCase().includes('environment') || challenge.toLowerCase().includes('climate')) {
      category = 'Environmental Action';
    } else if (challenge.toLowerCase().includes('education') || challenge.toLowerCase().includes('learning')) {
      category = 'Education & Learning';
    } else if (challenge.toLowerCase().includes('health') || challenge.toLowerCase().includes('wellness')) {
      category = 'Health & Wellness';
    }

    return {
      id: `room_${Date.now()}`,
      name: `${category} Focus Room`,
      title: `${category} Focus Room`,
      purpose: challenge,
      description: `${challenge} ${approach}`,
      category,
      targetAudience: audience,
      expectedOutcomes: [impact],
      estimatedMembers: '10-25',
      timeCommitment: 'Weekly meetings',
      skillsNeeded: ['Communication', 'Collaboration'],
      tools: ['Discussion Forum', 'Resource Library', 'Event Calendar'],
      tags: [category.toLowerCase().replace(' ', '-')],
      privacy: 'Public',
      completeness: 85,
      specSections: [],
      demoRoomConfig: {
        theme: category.toLowerCase(),
        mockMembers: 15,
        activityLevel: 'medium' as const,
        contentSeeds: [challenge, impact],
        features: ['chat', 'calendar', 'resources']
      },
      questions: [],
      tier: 'balanced' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };
  
  const handleExport = (type: 'download' | 'email') => {
    // Track export action
    memoryStore.track('spec_exported', {
      type,
      roomTitle: state.roomData.title,
      timestamp: new Date().toISOString()
    });
  };
  
  const handleGoToDemo = () => {
    if (state.roomData) {
      onComplete(state.roomData as UnifiedRoomData);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Room Designer</h1>
            <p className="text-gray-600">Let's create your community space together</p>
          </div>
        </div>
        
        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {state.conversationHistory.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-3xl ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  }`}>
                    {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p>{message.content}</p>
                    {message.isTyping && (
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isAITyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-3xl">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="px-4 py-3 rounded-lg bg-gray-100">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          {!state.isComplete && (
            <div className="border-t p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserInput(currentInput)}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAITyping}
                />
                <button
                  onClick={() => handleUserInput(currentInput)}
                  disabled={!currentInput.trim() || isAITyping}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Export Options */}
          {showExport && (
            <div className="border-t p-6 bg-gray-50">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleGoToDemo}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  View Live Demo
                </button>
                
                <button
                  onClick={() => handleExport('download')}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Spec
                </button>
                
                <button
                  onClick={() => handleExport('email')}
                  className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Spec
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
