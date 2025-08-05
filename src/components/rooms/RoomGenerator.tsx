'use client';

import { useState } from 'react';
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
}

interface RoomGeneratorProps {
  onRoomRequest: (concept: RoomConcept) => void;
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
    id: '1',
    name: 'Local Climate Action Hub',
    purpose: 'Coordinate community-level climate change initiatives and education',
    description: 'A collaborative space for residents to organize local environmental projects, share resources, and track our collective impact on reducing carbon emissions.',
    category: 'Environmental Action',
    estimatedMembers: '15-25',
    timeCommitment: '2-4 hours/week',
    skillsNeeded: ['Project Management', 'Community Outreach', 'Environmental Science'],
    expectedOutcomes: ['Reduced local carbon footprint', 'Community education programs', 'Policy advocacy'],
    tools: ['Project Tracker', 'Resource Library', 'Event Calendar'],
    tags: ['climate', 'environment', 'local-action', 'sustainability']
  },
  {
    id: '2',
    name: 'Digital Literacy for Seniors',
    purpose: 'Bridge the digital divide by teaching technology skills to older adults',
    description: 'Connect tech-savvy volunteers with seniors who want to learn digital skills, from basic computer use to social media and online safety.',
    category: 'Education & Learning',
    estimatedMembers: '10-20',
    timeCommitment: '3-5 hours/week',
    skillsNeeded: ['Teaching', 'Patience', 'Technology', 'Communication'],
    expectedOutcomes: ['Improved digital literacy', 'Reduced social isolation', 'Intergenerational connections'],
    tools: ['Learning Modules', 'Progress Tracker', 'Video Tutorials'],
    tags: ['education', 'seniors', 'technology', 'digital-divide']
  },
  {
    id: '3',
    name: 'Community Mental Health Support',
    purpose: 'Create peer support networks for mental health and wellness',
    description: 'A safe space for community members to share experiences, resources, and support each other&apos;s mental health journey through peer-led initiatives.',
    category: 'Health & Wellness',
    estimatedMembers: '8-15',
    timeCommitment: '2-3 hours/week',
    skillsNeeded: ['Active Listening', 'Empathy', 'Group Facilitation'],
    expectedOutcomes: ['Reduced stigma', 'Peer support networks', 'Resource sharing'],
    tools: ['Support Groups', 'Resource Directory', 'Crisis Protocols'],
    tags: ['mental-health', 'support', 'wellness', 'community']
  }
];

const RoomGenerator: React.FC<RoomGeneratorProps> = ({ onRoomRequest }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customIdea, setCustomIdea] = useState<string>('');
  const [selectedConcept, setSelectedConcept] = useState<RoomConcept | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSpecSheet, setShowSpecSheet] = useState(false);

  const filteredConcepts = selectedCategory 
    ? SAMPLE_CONCEPTS.filter(concept => concept.category === selectedCategory)
    : SAMPLE_CONCEPTS;

  const handleGenerateCustom = () => {
    if (!customIdea.trim()) return;
    
    // Simple concept generation based on user input
    const customConcept: RoomConcept = {
      id: `custom-${Date.now()}`,
      name: customIdea,
      purpose: `Collaborate on ${customIdea.toLowerCase()} initiatives`,
      description: `A dedicated space for community members to work together on ${customIdea.toLowerCase()}, share resources, and coordinate actions.`,
      category: selectedCategory || 'Community Building',
      estimatedMembers: '5-15',
      timeCommitment: '2-4 hours/week',
      skillsNeeded: ['Collaboration', 'Communication', 'Initiative'],
      expectedOutcomes: ['Community engagement', 'Shared learning', 'Collective action'],
      tools: ['Discussion Board', 'Resource Sharing', 'Action Tracker'],
      tags: [customIdea.toLowerCase().replace(/\s+/g, '-'), 'community', 'collaboration']
    };

    setSelectedConcept(customConcept);
    setShowPreview(true);
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

  if (showSpecSheet && selectedConcept) {
    return (
      <Container>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <Flex justify="between" align="center">
              <div>
                <CardTitle className="text-2xl">{selectedConcept.name}</CardTitle>
                <CardDescription>Room Specification Sheet</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowSpecSheet(false)}>
                Back to Preview
              </Button>
            </Flex>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Heading level={3} className="mb-2">Purpose & Vision</Heading>
              <Text>{selectedConcept.purpose}</Text>
            </div>
            
            <div>
              <Heading level={3} className="mb-2">Detailed Description</Heading>
              <Text>{selectedConcept.description}</Text>
            </div>

            <Grid cols={1} responsive={{ md: 2 }} gap="md">
              <div>
                <Heading level={4} className="mb-2">Room Details</Heading>
                <div className="space-y-2">
                  <Text><strong>Category:</strong> {selectedConcept.category}</Text>
                  <Text><strong>Expected Members:</strong> {selectedConcept.estimatedMembers}</Text>
                  <Text><strong>Time Commitment:</strong> {selectedConcept.timeCommitment}</Text>
                </div>
              </div>
              
              <div>
                <Heading level={4} className="mb-2">Skills Needed</Heading>
                <Flex gap="sm" className="flex-wrap">
                  {selectedConcept.skillsNeeded.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </Flex>
              </div>
            </Grid>

            <div>
              <Heading level={4} className="mb-2">Expected Outcomes</Heading>
              <ul className="list-disc list-inside space-y-1">
                {selectedConcept.expectedOutcomes.map((outcome, index) => (
                  <li key={index}><Text>{outcome}</Text></li>
                ))}
              </ul>
            </div>

            <div>
              <Heading level={4} className="mb-2">Included Tools & Features</Heading>
              <Flex gap="sm" className="flex-wrap">
                {selectedConcept.tools.map((tool, index) => (
                  <Badge key={index} variant="outline">{tool}</Badge>
                ))}
              </Flex>
            </div>

            <div>
              <Heading level={4} className="mb-2">Tags</Heading>
              <Flex gap="sm" className="flex-wrap">
                {selectedConcept.tags.map((tag, index) => (
                  <Badge key={index} variant="default">#{tag}</Badge>
                ))}
              </Flex>
            </div>
          </CardContent>
          <CardFooter>
            <Flex gap="md" className="w-full">
              <Button variant="outline" onClick={() => setShowPreview(true)} className="flex-1">
                Back to Preview
              </Button>
              <Button variant="primary" onClick={handleRequestRoom} className="flex-1">
                Request This Room
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
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <Flex justify="between" align="center">
              <div>
                <CardTitle className="text-xl">{selectedConcept.name}</CardTitle>
                <CardDescription>Room Preview</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Back to Generator
              </Button>
            </Flex>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg">
                <Text className="font-medium text-primary-700">{selectedConcept.purpose}</Text>
              </div>
              
              <Text>{selectedConcept.description}</Text>
              
              <Grid cols={1} responsive={{ md: 3 }} gap="sm">
                <div className="text-center p-3 bg-neutral-50 rounded">
                  <Text variant="body-small" color="muted">Expected Members</Text>
                  <Text className="font-semibold">{selectedConcept.estimatedMembers}</Text>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded">
                  <Text variant="body-small" color="muted">Time Commitment</Text>
                  <Text className="font-semibold">{selectedConcept.timeCommitment}</Text>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded">
                  <Text variant="body-small" color="muted">Category</Text>
                  <Text className="font-semibold">{selectedConcept.category}</Text>
                </div>
              </Grid>

              <div>
                <Text variant="body-small" color="muted" className="mb-2">Skills Needed:</Text>
                <Flex gap="sm" className="flex-wrap">
                  {selectedConcept.skillsNeeded.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </Flex>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Flex gap="md" className="w-full">
              <Button variant="outline" onClick={handleViewSpecSheet} className="flex-1">
                View Full Spec Sheet
              </Button>
              <Button variant="primary" onClick={handleRequestRoom} className="flex-1">
                Request This Room
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <Heading level={2} className="mb-2">Room Specification Generator</Heading>
          <Text color="muted">
            Generate, preview, and request custom focus rooms for your community initiatives
          </Text>
        </div>

        {/* Custom Room Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Room</CardTitle>
            <CardDescription>
              Describe your idea and we&apos;ll help you create a room specification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Room Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="Select a category (optional)"
              >
                {ROOM_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Your Room Idea</label>
              <Input
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                placeholder="e.g., Community Garden Project, Local Business Support Network..."
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
              Generate Room Concept
            </Button>
          </CardFooter>
        </Card>

        {/* Sample Room Concepts */}
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
      </div>
    </Container>
  );
};

export default RoomGenerator;
