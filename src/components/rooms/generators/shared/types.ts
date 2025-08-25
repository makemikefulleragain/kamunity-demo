// Shared types for the unified room generator system

export type GeneratorTier = 'fast' | 'balanced' | 'comprehensive';

export interface RoomConcept {
  id: string;
  name: string;
  purpose: string;
  description: string;
  category: string;
  estimatedMembers: string;
  timeCommitment: string;
  skillsNeeded: string[];
  expectedOutcomes: string[];
  tools: string[];
  tags: string[];
  privacy?: 'Public' | 'Private';
  members?: string[];
}

export interface SpecSection {
  id: string;
  title: string;
  content: string;
  completeness: number;
  required: boolean;
  order: number;
}

export interface DemoConfig {
  theme: string;
  mockMembers: number;
  activityLevel: 'low' | 'medium' | 'high';
  contentSeeds: string[];
  features: string[];
}

export interface AdaptiveQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'textarea';
  options?: string[];
  section: string;
  priority: number;
  dependsOn?: string;
}

export interface UnifiedRoomData extends RoomConcept {
  title?: string;
  targetAudience?: string;
  milestones?: string[];
  requirements?: string[];
  memberLimit?: number;
  impactMetrics?: Array<{ label: string; value: string; trend: string }>;
  generatorType?: string;
  completeness: number;
  specSections: SpecSection[];
  demoRoomConfig: DemoConfig;
  questions: AdaptiveQuestion[];
  tier: GeneratorTier;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratorProps {
  onComplete: (data: UnifiedRoomData) => void;
  onCancel: () => void;
  initialData?: Partial<UnifiedRoomData>;
  triggerSource?: 'homepage' | 'rooms' | 'welcome' | 'manual';
}

export interface SpecSheetData {
  roomData: UnifiedRoomData;
  executiveSummary: string;
  roiAnalysis?: {
    weekly: number;
    monthly: number;
    yearly: number;
    hoursSaved: number;
    memberCount: number;
  };
  dayInTheLife?: string;
  implementationRoadmap?: {
    phase: string;
    tasks: string[];
    timeline: string;
  }[];
  governanceModel?: string;
  growthStrategy?: string;
  riskAssessment?: {
    risk: string;
    mitigation: string;
  }[];
  mvpFeatures?: string[];
  proFeatures?: string[];
  fullFeatures?: string[];
}

export interface QuestionEngineConfig {
  roomData: Partial<UnifiedRoomData>;
  maxQuestions: number;
  priorityThreshold: number;
}

export const ROOM_CATEGORIES = [
  'Community Building',
  'Environmental Action',
  'Social Justice',
  'Education & Learning',
  'Health & Wellness',
  'Technology & Innovation',
  'Arts & Culture',
  'Economic Development',
  'Local Government',
  'Crisis Response'
];

export const INTEREST_OPTIONS = [
  'Environmental Action',
  'Local Politics',
  'Community Gardens',
  'Youth Programs',
  'Senior Support',
  'Arts & Culture',
  'Small Business',
  'Education Reform',
  'Public Health',
  'Transportation',
  'Housing',
  'Technology Ethics',
  'Social Justice',
  'Mental Health',
  'Food Security',
  'Climate Action'
];

export const COMMUNITY_TYPES = [
  { id: 'discussion', label: 'Discussion & Debate', icon: '💬', description: 'Share ideas and perspectives' },
  { id: 'action', label: 'Action & Organizing', icon: '🚀', description: 'Plan and execute community initiatives' },
  { id: 'support', label: 'Support & Mutual Aid', icon: '🤝', description: 'Help and support community members' },
  { id: 'learning', label: 'Learning & Education', icon: '📚', description: 'Share knowledge and skills' },
  { id: 'creative', label: 'Creative & Cultural', icon: '🎨', description: 'Express creativity and culture' }
];
