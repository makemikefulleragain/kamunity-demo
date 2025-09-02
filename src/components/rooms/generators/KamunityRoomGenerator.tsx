'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Send, Mail } from 'lucide-react';
import { UnifiedRoomData } from './shared/types';

interface KamunityRoomGeneratorProps {
  onComplete: (data: UnifiedRoomData) => void;
  onCancel: () => void;
}

type Step = 'intro' | 'questions' | 'confirmation' | 'generation' | 'complete' | 'email';

interface UserResponses {
  targetGroup: string;
  goals: string;
  constraints: string;
  tone: string;
  tools: string;
}

export default function KamunityRoomGenerator({ onComplete, onCancel }: KamunityRoomGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [responses, setResponses] = useState<Partial<UserResponses>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [generatedSpec, setGeneratedSpec] = useState<any>(null);

  const handleQuestionSubmit = () => {
    if (!responses.targetGroup || !responses.goals) return;
    
    setCurrentStep('confirmation');
  };

  const handleInputSubmit = () => {
    if (!currentInput.trim()) return;
    
    if (currentStep === 'confirmation') {
      if (currentInput.toLowerCase().includes('yes') || currentInput.toLowerCase().includes('confirm')) {
        setCurrentStep('generation');
        generateSpec();
      }
    }
    setCurrentInput('');
  };

  const generateSpec = () => {
    // Generate comprehensive 8-section Focus Room specification
    const roomName = `${responses.targetGroup} Focus Room`;
    const toolsList = responses.tools?.split(',').map(t => t.trim()) || ['Discussion Forum', 'Resource Library', 'Calendar'];
    
    const spec = {
      id: `room_${Date.now()}`,
      name: roomName,
      title: roomName,
      purpose: responses.goals || 'Community collaboration and impact',
      description: `A dedicated space for ${responses.targetGroup} to achieve ${responses.goals}`,
      
      // 8-Section Detailed Specification
      detailedSpec: {
        // 1. Pitch/Sales Section
        pitchSection: {
          hook: `Transform how ${responses.targetGroup} collaborate and achieve ${responses.goals} with a purpose-built digital Focus Room.`,
          cta: "Let's get this live and start building momentum together!"
        },
        
        // 2. Community Space ROI
        roiStory: `Meet Sarah, a ${responses.targetGroup} member. Before the Focus Room, she spent hours in scattered emails and missed opportunities. Now, she logs in each morning to find relevant discussions, upcoming events, and AI-suggested connections. Within weeks, her team's ${responses.goals} improved by 40%. The Focus Room didn't just organise their work—it amplified their impact through seamless collaboration and shared knowledge.`,
        
        // 3. Time & Cost Savings
        savingsTable: {
          before: {
            weeklyHours: '8 hours in scattered communications',
            monthlyTools: '$200 across multiple platforms',
            coordination: 'Manual scheduling and follow-ups'
          },
          after: {
            weeklyHours: '3 hours in focused collaboration',
            monthlyTools: '$50 consolidated platform',
            coordination: 'Automated workflows and AI assistance'
          },
          savings: {
            timeWeekly: '5 hours saved',
            costMonthly: '$150 saved',
            efficiency: '60% improvement in coordination'
          }
        },
        
        // 4. Homepage Wireframe
        wireframe: {
          description: `
┌─────────────────────────────────────────────────────────────┐
│ Header: [Kamunity] [Actions] [Impact] [${toolsList[0]}] [Profile] │
├─────────────────────────────────────────────────────────────┤
│ Hero: ${roomName} | ${responses.goals}                        │
│ 👥 15 members | 📊 85% engagement | 🎯 12 milestones        │
├─────────────────────────────────────────────────────────────┤
│ Quick Actions: [Join Discussion] [Schedule] [Share Resource] │
├─────────────────────────────────────────────────────────────┤
│ Main Content (2/3)        │ AI Assistant (1/3)             │
│ 💬 Live Room Chat         │ 🤖 Smart Suggestions           │
│ Recent: "Great progress   │ "Consider scheduling a         │
│ on the quarterly goals!" │ follow-up for next week"       │
├─────────────────────────────────────────────────────────────┤
│ Widgets: [📅 Calendar] [📊 Polls] [⭐ Badges] [📈 Analytics] │
├─────────────────────────────────────────────────────────────┤
│ Footer: [Report Issue or Idea] [Help] [Settings]            │
└─────────────────────────────────────────────────────────────┘`,
          imagePrompts: [
            `Create a clean, modern collaboration portal wireframe in soft blue with light-gold accents. Top navigation shows: Kamunity, Actions, Impact, ${toolsList[0] || 'Tools'}. Hero banner displays "${roomName}", purpose statement "${responses.goals}", member avatars and engagement stats. Quick action row with relevant buttons. Two-column layout: left 2/3 for group chat, right 1/3 for AI assistant panel. Below: stacked widgets for calendar, polls, badges, analytics. Minimalist design with clear typography.`,
            `Design a professional community platform interface with warm blue tones and subtle gold highlights. Header navigation: Kamunity, Actions, Impact, custom tools. Central hero section featuring room title, mission statement, team photos and key metrics. Action buttons row for primary workflows. Split content area: main chat feed (larger) and AI helper sidebar (smaller). Feature modules below: scheduling, voting, achievements, insights. Clean, accessible UI design.`,
            `Develop a collaborative workspace wireframe using calming blue palette with elegant gold accents. Navigation bar: Kamunity, Actions, Impact, specialized tools. Prominent banner: room name, goal statement, member grid, progress indicators. Quick access toolbar for essential functions. Content split: conversation area (dominant) and intelligent assistant (supporting). Widget section: calendar integration, polling system, recognition badges, performance analytics. Modern, user-friendly interface.`
          ]
        },
        
        // 5. User Flow
        userFlow: [
          'Onboarding: Welcome tour highlighting key features and community guidelines',
          `Daily Check-in: Review AI-curated updates relevant to ${responses.goals}`,
          'Engage: Participate in discussions, respond to polls, share resources',
          'Collaborate: Schedule meetings, coordinate tasks, track progress',
          'Contribute: Share insights, celebrate wins, provide feedback',
          'Grow: Earn badges, build connections, expand expertise'
        ],
        
        // 6. Design Questions
        designQuestions: [
          `Should badge tiers reflect ${responses.goals} milestones or general participation?`,
          'Would you prefer automated daily digests or real-time notifications?',
          `How formal should the ${responses.tone || 'professional'} tone be in automated messages?`,
          'Should the AI assistant focus on task management or relationship building?'
        ],
        
        // 7. MVP/Pro/Full Matrix
        featureMatrix: {
          mvp: ['Secure authentication', 'Group chat', 'Basic calendar', 'Simple polls', 'Member profiles', 'Mobile responsive'],
          pro: ['AI assistant', 'Advanced analytics', 'Badge system', 'Integration APIs', 'Custom branding', 'Priority support'],
          full: ['Predictive insights', 'Advanced automation', 'Custom workflows', 'Enterprise SSO', 'White-label options', 'Dedicated success manager']
        },
        
        // 8. Additional Suggestions
        suggestions: {
          metrics: ['Weekly active users', 'Goal completion rate', 'Collaboration frequency', 'Knowledge sharing index'],
          pilot: 'Start with 10-15 core members for 4 weeks, gather feedback, iterate',
          risks: 'Adoption challenges mitigated through champion program and gradual rollout',
          nextSteps: ['Stakeholder alignment workshop', 'Technical requirements review', 'Pilot group selection', 'Success metrics definition']
        }
      },
      
      // Legacy fields for compatibility
      category: 'Community Building',
      targetAudience: responses.targetGroup || 'Community members',
      expectedOutcomes: [responses.goals || 'Meaningful collaboration'],
      estimatedMembers: '15-30',
      timeCommitment: 'Weekly engagement',
      skillsNeeded: ['Communication', 'Collaboration'],
      tools: toolsList,
      tags: ['community', 'collaboration'],
      privacy: 'Public',
      completeness: 95,
      demoRoomConfig: {
        theme: 'community',
        mockMembers: 20,
        activityLevel: 'medium' as const,
        contentSeeds: [responses.goals || 'collaboration'],
        features: ['chat', 'calendar', 'resources']
      },
      tier: 'comprehensive' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setGeneratedSpec(spec);
    setCurrentStep('complete');
  };

  const handleEmailSpec = async () => {
    if (!generatedSpec || !currentInput.trim()) return;
    
    // Email the specification
    try {
      const emailData = {
        to_email: currentInput,
        user_email: currentInput,
        room_name: generatedSpec.name,
        room_purpose: generatedSpec.purpose,
        room_spec: JSON.stringify(generatedSpec, null, 2),
        timestamp: new Date().toISOString()
      };
      
      console.log('📧 Sending spec email request:', { 
        email: emailData.user_email ? emailData.user_email.substring(0, 3) + '***' : 'none',
        hasSpec: !!emailData.room_spec,
        timestamp: emailData.timestamp
      });
      
      const response = await fetch('/api/demo/spec-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        alert('Specification emailed successfully!');
        setCurrentStep('complete');
        setCurrentInput('');
      } else {
        alert('Email failed. Please try again.');
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('Email failed. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kamunity Focus Room Generator</h2>
          <p className="text-gray-600">Professional consultation with comprehensive specification</p>
        </div>

        {currentStep === 'intro' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Purpose & Safeguards</h3>
              <p className="text-blue-800 mb-4">
                I'm here to help craft a custom Focus Room: a digital environment built around conversations, 
                community and impact, designed with transparency and iterative checks to ensure accuracy and 
                alignment with your needs.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• I'll summarise your objectives back to you and highlight assumptions</p>
                <p>• I'll propose 1–2 additional possibilities that align with your goals</p>
                <p>• I'll wait for your confirmation before building the full specification</p>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep('questions')}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Begin Consultation
            </button>
          </div>
        )}

        {currentStep === 'questions' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Who is this new Focus Room for?
                </label>
                <input
                  type="text"
                  value={responses.targetGroup || ''}
                  onChange={(e) => setResponses(prev => ({ ...prev, targetGroup: e.target.value }))}
                  placeholder="e.g. marketing team, startup founders, project managers"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. What do they want to achieve with it?
                </label>
                <input
                  type="text"
                  value={responses.goals || ''}
                  onChange={(e) => setResponses(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="e.g. better collaboration, faster decision making, knowledge sharing"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. Any constraints?
                </label>
                <input
                  type="text"
                  value={responses.constraints || ''}
                  onChange={(e) => setResponses(prev => ({ ...prev, constraints: e.target.value }))}
                  placeholder="e.g. must integrate with Slack, limited budget, remote team"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4. Preferred tone or style?
                </label>
                <input
                  type="text"
                  value={responses.tone || ''}
                  onChange={(e) => setResponses(prev => ({ ...prev, tone: e.target.value }))}
                  placeholder="e.g. professional, casual, playful, formal"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  5. Required tools or features?
                </label>
                <input
                  type="text"
                  value={responses.tools || ''}
                  onChange={(e) => setResponses(prev => ({ ...prev, tools: e.target.value }))}
                  placeholder="e.g. calendar, polling, file sharing, video calls"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <button
                onClick={handleQuestionSubmit}
                disabled={!responses.targetGroup || !responses.goals}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                Submit Responses
              </button>
            </div>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Check for Understanding</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Here's my understanding:</h4>
                <p className="text-gray-700">
                  You need a Focus Room for <strong>{responses.targetGroup}</strong> aiming to achieve <strong>{responses.goals}</strong>.
                </p>
                {responses.constraints && (
                  <p className="text-gray-700 mt-2">
                    Constraints: {responses.constraints}
                  </p>
                )}
                {responses.tone && (
                  <p className="text-gray-700 mt-2">
                    Preferred tone: {responses.tone}
                  </p>
                )}
                {responses.tools && (
                  <p className="text-gray-700 mt-2">
                    Required tools: {responses.tools}
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Additional possibilities:</h4>
                <div className="space-y-2 text-gray-700">
                  <p>• <strong>Knowledge Hub:</strong> Transform discussions into a searchable knowledge base that grows with your community's expertise</p>
                  <p>• <strong>Impact Tracking:</strong> Measure and celebrate progress with automated milestone recognition and success stories</p>
                  <p>• <strong>Cross-Pollination:</strong> Connect with related communities for broader collaboration and shared learning opportunities</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-700">
                Does this capture your intent? Would you like to include the additional ideas above? 
                Type "yes" to confirm or provide any adjustments:
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Type 'yes' to confirm or provide adjustments..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleInputSubmit}
                  disabled={!currentInput.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'generation' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-spin">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Focus Room Specification</h3>
              <p className="text-gray-600">Creating comprehensive room design with all 8 sections...</p>
            </div>
          </div>
        )}

        {currentStep === 'complete' && generatedSpec && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Focus Room Specification is Complete!</h3>
              <p className="text-gray-600">Review the full specification below, then email it to proceed to the demo room</p>
            </div>
            
            {/* 8-Section Detailed Specification Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
              <h4 className="font-semibold text-gray-900 mb-4">Complete Focus Room Specification</h4>
              
              <div className="space-y-6 text-sm">
                {/* 1. Pitch Section */}
                <div>
                  <h5 className="font-medium text-purple-800 mb-2">1. Pitch & Call to Action</h5>
                  <div className="bg-white p-4 rounded border">
                    <p className="mb-2">{generatedSpec.detailedSpec?.pitchSection?.hook}</p>
                    <p className="font-semibold text-purple-600">{generatedSpec.detailedSpec?.pitchSection?.cta}</p>
                  </div>
                </div>
                
                {/* 2. ROI Story */}
                <div>
                  <h5 className="font-medium text-green-800 mb-2">2. Community Space ROI</h5>
                  <div className="bg-white p-4 rounded border">
                    <p className="italic">{generatedSpec.detailedSpec?.roiStory}</p>
                  </div>
                </div>
                
                {/* 3. Savings Table */}
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">3. Time & Cost Savings</h5>
                  <div className="bg-white p-4 rounded border">
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div><strong>Before:</strong></div>
                      <div><strong>With Focus Room:</strong></div>
                      <div><strong>Savings:</strong></div>
                      <div>{generatedSpec.detailedSpec?.savingsTable?.before?.weeklyHours}</div>
                      <div>{generatedSpec.detailedSpec?.savingsTable?.after?.weeklyHours}</div>
                      <div className="text-green-600 font-semibold">{generatedSpec.detailedSpec?.savingsTable?.savings?.timeWeekly}</div>
                      <div>{generatedSpec.detailedSpec?.savingsTable?.before?.monthlyTools}</div>
                      <div>{generatedSpec.detailedSpec?.savingsTable?.after?.monthlyTools}</div>
                      <div className="text-green-600 font-semibold">{generatedSpec.detailedSpec?.savingsTable?.savings?.costMonthly}</div>
                    </div>
                  </div>
                </div>
                
                {/* 4. Wireframe */}
                <div>
                  <h5 className="font-medium text-indigo-800 mb-2">4. Homepage Layout</h5>
                  <div className="bg-white p-4 rounded border">
                    <pre className="text-xs font-mono whitespace-pre-wrap">{generatedSpec.detailedSpec?.wireframe?.description}</pre>
                  </div>
                </div>
                
                {/* 5. User Flow */}
                <div>
                  <h5 className="font-medium text-orange-800 mb-2">5. How You Might Flow</h5>
                  <div className="bg-white p-4 rounded border">
                    <ul className="list-disc list-inside space-y-1">
                      {generatedSpec.detailedSpec?.userFlow?.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* 6. Design Questions */}
                <div>
                  <h5 className="font-medium text-pink-800 mb-2">6. Design Questions & Options</h5>
                  <div className="bg-white p-4 rounded border">
                    <ul className="list-disc list-inside space-y-1">
                      {generatedSpec.detailedSpec?.designQuestions?.map((question: string, idx: number) => (
                        <li key={idx}>{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* 7. MVP Matrix */}
                <div>
                  <h5 className="font-medium text-teal-800 mb-2">7. MVP / Pro / Full Version Matrix</h5>
                  <div className="bg-white p-4 rounded border">
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div><strong>MVP</strong></div>
                      <div><strong>Pro</strong></div>
                      <div><strong>Full</strong></div>
                      <div className="space-y-1">
                        {generatedSpec.detailedSpec?.featureMatrix?.mvp?.map((feature: string, idx: number) => (
                          <div key={idx} className="text-green-600">✓ {feature}</div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        {generatedSpec.detailedSpec?.featureMatrix?.pro?.map((feature: string, idx: number) => (
                          <div key={idx} className="text-blue-600">✓ {feature}</div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        {generatedSpec.detailedSpec?.featureMatrix?.full?.map((feature: string, idx: number) => (
                          <div key={idx} className="text-purple-600">✓ {feature}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 8. Additional Suggestions */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">8. Additional Suggestions</h5>
                  <div className="bg-white p-4 rounded border space-y-2">
                    <div><strong>Metrics:</strong> {generatedSpec.detailedSpec?.suggestions?.metrics?.join(', ')}</div>
                    <div><strong>Pilot Approach:</strong> {generatedSpec.detailedSpec?.suggestions?.pilot}</div>
                    <div><strong>Next Steps:</strong> {generatedSpec.detailedSpec?.suggestions?.nextSteps?.join(', ')}</div>
                  </div>
                </div>
                
                {/* Image Prompts */}
                <div>
                  <h5 className="font-medium text-amber-800 mb-2">Wireframe Image Prompts</h5>
                  <div className="bg-white p-4 rounded border space-y-2">
                    <p className="text-xs text-gray-600 mb-2">Copy these prompts to your AI image tool of choice:</p>
                    {generatedSpec.detailedSpec?.wireframe?.imagePrompts?.map((prompt: string, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-xs">
                        <strong>Variation {idx + 1}:</strong> {prompt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={async () => {
                  console.log('🔘 Email Specification button clicked!');
                  
                  // Save room to hybrid storage first
                  try {
                    const { HybridStorage } = await import('@/lib/storage/hybrid-storage');
                    const roomData = {
                      id: `focus-room-${Date.now()}`,
                      title: generatedSpec.title || 'Focus Room',
                      description: generatedSpec.description || 'Generated focus room',
                      category: 'Focus Room Generator',
                      engagement: 85,
                      tags: generatedSpec.tags || ['focus', 'generator'],
                      roomData: generatedSpec.detailedSpec,
                      createdAt: new Date().toISOString(),
                      source: 'generator' as const,
                      createdBy: 'demo-user',
                      isActive: true
                    };
                    
                    await HybridStorage.saveRoom(roomData);
                    console.log('✅ Focus room saved to hybrid storage');
                  } catch (error) {
                    console.warn('⚠️ Failed to save focus room:', error);
                  }
                  
                  setCurrentStep('email');
                }}
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Specification
              </button>
              
              <button
                onClick={() => onComplete(generatedSpec)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Sparkles className="w-4 h-4" />
                View Live Demo
              </button>
            </div>
          </div>
        )}

        {currentStep === 'email' && generatedSpec && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Your Room Specification</h3>
              <p className="text-gray-600">Enter your email to receive the complete specification document</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="bg-white p-4 rounded border">
                  <h5 className="font-medium text-gray-800 mb-2">What you'll receive:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Complete room specification document</li>
                    <li>• Implementation guidelines</li>
                    <li>• Next steps recommendations</li>
                    <li>• Contact information for support</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentStep('complete')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Back to Review
              </button>
              
              <button
                onClick={handleEmailSpec}
                disabled={!currentInput.trim() || !currentInput.includes('@')}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
