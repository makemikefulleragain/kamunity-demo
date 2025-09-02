"use client";

import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface RoomSpecModalProps {
  room: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomSpecModal({ room, isOpen, onClose }: RoomSpecModalProps) {
  if (!isOpen || !room) return null;

  const formatDetailedSpec = (detailedSpec: any) => {
    if (!detailedSpec) return null;

    return (
      <div className="space-y-6">
        {/* Pitch & Call to Action */}
        {detailedSpec.pitchSection && (
          <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
            <h4 className="font-semibold text-emerald-800 mb-2">🎯 Pitch & Call to Action</h4>
            <p className="text-emerald-700 mb-2">{detailedSpec.pitchSection.hook}</p>
            <p className="text-emerald-700 font-medium">{detailedSpec.pitchSection.cta}</p>
          </div>
        )}

        {/* ROI Story */}
        {detailedSpec.roiStory && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800 mb-2">💰 Community Space ROI</h4>
            <p className="text-blue-700">{detailedSpec.roiStory}</p>
          </div>
        )}

        {/* Savings Table */}
        {detailedSpec.savingsTable && (
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-semibold text-yellow-800 mb-3">⏰ Time & Cost Savings</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-yellow-800">Before</div>
                <div className="text-yellow-700">{detailedSpec.savingsTable.before?.weeklyHours || '8 hours'}</div>
                <div className="text-yellow-700">{detailedSpec.savingsTable.before?.monthlyTools || '$200'}</div>
              </div>
              <div>
                <div className="font-medium text-yellow-800">After</div>
                <div className="text-yellow-700">{detailedSpec.savingsTable.after?.weeklyHours || '3 hours'}</div>
                <div className="text-yellow-700">{detailedSpec.savingsTable.after?.monthlyTools || '$50'}</div>
              </div>
              <div>
                <div className="font-medium text-yellow-800">Savings</div>
                <div className="text-yellow-700 font-semibold">{detailedSpec.savingsTable.savings?.timeWeekly || '5 hours'}</div>
                <div className="text-yellow-700 font-semibold">{detailedSpec.savingsTable.savings?.costMonthly || '$150'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Wireframe */}
        {detailedSpec.wireframe && (
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-800 mb-2">🏠 Homepage Wireframe</h4>
            <p className="text-purple-700">{detailedSpec.wireframe.description}</p>
          </div>
        )}

        {/* User Flow */}
        {detailedSpec.userFlow && detailedSpec.userFlow.length > 0 && (
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-semibold text-indigo-800 mb-3">📋 User Flow</h4>
            <ol className="list-decimal list-inside space-y-1">
              {detailedSpec.userFlow.map((step: string, index: number) => (
                <li key={index} className="text-indigo-700">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Design Questions */}
        {detailedSpec.designQuestions && detailedSpec.designQuestions.length > 0 && (
          <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
            <h4 className="font-semibold text-pink-800 mb-3">❓ Design Questions</h4>
            <ul className="list-disc list-inside space-y-1">
              {detailedSpec.designQuestions.map((question: string, index: number) => (
                <li key={index} className="text-pink-700">{question}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Feature Matrix */}
        {detailedSpec.featureMatrix && (
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
            <h4 className="font-semibold text-teal-800 mb-3">📊 Feature Matrix</h4>
            <div className="space-y-2">
              {detailedSpec.featureMatrix.mvp && (
                <div><span className="font-medium text-teal-800">MVP:</span> <span className="text-teal-700">{detailedSpec.featureMatrix.mvp.join(', ')}</span></div>
              )}
              {detailedSpec.featureMatrix.pro && (
                <div><span className="font-medium text-teal-800">Pro:</span> <span className="text-teal-700">{detailedSpec.featureMatrix.pro.join(', ')}</span></div>
              )}
              {detailedSpec.featureMatrix.full && (
                <div><span className="font-medium text-teal-800">Full:</span> <span className="text-teal-700">{detailedSpec.featureMatrix.full.join(', ')}</span></div>
              )}
            </div>
          </div>
        )}

        {/* Additional Suggestions */}
        {detailedSpec.suggestions && (
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
            <h4 className="font-semibold text-gray-800 mb-3">💡 Additional Suggestions</h4>
            <div className="space-y-1 text-sm">
              {detailedSpec.suggestions.metrics && (
                <div><span className="font-medium text-gray-800">Metrics:</span> <span className="text-gray-700">{detailedSpec.suggestions.metrics.join(', ')}</span></div>
              )}
              {detailedSpec.suggestions.pilot && (
                <div><span className="font-medium text-gray-800">Pilot:</span> <span className="text-gray-700">{detailedSpec.suggestions.pilot}</span></div>
              )}
              {detailedSpec.suggestions.nextSteps && (
                <div><span className="font-medium text-gray-800">Next Steps:</span> <span className="text-gray-700">{detailedSpec.suggestions.nextSteps.join(', ')}</span></div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{room.title}</h2>
            <p className="text-gray-600 mt-1">Complete Room Specification</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Room Info */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-lg mb-6 border border-emerald-200">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">📋 Room Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-emerald-800">Purpose:</span> <span className="text-emerald-700">{room.description || room.purpose}</span></div>
              <div><span className="font-medium text-emerald-800">Category:</span> <span className="text-emerald-700">{room.category || 'General'}</span></div>
              <div><span className="font-medium text-emerald-800">Engagement:</span> <span className="text-emerald-700">{room.engagement || 0}%</span></div>
              <div><span className="font-medium text-emerald-800">Created:</span> <span className="text-emerald-700">{new Date(room.createdAt || Date.now()).toLocaleDateString()}</span></div>
            </div>
            {room.tags && room.tags.length > 0 && (
              <div className="mt-3">
                <span className="font-medium text-emerald-800">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {room.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Specification */}
          {room.roomData && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔧 Complete Implementation Specification</h3>
              {formatDetailedSpec(room.roomData)}
            </div>
          )}

          {/* Room Link */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-800">🔗 Access This Room</h4>
                <p className="text-blue-600 text-sm">View and interact with this room in the demo</p>
              </div>
              <a
                href={`/rooms/${room.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Room
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
