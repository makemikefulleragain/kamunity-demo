"use client";

import React, { useState, useEffect } from 'react';
import { Download, Eye, Calendar, Mail, Activity } from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import { DemoSurveyData, DemoUserTrackingData } from '@/lib/admin/database';
import { downloadCSV, generateSurveysCSV, generateUserTrackingCSV, generateCombinedCSV } from '@/lib/admin/csv-export';

export default function AdminUATPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [surveys, setSurveys] = useState<DemoSurveyData[]>([]);
  const [tracking, setTracking] = useState<DemoUserTrackingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<DemoSurveyData | null>(null);
  const [selectedTracking, setSelectedTracking] = useState<DemoUserTrackingData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [surveysRes, trackingRes] = await Promise.all([
        fetch('/api/admin/surveys', {
          headers: { 'Authorization': `Bearer ${process.env.ADMIN_PASSWORD}` }
        }),
        fetch('/api/admin/tracking', {
          headers: { 'Authorization': `Bearer ${process.env.ADMIN_PASSWORD}` }
        })
      ]);

      if (surveysRes.ok) {
        const surveysData = await surveysRes.json();
        setSurveys(surveysData.surveys);
      }

      if (trackingRes.ok) {
        const trackingData = await trackingRes.json();
        setTracking(trackingData.tracking);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAll = () => {
    const csv = generateCombinedCSV({ rooms: [], surveys, tracking });
    downloadCSV(csv, `kamunity-uat-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportSurveys = () => {
    const csv = generateSurveysCSV(surveys);
    downloadCSV(csv, `kamunity-surveys-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportTracking = () => {
    const csv = generateUserTrackingCSV(tracking);
    downloadCSV(csv, `kamunity-tracking-${new Date().toISOString().split('T')[0]}.csv`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UAT Feedback & Analytics</h1>
              <p className="text-gray-600 mt-2">User feedback, surveys, and activity tracking</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportAll}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export All
              </button>
              <button
                onClick={fetchData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-emerald-600">{surveys.length}</div>
            <div className="text-gray-600">Survey Responses</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">{tracking.length}</div>
            <div className="text-gray-600">User Sessions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-purple-600">
              {new Set([...surveys.map(s => s.userEmail), ...tracking.map(t => t.userEmail)].filter(Boolean)).size}
            </div>
            <div className="text-gray-600">Unique Users</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-orange-600">
              {tracking.reduce((sum, t) => sum + (t.actions?.length || 0), 0)}
            </div>
            <div className="text-gray-600">Total Actions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Survey Responses */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Survey Responses</h2>
              <button
                onClick={exportSurveys}
                className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {surveys.map((survey) => (
                <div key={survey.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{survey.userEmail || 'Anonymous'}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Experience: {survey.responses?.experience || 'N/A'}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(survey.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSurvey(survey)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Tracking */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">User Activity</h2>
              <button
                onClick={exportTracking}
                className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {tracking.map((track) => (
                <div key={track.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{track.userEmail || 'Anonymous'}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {track.actions?.length || 0} actions tracked
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(track.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTracking(track)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Survey Detail Modal */}
        {selectedSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Survey Response Details</h3>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Email:</strong> {selectedSurvey.userEmail || 'Anonymous'}</div>
                    <div><strong>Session:</strong> {selectedSurvey.sessionId}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Survey Responses</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedSurvey.responses || {}).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</strong> {value as string}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedSurvey.analytics && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Analytics Data</h4>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(selectedSurvey.analytics, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Tracking Detail Modal */}
        {selectedTracking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">User Activity Details</h3>
                <button
                  onClick={() => setSelectedTracking(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div><strong>Email:</strong> {selectedTracking.userEmail || 'Anonymous'}</div>
                    <div><strong>Session:</strong> {selectedTracking.sessionId}</div>
                    <div><strong>Actions:</strong> {selectedTracking.actions?.length || 0}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">User Actions Timeline</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {(selectedTracking.actions || []).map((action: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-500">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-sm">{action.type}</div>
                              <div className="text-gray-600 text-xs">{action.target}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(action.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          {action.metadata && (
                            <div className="mt-2 text-xs text-gray-500">
                              {JSON.stringify(action.metadata)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
