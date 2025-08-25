// Utility functions for the unified room generator system

import { UnifiedRoomData, SpecSection, AdaptiveQuestion, RoomConcept } from './types';

export function calculateCompleteness(data: Partial<UnifiedRoomData>): number {
  const requiredFields = ['name', 'purpose', 'category'];
  const optionalFields = ['description', 'estimatedMembers', 'timeCommitment', 'skillsNeeded', 'expectedOutcomes', 'tools', 'tags', 'privacy'];
  
  let filledRequired = 0;
  let filledOptional = 0;
  
  // Check required fields (worth 60% of total)
  requiredFields.forEach(field => {
    const value = data[field as keyof UnifiedRoomData];
    if (value && value !== '') {
      filledRequired++;
    }
  });
  
  // Check optional fields (worth 40% of total)
  optionalFields.forEach(field => {
    const value = data[field as keyof UnifiedRoomData];
    if (value) {
      if (Array.isArray(value)) {
        if (value.length > 0) filledOptional++;
      } else if (value !== '') {
        filledOptional++;
      }
    }
  });
  
  // Calculate weighted completeness
  const requiredScore = (filledRequired / requiredFields.length) * 60;
  const optionalScore = (filledOptional / optionalFields.length) * 40;
  
  return Math.min(100, Math.round(requiredScore + optionalScore));
}

export function generateSpecSections(data: Partial<UnifiedRoomData>): SpecSection[] {
  const sections: SpecSection[] = [
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      content: generateExecutiveSummary(data),
      completeness: data.name && data.purpose ? 100 : 0,
      required: true,
      order: 1
    },
    {
      id: 'purpose-vision',
      title: 'Purpose & Vision',
      content: data.purpose || '',
      completeness: data.purpose ? 100 : 0,
      required: true,
      order: 2
    },
    {
      id: 'target-audience',
      title: 'Target Audience',
      content: data.description || '',
      completeness: data.description ? 100 : 0,
      required: true,
      order: 3
    },
    {
      id: 'features',
      title: 'Key Features',
      content: formatFeatures(data),
      completeness: data.tools && data.tools.length > 0 ? 100 : 50,
      required: true,
      order: 4
    },
    {
      id: 'roi-analysis',
      title: 'ROI Analysis',
      content: '',
      completeness: 0,
      required: false,
      order: 5
    },
    {
      id: 'implementation',
      title: 'Implementation Roadmap',
      content: '',
      completeness: 0,
      required: false,
      order: 6
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      content: formatOutcomes(data),
      completeness: data.expectedOutcomes && data.expectedOutcomes.length > 0 ? 100 : 0,
      required: false,
      order: 7
    }
  ];
  
  return sections;
}

export function generateAdaptiveQuestions(data: Partial<UnifiedRoomData>): AdaptiveQuestion[] {
  const questions: AdaptiveQuestion[] = [];
  
  // Priority 1: Missing required fields
  if (!data.name) {
    questions.push({
      id: 'q-name',
      question: 'What would you like to name your room?',
      type: 'text',
      section: 'executive-summary',
      priority: 1
    });
  }
  
  if (!data.purpose) {
    questions.push({
      id: 'q-purpose',
      question: 'What is the main purpose of this room?',
      type: 'textarea',
      section: 'purpose-vision',
      priority: 1
    });
  }
  
  if (!data.category) {
    questions.push({
      id: 'q-category',
      question: 'Which category best describes your room?',
      type: 'select',
      options: ['Community Building', 'Environmental Action', 'Social Justice', 'Education & Learning', 'Health & Wellness'],
      section: 'executive-summary',
      priority: 1
    });
  }
  
  // Priority 2: Enhance spec quality
  if (!data.estimatedMembers) {
    questions.push({
      id: 'q-members',
      question: 'How many members do you expect to join?',
      type: 'select',
      options: ['1-10', '10-50', '50-100', '100-500', '500+'],
      section: 'target-audience',
      priority: 2
    });
  }
  
  if (!data.timeCommitment) {
    questions.push({
      id: 'q-time',
      question: 'What time commitment do you expect from members?',
      type: 'select',
      options: ['Daily (30 min/day)', 'Weekly (2-3 hours/week)', 'Monthly (5-10 hours/month)', 'Flexible'],
      section: 'implementation',
      priority: 2
    });
  }
  
  // Priority 3: Advanced features
  if (!data.expectedOutcomes || data.expectedOutcomes.length === 0) {
    questions.push({
      id: 'q-outcomes',
      question: 'What are your top 3 success metrics?',
      type: 'multiselect',
      options: ['Member engagement', 'Content creation', 'Project completion', 'Community growth', 'Knowledge sharing', 'Problem solving'],
      section: 'success-metrics',
      priority: 3
    });
  }
  
  return questions.sort((a, b) => a.priority - b.priority);
}

function generateExecutiveSummary(data: Partial<UnifiedRoomData>): string {
  if (!data.name || !data.purpose) return '';
  
  return `${data.name} is a ${data.category || 'community'} room designed to ${data.purpose}. ${
    data.estimatedMembers ? `We expect to engage ${data.estimatedMembers} members` : ''
  } ${data.timeCommitment ? `with a ${data.timeCommitment} commitment` : ''}.`;
}

function formatFeatures(data: Partial<UnifiedRoomData>): string {
  const features = [];
  
  if (data.tools && data.tools.length > 0) {
    features.push(`Tools: ${data.tools.join(', ')}`);
  }
  
  if (data.skillsNeeded && data.skillsNeeded.length > 0) {
    features.push(`Skills: ${data.skillsNeeded.join(', ')}`);
  }
  
  if (data.privacy) {
    features.push(`Privacy: ${data.privacy}`);
  }
  
  return features.join('\n');
}

function formatOutcomes(data: Partial<UnifiedRoomData>): string {
  if (!data.expectedOutcomes || data.expectedOutcomes.length === 0) return '';
  
  return data.expectedOutcomes.map((outcome, index) => `${index + 1}. ${outcome}`).join('\n');
}

export function generateDemoConfig(data: Partial<UnifiedRoomData>): any {
  const memberCount = data.estimatedMembers?.includes('500') ? 500 :
                     data.estimatedMembers?.includes('100') ? 100 :
                     data.estimatedMembers?.includes('50') ? 50 : 10;
  
  return {
    theme: data.category?.toLowerCase().replace(/\s+/g, '-') || 'default',
    mockMembers: memberCount,
    activityLevel: memberCount > 100 ? 'high' : memberCount > 50 ? 'medium' : 'low',
    contentSeeds: generateContentSeeds(data),
    features: data.tools || []
  };
}

function generateContentSeeds(data: Partial<UnifiedRoomData>): string[] {
  const seeds = [];
  
  if (data.category?.includes('Environmental')) {
    seeds.push('climate-action', 'sustainability', 'green-energy');
  } else if (data.category?.includes('Social')) {
    seeds.push('equity', 'justice', 'community-support');
  } else if (data.category?.includes('Education')) {
    seeds.push('learning', 'skills', 'knowledge-sharing');
  } else {
    seeds.push('community', 'collaboration', 'engagement');
  }
  
  return seeds;
}

export function generateRoomId(): string {
  return `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function validateRoomData(data: Partial<UnifiedRoomData>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 3) {
    errors.push('Room name must be at least 3 characters');
  }
  
  if (!data.purpose || data.purpose.trim().length < 10) {
    errors.push('Purpose must be at least 10 characters');
  }
  
  if (!data.category) {
    errors.push('Please select a category');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
