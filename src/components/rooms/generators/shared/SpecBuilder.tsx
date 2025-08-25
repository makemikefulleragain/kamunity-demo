'use client';

import React from 'react';
import { FileText, Download, TrendingUp, Calendar, Users, Target, Shield, Zap } from 'lucide-react';
import { UnifiedRoomData, SpecSheetData } from '../shared/types';

interface SpecBuilderProps {
  roomData: UnifiedRoomData;
  onClose: () => void;
  onEnhance?: () => void;
}

export default function SpecBuilder({ roomData, onClose, onEnhance }: SpecBuilderProps) {
  const specData = generateSpecSheetData(roomData);
  
  const handleDownloadPDF = () => {
    // In production, this would generate and download a PDF
    console.log('Downloading PDF spec sheet...');
    alert('PDF download feature will be implemented with a PDF library');
  };

  const handleEmailSpec = () => {
    // In production, this would email the spec
    console.log('Emailing spec sheet...');
    alert('Email feature will be implemented with email service');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Room Specification Sheet</h2>
                <p className="text-indigo-100">{roomData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Completeness Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Spec Completeness</span>
              <span className="text-sm text-gray-600">{roomData.completeness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${roomData.completeness}%` }}
              />
            </div>
            {roomData.completeness < 100 && onEnhance && (
              <button
                onClick={onEnhance}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                Complete missing sections →
              </button>
            )}
          </div>

          {/* Executive Summary */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Executive Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{specData.executiveSummary}</p>
            </div>
          </section>

          {/* Room Details */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Room Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-semibold text-gray-800">{roomData.category}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Expected Members</p>
                <p className="font-semibold text-gray-800">{roomData.estimatedMembers}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Time Commitment</p>
                <p className="font-semibold text-gray-800">{roomData.timeCommitment}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Privacy Setting</p>
                <p className="font-semibold text-gray-800">{roomData.privacy}</p>
              </div>
            </div>
          </section>

          {/* ROI Analysis */}
          {specData.roiAnalysis && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                ROI Analysis
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Weekly Value</p>
                    <p className="text-2xl font-bold text-green-700">${specData.roiAnalysis.weekly}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Value</p>
                    <p className="text-2xl font-bold text-green-700">${specData.roiAnalysis.monthly}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Yearly Value</p>
                    <p className="text-2xl font-bold text-green-700">${specData.roiAnalysis.yearly}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-700">
                    <strong>Time Saved:</strong> {specData.roiAnalysis.hoursSaved} hours/month
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Impact:</strong> {specData.roiAnalysis.memberCount} members benefiting
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Day in the Life */}
          {specData.dayInTheLife && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                A Day in the Life
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed italic">{specData.dayInTheLife}</p>
              </div>
            </section>
          )}

          {/* Features & Tools */}
          {roomData.tools && roomData.tools.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Features & Tools
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {roomData.tools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="text-gray-700">{tool}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Success Metrics */}
          {roomData.expectedOutcomes && roomData.expectedOutcomes.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Success Metrics
              </h3>
              <div className="space-y-3">
                {roomData.expectedOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                    <span className="text-indigo-600 font-bold">{index + 1}.</span>
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Implementation Roadmap */}
          {specData.implementationRoadmap && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Implementation Roadmap</h3>
              <div className="space-y-4">
                {specData.implementationRoadmap.map((phase, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold text-gray-800">{phase.phase}</h4>
                    <p className="text-sm text-gray-600 mb-2">{phase.timeline}</p>
                    <ul className="space-y-1">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-indigo-500 mt-1">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={handleEmailSpec}
              className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
            >
              Email Spec
            </button>
            {roomData.completeness < 100 && onEnhance && (
              <button
                onClick={onEnhance}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Enhance Spec ({100 - roomData.completeness}% remaining)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateSpecSheetData(roomData: UnifiedRoomData): SpecSheetData {
  const memberCount = parseInt(roomData.estimatedMembers?.split('-')[1] || '50');
  
  return {
    roomData,
    executiveSummary: `${roomData.name} is a ${roomData.category.toLowerCase()} initiative designed to ${roomData.purpose}. 
      This room will serve ${roomData.estimatedMembers} members with a ${roomData.timeCommitment.toLowerCase()} commitment. 
      By leveraging ${roomData.tools?.length || 0} key features and tools, we aim to achieve measurable outcomes in community engagement and impact.`,
    
    roiAnalysis: roomData.tier !== 'fast' ? {
      weekly: Math.round(memberCount * 2.5),
      monthly: Math.round(memberCount * 10),
      yearly: Math.round(memberCount * 120),
      hoursSaved: Math.round(memberCount * 0.5),
      memberCount
    } : undefined,
    
    dayInTheLife: roomData.tier !== 'fast' ? 
      `A typical day in ${roomData.name}: Members log in to find personalized AI-curated content relevant to their interests. 
      They engage in meaningful discussions, collaborate on projects, and track their progress toward shared goals. 
      The AI assistant helps facilitate connections, suggests resources, and celebrates milestones. 
      By the end of the day, members have made tangible progress on ${roomData.purpose}, 
      strengthened community bonds, and gained valuable insights from peer interactions.` : undefined,
    
    implementationRoadmap: roomData.tier === 'comprehensive' ? [
      {
        phase: 'Phase 1: Foundation (Weeks 1-2)',
        timeline: '2 weeks',
        tasks: [
          'Set up room infrastructure',
          'Configure privacy and permissions',
          'Invite founding members',
          'Establish community guidelines'
        ]
      },
      {
        phase: 'Phase 2: Growth (Weeks 3-8)',
        timeline: '6 weeks',
        tasks: [
          'Launch engagement campaigns',
          'Implement feature rollout',
          'Begin content creation',
          'Track initial metrics'
        ]
      },
      {
        phase: 'Phase 3: Scale (Weeks 9+)',
        timeline: 'Ongoing',
        tasks: [
          'Expand member base',
          'Optimize based on analytics',
          'Develop advanced features',
          'Establish partnerships'
        ]
      }
    ] : undefined
  };
}
