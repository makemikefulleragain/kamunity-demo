'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Download, 
  Mail, 
  Calendar, 
  User, 
  Database,
  Activity,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface RoomSpecification {
  id: string;
  title: string;
  description: string;
  category: string;
  engagement: number;
  tags: string[];
  userEmail: string;
  sessionId: string;
  timestamp: string;
  source: 'generator' | 'saved';
  fullSpecification: Record<string, unknown>;
  analytics?: {
    timeSpent: string;
    interactions: number;
    interestLevel: string;
  };
}

interface UserActivity {
  id: string;
  sessionId: string;
  userEmail?: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  page: string;
}

export default function AdminSpecsPage() {
  const [roomSpecs, setRoomSpecs] = useState<RoomSpecification[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'specs' | 'activities'>('specs');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load room specifications
      const specsResponse = await fetch('/api/admin/room-specs');
      if (specsResponse.ok) {
        const specs = await specsResponse.json();
        setRoomSpecs(specs.data || []);
      }

      // Load user activities
      const activitiesResponse = await fetch('/api/admin/user-activities');
      if (activitiesResponse.ok) {
        const activities = await activitiesResponse.json();
        setUserActivities(activities.data || []);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpecs = roomSpecs.filter(spec => {
    const matchesSearch = spec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spec.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || spec.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const exportSpecification = (spec: RoomSpecification) => {
    const dataStr = JSON.stringify(spec, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `room-spec-${spec.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const resendEmail = async (spec: RoomSpecification) => {
    try {
      const response = await fetch('/api/admin/resend-spec-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specId: spec.id })
      });
      
      if (response.ok) {
        alert('Email resent successfully!');
      } else {
        alert('Failed to resend email');
      }
    } catch (error) {
      alert('Error resending email');
    }
  };

  const categories = Array.from(new Set(roomSpecs.map(spec => spec.category))).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading admin data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Room specifications and user activity tracking</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Specs</p>
                  <p className="text-2xl font-bold text-gray-900">{roomSpecs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">User Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{userActivities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(roomSpecs.map(s => s.userEmail)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {roomSpecs.filter(s => 
                      new Date(s.timestamp).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'specs' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Room Specifications
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'activities' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            User Activities
          </button>
        </div>

        {activeTab === 'specs' && (
          <>
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search specifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <Button onClick={loadData} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Specifications */}
            <div className="grid gap-6">
              {filteredSpecs.map((spec) => (
                <Card key={spec.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{spec.title}</CardTitle>
                        <p className="text-gray-600 mb-3">{spec.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{spec.category}</Badge>
                          <Badge variant="outline">{spec.engagement}% engagement</Badge>
                          <Badge variant={spec.source === 'generator' ? 'default' : 'secondary'}>
                            {spec.source === 'generator' ? 'Generated' : 'Saved'}
                          </Badge>
                          {spec.tags.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => exportSpecification(spec)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button
                          onClick={() => resendEmail(spec)}
                          variant="outline"
                          size="sm"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Resend
                        </Button>
                        <Button
                          onClick={() => window.open(`https://kamunitydemo.org/rooms/${spec.id}`, '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>User:</strong> {spec.userEmail}</p>
                        <p><strong>Session:</strong> {spec.sessionId}</p>
                        <p><strong>Created:</strong> {new Date(spec.timestamp).toLocaleString()}</p>
                      </div>
                      {spec.analytics && (
                        <div>
                          <p><strong>Time Spent:</strong> {spec.analytics.timeSpent}</p>
                          <p><strong>Interactions:</strong> {spec.analytics.interactions}</p>
                          <p><strong>Interest Level:</strong> {spec.analytics.interestLevel}</p>
                        </div>
                      )}
                    </div>
                    
                    <details className="mt-4">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                        View Full Specification
                      </summary>
                      <pre className="mt-2 p-4 bg-gray-100 rounded-md text-xs overflow-auto max-h-64">
                        {JSON.stringify(spec.fullSpecification, null, 2)}
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              ))}
              
              {filteredSpecs.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No specifications found</h3>
                    <p className="text-gray-600">No room specifications match your current filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {activeTab === 'activities' && (
          <Card>
            <CardHeader>
              <CardTitle>User Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.eventType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{activity.page}</p>
                      {activity.userEmail && (
                        <p className="text-xs text-gray-500">{activity.userEmail}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {userActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                    <p className="text-gray-600">User activities will appear here as they interact with the demo.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
