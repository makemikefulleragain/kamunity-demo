'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button,
  Text,
  Heading,
  Grid,
  Flex
} from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

// Unified interface for all room creation types
interface RoomConcept {
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

// Entry point types for different workflows
type EntryPoint = 'standalone' | 'chat-promotion' | 'simple-creation';

interface ChatContext {
  id: string;
  messageCount: number;
  participants: number;
  recentTopics: string[];
  keyMessages: string[];
}

interface UnifiedRoomGeneratorProps {
  entryPoint: EntryPoint;
  chatContext?: ChatContext;
  onRoomRequest: (concept: RoomConcept) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const ROOM_CATEGORIES = [
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

const SAMPLE_CONCEPTS: RoomConcept[] = [
  {
    id: 'community-garden',
    name: 'Community Garden Network',
    purpose: 'Coordinate local food production and sustainable gardening practices',
    description: 'A collaborative space for neighbors to plan, maintain, and harvest from shared garden spaces while building community connections.',
    category: 'Environmental Action',
    estimatedMembers: '15-30',
    timeCommitment: '3-5 hours/week',
    skillsNeeded: ['Gardening', 'Project Management', 'Community Outreach'],
    expectedOutcomes: ['Fresh local produce', 'Stronger neighborhood bonds', 'Environmental education'],
    tools: ['Garden Planning Board', 'Harvest Scheduler', 'Resource Exchange'],
    tags: ['gardening', 'sustainability', 'community', 'food-security']
  },
  {
    id: 'local-business-support',
    name: 'Local Business Alliance',
    purpose: 'Support and promote local businesses through community collaboration',
    description: 'Connect local business owners with community members to foster economic growth and strengthen the local economy.',
    category: 'Economic Development',
    estimatedMembers: '20-50',
    timeCommitment: '2-4 hours/week',
    skillsNeeded: ['Marketing', 'Event Planning', 'Networking'],
    expectedOutcomes: ['Increased local business revenue', 'Community economic resilience', 'Job creation'],
    tools: ['Business Directory', 'Event Coordinator', 'Promotion Tracker'],
    tags: ['business', 'economy', 'local', 'entrepreneurship']
  },
  {
    id: 'youth-mentorship',
    name: 'Youth Leadership Program',
    purpose: 'Connect young people with mentors and leadership opportunities',
    description: 'Develop the next generation of community leaders through structured mentorship and hands-on civic engagement.',
    category: 'Education & Learning',
    estimatedMembers: '10-25',
    timeCommitment: '4-6 hours/week',
    skillsNeeded: ['Mentoring', 'Youth Development', 'Program Coordination'],
    expectedOutcomes: ['Youth leadership skills', 'Civic engagement', 'Community continuity'],
    tools: ['Mentorship Matcher', 'Project Tracker', 'Skill Development Hub'],
    tags: ['youth', 'mentorship', 'leadership', 'education']
  }
];

const UnifiedRoomGenerator: React.FC<UnifiedRoomGeneratorProps> = ({ 
  entryPoint, 
  chatContext, 
  onRoomRequest, 
  onClose,
  isModal = false 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customIdea, setCustomIdea] = useState<string>('');
  const [selectedConcept, setSelectedConcept] = useState<RoomConcept | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSpecSheet, setShowSpecSheet] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Simple creation form data
  const [simpleFormData, setSimpleFormData] = useState({
    purpose: '',
    why: '',
    members: '',
    privacy: 'Public' as 'Public' | 'Private'
  });

  // Initialize based on entry point
  useEffect(() => {
    if (entryPoint === 'chat-promotion' && chatContext) {
      // Pre-populate based on chat context
      const suggestedName = `${chatContext.recentTopics[0] || 'Chat'} Focus Room`;
      setCustomIdea(suggestedName);
      
      // Auto-select appropriate category based on topics
      const topicKeywords = chatContext.recentTopics.join(' ').toLowerCase();
      if (topicKeywords.includes('environment') || topicKeywords.includes('garden')) {
        setSelectedCategory('Environmental Action');
      } else if (topicKeywords.includes('business') || topicKeywords.includes('economic')) {
        setSelectedCategory('Economic Development');
      } else if (topicKeywords.includes('education') || topicKeywords.includes('learning')) {
        setSelectedCategory('Education & Learning');
      } else {
        setSelectedCategory('Community Building');
      }
    }
  }, [entryPoint, chatContext]);

  const filteredConcepts = selectedCategory 
    ? SAMPLE_CONCEPTS.filter(concept => concept.category === selectedCategory)
    : SAMPLE_CONCEPTS;

  const handleGenerateCustom = () => {
    if (!customIdea.trim()) return;
    
    // Enhanced concept generation based on entry point
    const customConcept: RoomConcept = {
      id: `custom-${Date.now()}`,
      name: customIdea,
      purpose: entryPoint === 'chat-promotion' && chatContext
        ? `Continue and expand the discussion from chat: ${chatContext.recentTopics.join(', ')}`
        : `Collaborate on ${customIdea.toLowerCase()} initiatives`,
      description: entryPoint === 'chat-promotion' && chatContext
        ? `Building on ${chatContext.messageCount} messages and ${chatContext.participants} participants, this room will provide structured space for deeper collaboration.`
        : `A dedicated space for community members to work together on ${customIdea.toLowerCase()}, share resources, and coordinate actions.`,
      category: selectedCategory || 'Community Building',
      estimatedMembers: entryPoint === 'chat-promotion' && chatContext
        ? `${chatContext.participants}-${Math.max(chatContext.participants * 2, 20)}`
        : '5-15',
      timeCommitment: '2-4 hours/week',
      skillsNeeded: ['Collaboration', 'Communication', 'Initiative'],
      expectedOutcomes: ['Community engagement', 'Shared learning', 'Collective action'],
      tools: ['Discussion Board', 'Resource Sharing', 'Action Tracker'],
      tags: [customIdea.toLowerCase().replace(/\s+/g, '-'), 'community', 'collaboration'],
      privacy: entryPoint === 'simple-creation' ? simpleFormData.privacy : 'Public'
    };

    setSelectedConcept(customConcept);
    setShowPreview(true);
  };

  const handleSimpleFormSubmit = () => {
    if (!simpleFormData.purpose.trim()) return;
    
    const simpleConcept: RoomConcept = {
      id: `simple-${Date.now()}`,
      name: simpleFormData.purpose,
      purpose: simpleFormData.purpose,
      description: simpleFormData.why || `A community space focused on ${simpleFormData.purpose.toLowerCase()}.`,
      category: 'Community Building',
      estimatedMembers: '5-15',
      timeCommitment: '2-4 hours/week',
      skillsNeeded: ['Collaboration', 'Communication'],
      expectedOutcomes: ['Community engagement', 'Shared goals'],
      tools: ['Discussion Board', 'Member Directory'],
      tags: [simpleFormData.purpose.toLowerCase().replace(/\s+/g, '-')],
      privacy: simpleFormData.privacy,
      members: simpleFormData.members ? simpleFormData.members.split(',').map(m => m.trim()) : []
    };

    onRoomRequest(simpleConcept);
  };

  const handlePreviewConcept = (concept: RoomConcept) => {
    setSelectedConcept(concept);
    setShowPreview(true);
  };

  const handleViewSpecSheet = () => {
    setShowSpecSheet(true);
  };

  const handleRequestRoom = () => {
    if (selectedConcept) {
      onRoomRequest(selectedConcept);
    }
  };

  // Simple creation workflow (3-step modal)
  if (entryPoint === 'simple-creation') {
    return (
      <div className={`${isModal ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' : ''}`}>
        <div className={`${isModal ? 'bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto' : 'max-w-2xl mx-auto'} p-6 relative`}>
          <Heading level={2} className="text-2xl font-bold mb-6 text-center">
            Create Your Focus Room
          </Heading>

          {/* Step 1: Purpose */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <Heading level={3} className="text-xl font-semibold text-primary-700">Step 1: Purpose</Heading>
                  <Text className="text-sm text-gray-600">What do you want to achieve together?</Text>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="purpose" className="block text-sm font-medium mb-1">Room Purpose</label>
                <Input
                  value={simpleFormData.purpose}
                  onChange={(e) => setSimpleFormData({...simpleFormData, purpose: e.target.value})}
                  placeholder="e.g., Organize neighborhood cleanup, Start a book club..."
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="why" className="block text-sm font-medium mb-1">Why is this important? (Optional)</label>
                <textarea
                  value={simpleFormData.why}
                  onChange={(e) => setSimpleFormData({...simpleFormData, why: e.target.value})}
                  placeholder="Share your motivation and vision..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Members */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <div>
                  <Heading level={3} className="text-xl font-semibold text-secondary-700">Step 2: Members</Heading>
                  <Text className="text-sm text-gray-600">Who would you like to invite?</Text>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="members" className="block text-sm font-medium mb-1">Invite Members (Optional)</label>
                <Input
                  value={simpleFormData.members}
                  onChange={(e) => setSimpleFormData({...simpleFormData, members: e.target.value})}
                  placeholder="Enter names or emails, separated by commas"
                  className="w-full"
                />
                <Text className="text-xs text-gray-500 mt-1">You can always invite more people later.</Text>
              </div>
            </div>
          )}

          {/* Step 3: Privacy */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <Heading level={3} className="text-xl font-semibold text-success-700">Step 3: Privacy</Heading>
                  <Text className="text-sm text-gray-600">Who can discover and join your room?</Text>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="privacy" className="block text-sm font-medium mb-1">Privacy Setting</label>
                <Select
                  value={simpleFormData.privacy}
                  onValueChange={(value) => setSimpleFormData({...simpleFormData, privacy: value as 'Public' | 'Private'})}
                >
                  <option value="Public">Public - Anyone can discover and join</option>
                  <option value="Private">Private - Invite-only</option>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </Button>
              )}
            </div>
            <div>
              {currentStep < 3 && (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && !simpleFormData.purpose.trim()}
                >
                  Next Step →
                </Button>
              )}
              {currentStep === 3 && (
                <Button
                  onClick={handleSimpleFormSubmit}
                  disabled={!simpleFormData.purpose.trim()}
                  className="bg-gradient-to-r from-success-500 to-success-600"
                >
                  🎉 Create Room
                </Button>
              )}
            </div>
          </div>

          {/* Close Button */}
          {isModal && onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Comprehensive generator workflow (for standalone and chat-promotion)
  if (showSpecSheet && selectedConcept) {
    return (
      <Container>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <Flex justify="between" align="center">
              <div>
                <CardTitle className="text-2xl">{selectedConcept.name}</CardTitle>
                <CardDescription>{selectedConcept.category}</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowSpecSheet(false)}>
                ← Back to Preview
              </Button>
            </Flex>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Detailed specification view */}
            <div>
              <Heading level={3} className="mb-2">Purpose & Description</Heading>
              <Text className="mb-2">{selectedConcept.purpose}</Text>
              <Text variant="body-small" color="muted">{selectedConcept.description}</Text>
            </div>

            <Grid cols={1} responsive={{ md: 2 }} gap="md">
              <div>
                <Heading level={4} className="mb-2">Community Details</Heading>
                <div className="space-y-2">
                  <Text variant="body-small"><strong>Estimated Members:</strong> {selectedConcept.estimatedMembers}</Text>
                  <Text variant="body-small"><strong>Time Commitment:</strong> {selectedConcept.timeCommitment}</Text>
                  {selectedConcept.privacy && (
                    <Text variant="body-small"><strong>Privacy:</strong> {selectedConcept.privacy}</Text>
                  )}
                </div>
              </div>

              <div>
                <Heading level={4} className="mb-2">Skills Needed</Heading>
                <Flex wrap gap="xs">
                  {selectedConcept.skillsNeeded.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </Flex>
              </div>
            </Grid>

            <div>
              <Heading level={4} className="mb-2">Expected Outcomes</Heading>
              <ul className="list-disc list-inside space-y-1">
                {selectedConcept.expectedOutcomes.map((outcome, index) => (
                  <li key={index}>
                    <Text variant="body-small">{outcome}</Text>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading level={4} className="mb-2">Tools & Features</Heading>
              <Flex wrap gap="xs">
                {selectedConcept.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary">{tool}</Badge>
                ))}
              </Flex>
            </div>

            {entryPoint === 'chat-promotion' && chatContext && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <Heading level={4} className="mb-2 text-blue-900">Chat Migration Details</Heading>
                <Text variant="body-small" className="text-blue-800">
                  This room will build on your existing chat with {chatContext.messageCount} messages 
                  and {chatContext.participants} participants. Key discussion topics: {chatContext.recentTopics.join(', ')}.
                </Text>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Flex gap="md" className="w-full">
              <Button variant="outline" onClick={() => setShowSpecSheet(false)} className="flex-1">
                ← Back to Preview
              </Button>
              <Button onClick={handleRequestRoom} className="flex-1">
                🚀 Request This Room
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  if (showPreview && selectedConcept) {
    return (
      <Container>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Flex justify="between" align="center">
              <div>
                <CardTitle className="text-xl">{selectedConcept.name}</CardTitle>
                <Badge variant="outline">{selectedConcept.category}</Badge>
              </div>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                ← Back
              </Button>
            </Flex>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Text className="font-medium">Purpose:</Text>
              <Text variant="body-small" color="muted">{selectedConcept.purpose}</Text>
            </div>
            <div>
              <Text className="font-medium">Description:</Text>
              <Text variant="body-small" color="muted">{selectedConcept.description}</Text>
            </div>
            <Grid cols={2} gap="md">
              <div>
                <Text variant="caption" color="muted">Members: {selectedConcept.estimatedMembers}</Text>
              </div>
              <div>
                <Text variant="caption" color="muted">Time: {selectedConcept.timeCommitment}</Text>
              </div>
            </Grid>
          </CardContent>
          <CardFooter>
            <Flex gap="md" className="w-full">
              <Button variant="outline" onClick={handleViewSpecSheet} className="flex-1">
                📋 View Full Spec
              </Button>
              <Button onClick={handleRequestRoom} className="flex-1">
                🚀 Request Room
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  // Main generator interface
  return (
    <Container>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <Heading level={1} className="text-3xl font-bold mb-2">
            {entryPoint === 'chat-promotion' ? 'Promote Chat to Focus Room' : 'Focus Room Generator'}
          </Heading>
          <Text color="muted">
            {entryPoint === 'chat-promotion' 
              ? 'Transform your active chat into a structured Focus Room for deeper collaboration'
              : 'Generate, preview, and request custom focus rooms for your community initiatives'
            }
          </Text>
        </div>

        {/* Chat context display for promotion */}
        {entryPoint === 'chat-promotion' && chatContext && (
          <Card>
            <CardHeader>
              <CardTitle>Current Chat Context</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid cols={1} responsive={{ md: 3 }} gap="md">
                <div>
                  <Text variant="caption" color="muted">Messages</Text>
                  <Text className="font-medium">{chatContext.messageCount}</Text>
                </div>
                <div>
                  <Text variant="caption" color="muted">Participants</Text>
                  <Text className="font-medium">{chatContext.participants}</Text>
                </div>
                <div>
                  <Text variant="caption" color="muted">Recent Topics</Text>
                  <Text className="font-medium">{chatContext.recentTopics.join(', ')}</Text>
                </div>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Custom Room Generator */}
        <Card>
          <CardHeader>
            <CardTitle>
              {entryPoint === 'chat-promotion' ? 'Define Your Focus Room' : 'Create Custom Room'}
            </CardTitle>
            <CardDescription>
              {entryPoint === 'chat-promotion' 
                ? 'Build on your chat discussion with a structured room environment'
                : 'Describe your idea and we\'ll help you create a room specification'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Room Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                {ROOM_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {entryPoint === 'chat-promotion' ? 'Room Name & Focus' : 'Your Room Idea'}
              </label>
              <Input
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                placeholder={entryPoint === 'chat-promotion' 
                  ? "e.g., Community Garden Planning Room, Local Business Network..."
                  : "e.g., Community Garden Project, Local Business Support Network..."
                }
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerateCustom}
              disabled={!customIdea.trim()}
              className="w-full"
            >
              {entryPoint === 'chat-promotion' ? 'Generate Room Concept' : 'Generate Room Concept'}
            </Button>
          </CardFooter>
        </Card>

        {/* Sample Room Concepts (only for standalone) */}
        {entryPoint === 'standalone' && (
          <div>
            <Heading level={3} className="mb-4">Sample Room Concepts</Heading>
            <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="md">
              {filteredConcepts.map((concept) => (
                <Card key={concept.id} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{concept.name}</CardTitle>
                    <Badge variant="outline" className="w-fit">{concept.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body-small" className="mb-3">{concept.purpose}</Text>
                    <div className="space-y-2">
                      <Text variant="caption" color="muted">
                        <strong>Members:</strong> {concept.estimatedMembers}
                      </Text>
                      <Text variant="caption" color="muted">
                        <strong>Time:</strong> {concept.timeCommitment}
                      </Text>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => handlePreviewConcept(concept)}
                      className="w-full"
                    >
                      Preview Room
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          </div>
        )}
      </div>
    </Container>
  );
};

export default UnifiedRoomGenerator;
