'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, MessageSquare, Activity, Bot, Play, Pause, TrendingUp, Eye, Sparkles, Lock, Globe, Settings, Target, Calendar, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { UnifiedRoomData } from './shared/types';

interface GeneratedRoomProps {
  roomData: UnifiedRoomData;
  onBack: () => void;
  onEnhance: () => void;
}

export default function GeneratedRoom({ roomData, onBack, onEnhance }: GeneratedRoomProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationTime, setSimulationTime] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
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

  // Generate contextual messages based on room data
  const generateMessage = () => {
    const users = ['Sarah Chen', 'Marcus Johnson', 'Emily Rodriguez', 'David Kim', 'Lisa Wang', 'Alex Turner', 'Maya Patel'];
    const templates = getMessageTemplates();
    
    const user = users[Math.floor(Math.random() * users.length)];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const message = template.replace('{purpose}', roomData.purpose || 'our goals');
    
    return {
      id: Date.now(),
      user,
      message,
      time: 'just now',
      avatar: user[0]
    };
  };

  const getMessageTemplates = () => {
    const category = roomData.category?.toLowerCase() || 'general';
    const templates: Record<string, string[]> = {
      'community building': [
        'Great progress on {purpose} today!',
        'Who can help with organizing our next community event?',
        'Just connected with 3 new members interested in {purpose}',
        'The feedback from last week\'s session was amazing!'
      ],
      'innovation': [
        'New prototype ready for {purpose}!',
        'Interesting research paper related to our work',
        'Who wants to brainstorm solutions for {purpose}?',
        'Just had a breakthrough idea!'
      ],
      'education': [
        'Resources uploaded for {purpose}',
        'Next workshop scheduled for Thursday',
        'Great questions in today\'s session about {purpose}',
        'Study group forming for advanced topics'
      ],
      'default': [
        'Making progress on {purpose}',
        'Thanks everyone for the support!',
        'New milestone reached!',
        'Looking forward to our next steps'
      ]
    };
    
    return templates[category] || templates.default;
  };

  // Generate activities based on room features
  const generateActivity = () => {
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
      setSimulationTime(prev => prev + 1);
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

    // Stats updates
    const statsTimer = setInterval(() => {
      setStats(prev => ({
        activeMembers: Math.max(5, Math.min(30, prev.activeMembers + Math.floor(Math.random() * config.statsVariation) - 1)),
        messages: prev.messages + Math.floor(Math.random() * 5),
        impactScore: prev.impactScore + Math.floor(Math.random() * 20),
        engagement: Math.min(100, Math.max(60, prev.engagement + Math.floor(Math.random() * 5) - 2)),
        resources: prev.resources + (Math.random() > 0.7 ? 1 : 0),
        milestones: prev.milestones + (Math.random() > 0.9 ? 1 : 0),
        connections: prev.connections + Math.floor(Math.random() * 3),
        growth: Math.min(50, Math.max(5, prev.growth + Math.floor(Math.random() * 5) - 2))
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
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{roomData.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {roomData.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    {roomData.privacy === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {roomData.privacy}
                  </span>
                  <span className="text-sm text-gray-600">
                    {roomData.estimatedMembers} members
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {roomData.completeness < 100 && (
                <button
                  onClick={onEnhance}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Enhance Room ({100 - roomData.completeness}%)
                </button>
              )}
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Control */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Live Simulation</span>
              </div>
              <span className="text-sm opacity-90">
                {Math.floor(simulationTime / 60)}:{(simulationTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Completeness Indicator */}
      {roomData.completeness < 100 && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Room is {roomData.completeness}% complete. Some features are limited.
              </p>
              <button
                onClick={onEnhance}
                className="text-sm text-yellow-700 hover:text-yellow-900 underline"
              >
                Complete setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className={`grid ${showAdvancedFeatures ? 'grid-cols-4 lg:grid-cols-8' : showEnhancedFeatures ? 'grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4'} gap-4 mb-6`}>
          <StatsCard icon={Users} label="Active" value={stats.activeMembers} color="blue" />
          <StatsCard icon={MessageSquare} label="Messages" value={stats.messages} color="green" />
          <StatsCard icon={TrendingUp} label="Impact" value={stats.impactScore} color="purple" />
          <StatsCard icon={Activity} label="Engagement" value={`${stats.engagement}%`} color="orange" />
          
          {showEnhancedFeatures && (
            <>
              <StatsCard icon={FileText} label="Resources" value={stats.resources} color="indigo" />
              <StatsCard icon={Target} label="Milestones" value={stats.milestones} color="pink" />
            </>
          )}
          
          {showAdvancedFeatures && (
            <>
              <StatsCard icon={Users} label="Connections" value={stats.connections} color="cyan" />
              <StatsCard icon={TrendingUp} label="Growth" value={`+${stats.growth}%`} color="emerald" />
            </>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Simulation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Live Discussion
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
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

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Activity Stream
              </h2>
              <div className="space-y-3">
                {activities.map(item => (
                  <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 animate-fadeIn">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-gray-900">{item.user}</span>
                        <span className="text-sm text-gray-600">{item.action}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Features */}
            {showEnhancedFeatures && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Milestones & Goals
                </h2>
                <div className="space-y-3">
                  <MilestoneItem 
                    title="Community Launch" 
                    progress={100} 
                    status="completed"
                  />
                  <MilestoneItem 
                    title={roomData.purpose?.substring(0, 30) || "Primary Objective"} 
                    progress={65} 
                    status="in-progress"
                  />
                  <MilestoneItem 
                    title="Scale to 100 Members" 
                    progress={30} 
                    status="upcoming"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Kai AI Assistant</h3>
                    <p className="text-sm text-gray-600">
                      {showAdvancedFeatures ? 'Predictive Analytics' : showEnhancedFeatures ? 'Smart Insights' : 'Basic Suggestions'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <AIInsight 
                  type="summary"
                  title="Activity Summary"
                  content={`Your room is ${stats.engagement}% engaged with ${stats.activeMembers} active members discussing ${roomData.purpose?.substring(0, 50) || 'community goals'}.`}
                />
                
                {showEnhancedFeatures && (
                  <AIInsight 
                    type="suggestion"
                    title="Recommended Action"
                    content="Schedule a weekly sync to maintain momentum. Similar rooms see 40% better retention with regular meetings."
                  />
                )}
                
                {showAdvancedFeatures && (
                  <AIInsight 
                    type="prediction"
                    title="Growth Forecast"
                    content={`Based on current activity, expect ${Math.round(stats.growth * 2)} new members this month. Consider preparing onboarding materials.`}
                  />
                )}
              </div>
            </div>

            {/* Resources */}
            {showEnhancedFeatures && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Resources
                </h3>
                <div className="space-y-2">
                  {roomData.tools?.slice(0, 3).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <span className="text-sm text-gray-700">{tool}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                  <button className="w-full text-sm text-blue-600 hover:text-blue-700 mt-2">
                    View all resources →
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-sm transition-all text-sm">
                  📅 Schedule Event
                </button>
                <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-sm transition-all text-sm">
                  📊 View Analytics
                </button>
                <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-sm transition-all text-sm">
                  👥 Invite Members
                </button>
                {showAdvancedFeatures && (
                  <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-sm transition-all text-sm">
                    🔧 Configure Automation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatsCard({ icon: Icon, label, value, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    pink: 'bg-pink-50 text-pink-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    emerald: 'bg-emerald-50 text-emerald-600'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function MilestoneItem({ title, progress, status }: any) {
  const statusColors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-blue-500',
    upcoming: 'bg-gray-300'
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className="text-xs text-gray-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${statusColors[status]} h-2 rounded-full transition-all`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function AIInsight({ type, title, content }: any) {
  const typeStyles = {
    summary: 'bg-blue-50 border-blue-200',
    suggestion: 'bg-green-50 border-green-200',
    prediction: 'bg-purple-50 border-purple-200'
  };

  const typeIcons = {
    summary: '📊',
    suggestion: '💡',
    prediction: '🔮'
  };

  return (
    <div className={`p-3 rounded-lg border ${typeStyles[type]}`}>
      <p className="text-sm font-medium text-gray-900 mb-1">
        {typeIcons[type]} {title}
      </p>
      <p className="text-sm text-gray-700">{content}</p>
    </div>
  );
}
