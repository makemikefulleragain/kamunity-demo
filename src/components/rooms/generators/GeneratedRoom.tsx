'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Users, MessageSquare, Activity, Bot, Play, Pause, TrendingUp, Target, Calendar, FileText } from 'lucide-react';
import { UnifiedRoomData } from './shared/types';

interface GeneratedRoomProps {
  roomData: UnifiedRoomData;
  onBack: () => void;
  onEnhance: () => void;
}

export default function GeneratedRoom({ roomData, onBack, onEnhance }: GeneratedRoomProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [messages, setMessages] = useState<Array<{id: number, user: string, message: string, time: string, avatar: string}>>([]);
  const [, setActivities] = useState<Array<{id: number, user: string, action: string, time: string}>>([]);
  const [showSavedBanner, setShowSavedBanner] = useState(false);
  const [stats, setStats] = useState({
    activeMembers: 12,
    messages: 156,
    impactScore: 450,
    engagement: 78,
    resources: 23,
    milestones: 5,
    connections: 34,
    growth: 12
  });

  // Handle saving demo room to Room Hub
  const handleSaveDemo = useCallback(async () => {
    console.log('Save Demo button clicked!', { roomData, stats });
    
    try {
      // Validate required data
      if (!roomData || !roomData.name) {
        throw new Error('Room data is missing or invalid');
      }

      const savedRoomData = {
        id: `saved-demo-${Date.now()}`,
        title: `${roomData.name} (Demo)`,
        description: roomData.purpose || 'A saved demo room from the Focus Room Generator',
        category: 'Saved Demo',
        engagement: stats.engagement,
        commentCount: stats.messages,
        tags: ['demo', 'saved', 'focus-room', ...(roomData.tools?.slice(0, 2) || [])],
        createdAt: new Date().toISOString(),
        demoType: 'saved-focus-room',
        roomData: roomData, // Store full room data for recreation
        stats: stats // Store current stats
      };

      console.log('Attempting to save room data:', savedRoomData);

      // Import and use memory store
      const { memoryStore } = await import('@/lib/demo/memoryStore');
      
      if (!memoryStore) {
        throw new Error('Memory store not available');
      }

      memoryStore.set(`saved-room-${savedRoomData.id}`, savedRoomData);
      console.log('Room saved to memory store');
      
      // Track the save event
      memoryStore.track('demo_room_saved', {
        roomId: savedRoomData.id,
        roomName: roomData.name,
        engagement: stats.engagement
      });

      // Show success feedback and trigger banner
      console.log('SUCCESS: Room saved successfully!', savedRoomData);
      
      // Show the saved banner in the current room
      setShowSavedBanner(true);
      
      // Send email with room spec
      try {
        const emailResponse = await fetch('/api/demo/room-spec-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomData: savedRoomData,
            userEmail: 'mike@kamunityconsulting.com' // Default admin email
          }),
        });
        
        if (emailResponse.ok) {
          console.log('Room spec email sent successfully');
        } else {
          console.error('Failed to send room spec email');
        }
      } catch (emailError) {
        console.error('Error sending room spec email:', emailError);
      }
      
    } catch (error) {
      console.error('Error saving demo room:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`❌ Failed to save demo room: ${errorMessage}\n\nPlease try again.`);
    }
  }, [roomData, stats]);

  // Determine simulation intensity based on completeness
  const getSimulationConfig = () => {
    if (roomData.completeness >= 90) {
      return {
        messageFrequency: 5000,
        activityFrequency: 8000,
        statsVariation: 5,
        features: 'comprehensive'
      };
    } else if (roomData.completeness >= 75) {
      return {
        messageFrequency: 15000,
        activityFrequency: 20000,
        statsVariation: 3,
        features: 'balanced'
      };
    } else {
      return {
        messageFrequency: 30000,
        activityFrequency: 40000,
        statsVariation: 2,
        features: 'fast'
      };
    }
  };

  const config = getSimulationConfig();

  // Generate contextual messages based on room data and target audience
  const generateMessage = useCallback(() => {
    const users = generateContextualUsers();
    const templates = getMessageTemplates();
    
    const user = users[Math.floor(Math.random() * users.length)];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const message = template
      .replace('{purpose}', roomData.purpose || 'our goals')
      .replace('{targetGroup}', roomData.targetAudience || 'team')
      .replace('{goal}', roomData.expectedOutcomes?.[0] || 'success');
    
    return {
      id: Date.now(),
      user,
      message,
      time: 'just now',
      avatar: user[0]
    };
  }, [roomData.targetAudience, roomData.purpose, roomData.expectedOutcomes]);

  // Generate user names based on target audience
  const generateContextualUsers = () => {
    const targetGroup = roomData.targetAudience?.toLowerCase() || '';
    
    if (targetGroup.includes('startup') || targetGroup.includes('founder')) {
      return ['Alex Chen (CEO)', 'Sarah Kim (CTO)', 'Marcus Rodriguez (CMO)', 'Emily Wang (CPO)', 'David Park (COO)'];
    } else if (targetGroup.includes('marketing') || targetGroup.includes('brand')) {
      return ['Jessica Brand', 'Michael Creative', 'Lisa Campaign', 'Tom Analytics', 'Nina Social'];
    } else if (targetGroup.includes('developer') || targetGroup.includes('tech')) {
      return ['Alex.dev', 'Sarah_codes', 'Marcus.js', 'Emily.py', 'David.react'];
    } else if (targetGroup.includes('student') || targetGroup.includes('education')) {
      return ['Alex (Year 3)', 'Sarah M.', 'Marcus T.', 'Emily R.', 'David K.'];
    }
    
    return ['Sarah Chen', 'Marcus Johnson', 'Emily Rodriguez', 'David Kim', 'Lisa Wang', 'Alex Turner'];
  };

  const getMessageTemplates = () => {
    const targetGroup = roomData.targetAudience?.toLowerCase() || '';
    
    // Context-aware message templates
    const templates = [
      'Great progress on {purpose} today!',
      'Just achieved a milestone for {goal}!',
      'Who can help with the next phase of {purpose}?',
      'Loving the collaboration energy in here!',
      'New insights shared about {goal}',
      'Thanks {targetGroup} for the amazing support!',
      'Ready to tackle {purpose} together',
      'The momentum on {goal} is incredible!'
    ];
    
    // Add specific templates based on target audience
    if (targetGroup.includes('startup')) {
      templates.push('Investor meeting went well!', 'Product-market fit looking strong', 'User feedback is amazing');
    } else if (targetGroup.includes('marketing')) {
      templates.push('Campaign performance exceeded expectations', 'Brand awareness up 40%', 'New creative concepts ready');
    } else if (targetGroup.includes('developer')) {
      templates.push('Code review completed', 'Deployment successful', 'Bug fixes merged');
    }
    
    return templates;
  };

  // Generate activities based on room features
  const generateActivity = useCallback(() => {
    const users = ['Sarah Chen', 'Marcus Johnson', 'Emily Rodriguez', 'David Kim', 'Lisa Wang'];
    const actions = getActivityActions();
    
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      id: Date.now(),
      user,
      action: action.type,
      detail: action.detail,
      time: 'just now',
      icon: action.icon
    };
  }, [roomData.tools, roomData.targetAudience, roomData.purpose, roomData.completeness]);

  // Get contextual poll question based on room purpose
  const getContextualPollQuestion = () => {
    const targetGroup = roomData.targetAudience?.toLowerCase() || '';
    const purpose = roomData.purpose?.toLowerCase() || '';
    
    if (targetGroup.includes('startup')) {
      return 'What should be our next growth priority?';
    } else if (targetGroup.includes('marketing')) {
      return 'Which campaign strategy resonates most?';
    } else if (targetGroup.includes('developer')) {
      return 'What tech stack upgrade should we prioritise?';
    } else if (purpose.includes('innovation')) {
      return 'Which innovation area needs focus?';
    }
    
    return 'What should we focus on next?';
  };

  // Get contextual poll options based on room context
  const getContextualPollOptions = () => {
    const targetGroup = roomData.targetAudience?.toLowerCase() || '';
    
    if (targetGroup.includes('startup')) {
      return [
        { label: 'Product Development', percentage: 45 },
        { label: 'Market Expansion', percentage: 30 },
        { label: 'Team Building', percentage: 25 }
      ];
    } else if (targetGroup.includes('marketing')) {
      return [
        { label: 'Brand Awareness', percentage: 40 },
        { label: 'Lead Generation', percentage: 35 },
        { label: 'Customer Retention', percentage: 25 }
      ];
    } else if (targetGroup.includes('developer')) {
      return [
        { label: 'Performance', percentage: 50 },
        { label: 'Security', percentage: 30 },
        { label: 'User Experience', percentage: 20 }
      ];
    }
    
    return [
      { label: 'Innovation', percentage: 45 },
      { label: 'Collaboration', percentage: 35 },
      { label: 'Growth', percentage: 20 }
    ];
  };

  // Get contextual badges based on room purpose and audience
  const getContextualBadges = () => {
    const targetGroup = roomData.targetAudience?.toLowerCase() || '';
    const purpose = roomData.purpose?.toLowerCase() || '';
    
    if (targetGroup.includes('startup')) {
      return [
        { name: 'Growth Hacker', emoji: '🚀', color: 'bg-blue-100' },
        { name: 'MVP Builder', emoji: '🏗️', color: 'bg-green-100' },
        { name: 'Pitch Master', emoji: '🎯', color: 'bg-purple-100' }
      ];
    } else if (targetGroup.includes('marketing')) {
      return [
        { name: 'Brand Champion', emoji: '🏆', color: 'bg-yellow-100' },
        { name: 'Campaign Pro', emoji: '📢', color: 'bg-orange-100' },
        { name: 'Analytics Ace', emoji: '📊', color: 'bg-blue-100' }
      ];
    } else if (targetGroup.includes('developer')) {
      return [
        { name: 'Code Ninja', emoji: '⚡', color: 'bg-purple-100' },
        { name: 'Bug Hunter', emoji: '🐛', color: 'bg-red-100' },
        { name: 'Architect', emoji: '🏗️', color: 'bg-blue-100' }
      ];
    } else if (purpose.includes('innovation')) {
      return [
        { name: 'Innovator', emoji: '💡', color: 'bg-yellow-100' },
        { name: 'Disruptor', emoji: '⚡', color: 'bg-purple-100' },
        { name: 'Visionary', emoji: '🔮', color: 'bg-blue-100' }
      ];
    }
    
    return [
      { name: 'Impact Leader', emoji: '🏆', color: 'bg-yellow-100' },
      { name: 'Collaborator', emoji: '🤝', color: 'bg-green-100' },
      { name: 'Mentor', emoji: '🎓', color: 'bg-blue-100' }
    ];
  };

  // Get contextual analytics metrics based on room purpose
  const getContextualAnalytics = () => {
    const targetGroup = roomData.targetAudience?.toLowerCase() || '';
    const baseGrowth = Math.floor(stats.growth);
    
    if (targetGroup.includes('startup')) {
      return [
        { label: 'User Growth', value: `${baseGrowth * 2}%`, trend: 'up' },
        { label: 'Revenue Impact', value: `$${baseGrowth * 1000}`, trend: 'up' },
        { label: 'Product Velocity', value: `${baseGrowth + 15}%`, trend: 'up' }
      ];
    } else if (targetGroup.includes('marketing')) {
      return [
        { label: 'Brand Reach', value: `${baseGrowth * 3}K`, trend: 'up' },
        { label: 'Conversion Rate', value: `${baseGrowth / 2}%`, trend: 'up' },
        { label: 'Campaign ROI', value: `${baseGrowth * 10}%`, trend: 'up' }
      ];
    } else if (targetGroup.includes('developer')) {
      return [
        { label: 'Code Quality', value: `${90 + baseGrowth}%`, trend: 'up' },
        { label: 'Deploy Frequency', value: `${baseGrowth + 5}/week`, trend: 'up' },
        { label: 'Bug Resolution', value: `${baseGrowth + 20}%`, trend: 'up' }
      ];
    }
    
    return [
      { label: 'Engagement', value: `${baseGrowth}%`, trend: 'up' },
      { label: 'Impact Score', value: `${stats.impactScore}`, trend: 'up' },
      { label: 'Connections', value: `+${Math.floor(baseGrowth / 2)}`, trend: 'up' }
    ];
  };

  const getActivityActions = () => {
    const actions = [
      { type: 'Logged impact', detail: `+${Math.floor(Math.random() * 100)} points`, icon: 'trending' },
      { type: 'Shared resource', detail: roomData.tools?.[0] || 'New document', icon: 'file' },
      { type: 'Completed task', detail: 'Milestone achieved', icon: 'check' },
      { type: 'Started discussion', detail: roomData.purpose?.substring(0, 30) || 'New topic', icon: 'message' }
    ];
    
    if (roomData.completeness >= 75) {
      actions.push(
        { type: 'Created event', detail: 'Community workshop', icon: 'calendar' },
        { type: 'Invited member', detail: 'Growing the community', icon: 'users' }
      );
    }
    
    if (roomData.completeness >= 90) {
      actions.push(
        { type: 'Published report', detail: 'Monthly analytics', icon: 'chart' },
        { type: 'Achieved goal', detail: 'Quarterly target met', icon: 'trophy' }
      );
    }
    
    return actions;
  };

  // Simulation effects
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      // Simulation timer for activity updates
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    // Message generation
    const messageTimer = setInterval(() => {
      setMessages(prev => [generateMessage(), ...prev.slice(0, 9)]);
    }, config.messageFrequency);

    // Activity generation
    const activityTimer = setInterval(() => {
      setActivities(prev => [generateActivity(), ...prev.slice(0, 6)]);
    }, config.activityFrequency);

    // Stats updates with dynamic calculation
    const statsTimer = setInterval(() => {
      const targetGroup = roomData.targetAudience?.toLowerCase() || '';
      let memberMultiplier = 1;
      let engagementMultiplier = 1;
      let impactMultiplier = 1;
      
      if (targetGroup.includes('startup')) {
        memberMultiplier = 0.8;
        engagementMultiplier = 1.3;
        impactMultiplier = 1.5;
      } else if (targetGroup.includes('marketing')) {
        memberMultiplier = 1.2;
        engagementMultiplier = 1.1;
        impactMultiplier = 1.2;
      } else if (targetGroup.includes('developer')) {
        memberMultiplier = 1.0;
        engagementMultiplier = 0.9;
        impactMultiplier = 1.3;
      }
      
      setStats(prev => ({
        activeMembers: Math.max(5, Math.min(30, Math.floor(prev.activeMembers * memberMultiplier) + Math.floor(Math.random() * config.statsVariation) - 1)),
        messages: prev.messages + Math.floor(Math.random() * 5 * engagementMultiplier),
        impactScore: prev.impactScore + Math.floor(Math.random() * 20 * impactMultiplier),
        engagement: Math.min(100, Math.max(60, Math.floor(prev.engagement * engagementMultiplier) + Math.floor(Math.random() * 5) - 2)),
        resources: prev.resources + (Math.random() > 0.7 ? 1 : 0),
        milestones: prev.milestones + (Math.random() > 0.9 ? 1 : 0),
        connections: prev.connections + Math.floor(Math.random() * 3 * memberMultiplier),
        growth: Math.min(50, Math.max(5, Math.floor(prev.growth * impactMultiplier) + Math.floor(Math.random() * 5) - 2))
      }));
    }, 3000);

    return () => {
      clearInterval(messageTimer);
      clearInterval(activityTimer);
      clearInterval(statsTimer);
    };
  }, [isPlaying, config.messageFrequency, config.activityFrequency, config.statsVariation]);

  // Initialize with some messages and activities
  useEffect(() => {
    const initialMessages = Array.from({ length: 5 }, () => generateMessage());
    const initialActivities = Array.from({ length: 4 }, () => generateActivity());
    setMessages(initialMessages);
    setActivities(initialActivities);
  }, []);

  const showEnhancedFeatures = roomData.completeness >= 75;
  const showAdvancedFeatures = roomData.completeness >= 90;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header: Simplified */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Generator
              </button>
              <span className="text-lg font-bold text-purple-600">Kamunity</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Join Room
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                U
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner: Room Name | Purpose + Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">{roomData.name}</h1>
            <p className="text-purple-100 text-lg mb-4">{roomData.purpose}</p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{stats.activeMembers} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>{stats.engagement}% engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{stats.milestones} milestones</span>
              </div>
            </div>
          </div>
          
          {/* Member Avatars */}
          <div className="flex justify-center">
            <div className="flex -space-x-2">
              {['S', 'M', 'E', 'D', 'L', 'A'].map((initial, idx) => (
                <div key={idx} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white">
                  {initial}
                </div>
              ))}
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                +{stats.activeMembers - 6}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Bar: Minimized */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Live Activity</span>
              </div>
              <span className="text-sm text-gray-600">
                Last: &ldquo;{messages[0]?.message?.substring(0, 30) || 'Welcome to the room'}&rdquo;... - {messages[0]?.user || 'Team'}
              </span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 text-xs"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Key Stats: Simplified */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard icon={Users} label="Members" value={stats.activeMembers} color="blue" />
          <StatsCard icon={Activity} label="Engagement" value={`${stats.engagement}%`} color="green" />
          <StatsCard icon={TrendingUp} label="Impact Score" value={stats.impactScore} color="purple" />
        </div>
        
        {/* View All Stats Link */}
        <div className="text-center mb-6">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
            View All Analytics →
          </button>
        </div>

        {/* Main Content Area: 2/3 Chat + 1/3 AI Assistant */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2">
            {/* Live Room Chat */}
            <div className="bg-white rounded-xl shadow-sm p-6 h-96">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                💬 Live Room Chat
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className="flex gap-3 animate-fadeIn">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-gray-900">{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Assistant (1/3) */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-96">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              🤖 Smart Suggestions
            </h2>
            <div className="space-y-4">
              <AIInsight 
                type="summary"
                title="Room Overview"
                content={`${stats.activeMembers} active members with ${stats.engagement}% engagement. Focus on ${roomData.purpose?.toLowerCase() || 'collaboration'}.`}
              />
              
              {stats.engagement > 80 && (
                <AIInsight 
                  type="suggestion"
                  title="High Engagement"
                  content="Consider expanding room features or creating sub-groups to maintain momentum."
                />
              )}
              
              {roomData.completeness < 90 && (
                <AIInsight 
                  type="prediction"
                  title="Growth Forecast"
                  content={`Based on current activity, expect ${Math.round(stats.growth * 2)} new members this month. Consider preparing onboarding materials.`}
                />
              )}
              
              {/* Get Full Spec CTA */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">📧 Get Full Room Spec</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Professional consultation document via email
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Email Specification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widgets Row: [📅 Calendar] [📊 Polls] [⭐ Badges] [📈 Analytics] */}
        <div className="mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Calendar Widget */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">📅 Upcoming</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Team Sync</div>
                  <div className="text-gray-600">Tomorrow 2pm</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Workshop</div>
                  <div className="text-gray-600">Friday 10am</div>
                </div>
              </div>
            </div>

            {/* Polls Widget */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">📊 Quick Poll</h3>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-2">Next priority?</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Feature A</span>
                    <span className="text-green-600">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bug fixes</span>
                    <span className="text-blue-600">35%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Widget */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">⭐ Achievements</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">🏆</span>
                  </div>
                  <span className="text-sm font-medium">Top Contributor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">🎯</span>
                  </div>
                  <span className="text-sm font-medium">Goal Crusher</span>
                </div>
              </div>
            </div>

            {/* Analytics Widget */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">📈 Trends</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Engagement</span>
                  <span className="text-green-600 font-medium">↗ +12%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>New Members</span>
                  <span className="text-blue-600 font-medium">↗ +8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              🚀 This is a <strong>live demo</strong> of your Focus Room. Ready to make it real?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Generator
              </button>
              <button
                onClick={handleSaveDemo}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                💾 Save Demo
              </button>
            </div>
          </div>
        </div>

        {/* Saved Room Banner - appears after save */}
        {showSavedBanner && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 border-t-4 border-green-400 shadow-2xl mt-8">
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-6 h-6 bg-white rounded-full animate-pulse shadow-lg" />
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-white mb-2">
                      🎉 Room Saved Successfully!
                    </div>
                    <div className="text-green-100 text-base">
                      "{roomData.name}" has been saved to your Room Hub and the full spec has been emailed to you
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowSavedBanner(false)}
                    className="bg-green-400 text-green-900 hover:bg-green-300 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={() => {
                      // Add delay to ensure save operation completes before navigation
                      setTimeout(() => {
                        // Use location.href instead of window.open to force full page reload
                        window.location.href = '/rooms?t=' + Date.now();
                      }, 500);
                    }}
                    className="bg-white text-green-600 hover:text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    View in Room Hub →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
const StatsCard = ({ icon: Icon, label, value, color }: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color: string; 
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    pink: 'text-pink-600 bg-pink-50',
    cyan: 'text-cyan-600 bg-cyan-50',
    emerald: 'text-emerald-600 bg-emerald-50'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

const AIInsight = ({ type, title, content }: { 
  type: 'summary' | 'suggestion' | 'prediction'; 
  title: string; 
  content: string; 
}) => {
  const typeStyles = {
    summary: 'bg-blue-50 border-blue-200 text-blue-800',
    suggestion: 'bg-green-50 border-green-200 text-green-800',
    prediction: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  const typeIcons = {
    summary: '📊',
    suggestion: '💡', 
    prediction: '🔮'
  };

  return (
    <div className={`p-3 rounded-lg border ${typeStyles[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-sm">{typeIcons[type]}</span>
        <div className="flex-1">
          <div className="font-medium text-sm mb-1">{title}</div>
          <div className="text-xs opacity-90">{content}</div>
        </div>
      </div>
    </div>
  );
};
