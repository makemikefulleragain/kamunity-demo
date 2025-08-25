'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, MessageSquare, Activity, Bot, Calendar, BarChart3, UserPlus, Settings, FileText, Target, MessageCircle, ChevronDown, Send, Plus } from 'lucide-react';
import Link from 'next/link';
import { memoryStore } from '@/lib/demo/memoryStore';

// Focus Room Page with Hero Structure
export default function FocusRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  
  // Get room data from memory store or use defaults
  const [roomData, setRoomData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'requirements' | 'impact' | 'uat' | 'spec'>('requirements');
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const [dmMessages, setDmMessages] = useState<any[]>([]);
  const [selectedDmUser, setSelectedDmUser] = useState('Kai');
  const [isSimulating, setIsSimulating] = useState(true);
  const [completeness, setCompleteness] = useState(70);

  // Load room data from memory store
  useEffect(() => {
    const storedData = memoryStore.get(`room_${roomId}`);
    if (storedData) {
      setRoomData(storedData);
      setCompleteness(storedData.completeness || 70);
    } else {
      // Default room data if not found
      setRoomData({
        id: roomId,
        name: 'Community Innovation Hub',
        purpose: 'Accelerate community-driven innovation through collaborative projects',
        category: 'Innovation',
        description: 'A dynamic space for community members to collaborate on innovative solutions',
        estimatedMembers: '50-100',
        completeness: 70,
        quickActions: ['Schedule Event', 'View Analytics', 'Invite Members', 'Share Resources', 'Start Discussion'],
        requirements: [
          { id: 1, title: 'Weekly sync meetings', status: 'active', priority: 'high' },
          { id: 2, title: 'Project documentation', status: 'pending', priority: 'medium' },
          { id: 3, title: 'Member onboarding flow', status: 'active', priority: 'high' }
        ],
        impactMetrics: {
          totalImpact: 450,
          weeklyGrowth: 12,
          activeProjects: 5,
          completedMilestones: 8
        }
      });
    }
  }, [roomId]);

  // Simulate chat messages
  useEffect(() => {
    if (!isSimulating) return;

    const groupInterval = setInterval(() => {
      const users = ['Sarah Chen', 'Marcus Johnson', 'Emily Rodriguez', 'David Kim'];
      const messages = [
        'Great progress on the innovation sprint!',
        'Who can review the latest prototype?',
        'Just shared the updated roadmap',
        'The feedback session was really productive'
      ];
      
      setGroupMessages(prev => [{
        id: Date.now(),
        user: users[Math.floor(Math.random() * users.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev.slice(0, 49)]);
    }, 15000);

    const dmInterval = setInterval(() => {
      const kaiMessages = [
        'Based on current activity, engagement is up 15% this week',
        'Consider scheduling a brainstorming session for next Tuesday',
        'Three new members match your project requirements',
        'Your impact score has increased by 25 points'
      ];
      
      if (selectedDmUser === 'Kai') {
        setDmMessages(prev => [{
          id: Date.now(),
          user: 'Kai',
          message: kaiMessages[Math.floor(Math.random() * kaiMessages.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true
        }, ...prev.slice(0, 49)]);
      }
    }, 20000);

    return () => {
      clearInterval(groupInterval);
      clearInterval(dmInterval);
    };
  }, [isSimulating, selectedDmUser]);

  // Initialize with some messages
  useEffect(() => {
    setGroupMessages([
      { id: 1, user: 'Sarah Chen', message: 'Welcome to the Innovation Hub!', time: '10:30' },
      { id: 2, user: 'Marcus Johnson', message: 'Excited to collaborate with everyone', time: '10:32' },
      { id: 3, user: 'Emily Rodriguez', message: 'Let\'s build something amazing together', time: '10:35' }
    ]);
    
    setDmMessages([
      { id: 1, user: 'Kai', message: 'Hello! I\'m here to help you maximize your room\'s potential.', time: '10:30', isAi: true },
      { id: 2, user: 'Kai', message: 'Your room is currently 70% complete. Would you like suggestions to enhance it?', time: '10:31', isAi: true }
    ]);
  }, []);

  if (!roomData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleEnhanceRoom = () => {
    router.push(`/rooms/${roomId}/enhance`);
  };

  const handleCompleteDetails = () => {
    router.push(`/rooms/${roomId}/enhance?target=comprehensive`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/rooms" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{roomData.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              {completeness < 100 && (
                <button
                  onClick={handleCompleteDetails}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Complete to 100% ({100 - completeness}% remaining)
                </button>
              )}
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* About */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About This Room</h2>
              <p className="text-blue-100">{roomData.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {roomData.estimatedMembers} members
                </span>
                <span className="px-2 py-1 bg-white/20 rounded-full">
                  {roomData.category}
                </span>
              </div>
            </div>

            {/* Key Impacts */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Key Impacts</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{roomData.impactMetrics?.totalImpact || 450}</p>
                  <p className="text-sm text-blue-100">Total Impact Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">+{roomData.impactMetrics?.weeklyGrowth || 12}%</p>
                  <p className="text-sm text-blue-100">Weekly Growth</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{roomData.impactMetrics?.activeProjects || 5}</p>
                  <p className="text-sm text-blue-100">Active Projects</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{roomData.impactMetrics?.completedMilestones || 8}</p>
                  <p className="text-sm text-blue-100">Milestones</p>
                </div>
              </div>
            </div>

            {/* Visual/Image */}
            <div className="flex items-center justify-center">
              <div className="w-full h-48 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-2 opacity-80" />
                  <p className="text-sm opacity-90">Room Activity Visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto">
            {roomData.quickActions?.map((action: string, index: number) => {
              const icons: Record<string, any> = {
                'Schedule Event': Calendar,
                'View Analytics': BarChart3,
                'Invite Members': UserPlus,
                'Share Resources': FileText,
                'Start Discussion': MessageSquare
              };
              const Icon = icons[action] || Plus;
              
              return (
                <button
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                  onClick={() => {
                    memoryStore.track('quick_action_clicked', { action, roomId });
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {action}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Group Chat (2/3) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Group Chat
              </h3>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {groupMessages.map(msg => (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {msg.user[0]}
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
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Kai DM (1/3) */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  Direct Message
                </h3>
                <div className="relative">
                  <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">
                    {selectedDmUser === 'Kai' && <Bot className="w-4 h-4" />}
                    {selectedDmUser}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {dmMessages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.isAi ? '' : 'flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                    msg.isAi ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    {msg.isAi ? <Bot className="w-5 h-5" /> : 'Y'}
                  </div>
                  <div className={`flex-1 ${!msg.isAi ? 'text-right' : ''}`}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-gray-900">{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className={`mt-1 inline-block px-3 py-2 rounded-lg ${
                      msg.isAi ? 'bg-purple-50 text-gray-700' : 'bg-blue-50 text-gray-700'
                    }`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Message ${selectedDmUser}...`}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Action Area */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Navigation Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveSection('requirements')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeSection === 'requirements' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Requirements
            </button>
            <button
              onClick={() => setActiveSection('impact')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeSection === 'impact' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Impact Log
            </button>
            <button
              onClick={() => setActiveSection('uat')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeSection === 'uat' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              UAT Feedback
            </button>
            <button
              onClick={() => setActiveSection('spec')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeSection === 'spec' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Room Spec
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeSection === 'requirements' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Room Requirements</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    + Add Requirement
                  </button>
                </div>
                {roomData.requirements?.map((req: any) => (
                  <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        req.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{req.title}</p>
                        <p className="text-sm text-gray-600">Priority: {req.priority}</p>
                      </div>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'impact' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Impact Log</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">+125</p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">+450</p>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">1,250</p>
                    <p className="text-sm text-gray-600">Total Impact</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                    <span className="text-sm">Completed innovation sprint</span>
                    <span className="text-sm font-medium text-green-600">+50</span>
                  </div>
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                    <span className="text-sm">Onboarded 5 new members</span>
                    <span className="text-sm font-medium text-green-600">+25</span>
                  </div>
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                    <span className="text-sm">Published project documentation</span>
                    <span className="text-sm font-medium text-green-600">+30</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'uat' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">UAT Feedback & Development</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    This section tracks user acceptance testing feedback and ongoing development items.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Improve onboarding flow</p>
                        <p className="text-sm text-gray-600 mt-1">Users finding initial setup confusing</p>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">In Progress</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Add export functionality</p>
                        <p className="text-sm text-gray-600 mt-1">Requested by 8 users</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Planned</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'spec' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Room Specification</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${completeness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{completeness}%</span>
                    </div>
                    {completeness < 100 && (
                      <button
                        onClick={handleEnhanceRoom}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Complete Spec
                      </button>
                    )}
                  </div>
                </div>
                
                {completeness < 100 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Benefits of Completing Your Spec:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Unlock predictive analytics and AI insights</li>
                      <li>• Access advanced automation features</li>
                      <li>• Enable comprehensive reporting</li>
                      <li>• Get personalized growth recommendations</li>
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="mt-1">{roomData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="mt-1">{roomData.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Purpose</p>
                    <p className="mt-1">{roomData.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Members</p>
                    <p className="mt-1">{roomData.estimatedMembers}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    View Full Specification →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
