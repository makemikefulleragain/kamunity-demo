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
  Flex
} from '@/components/ui';
import { Input } from '@/components/ui/Input';

interface FocusRoomSpec {
  id: string;
  name: string;
  purpose: string;
  targetGroup: string;
  primaryGoal: string;
  constraints?: string;
  tone: 'formal' | 'casual' | 'playful' | 'professional';
  additionalGoals: string[];
  pitch: string;
  roiStory: string;
  timeSavings: {
    before: string[];
    after: string[];
    hoursSaved: number;
    subscriptionsSaved: number;
  };
  homepage: {
    layout: string;
    navigation: string[];
    heroSection: string;
    quickActions: string[];
    widgets: string[];
  };
  userFlow: string[];
  designQuestions: string[];
  mvpMatrix: {
    feature: string;
    mvp: boolean;
    pro: boolean;
    full: boolean;
  }[];
  additionalSuggestions: string[];
}

interface ComprehensiveFocusRoomGeneratorProps {
  onComplete: (spec: FocusRoomSpec) => void;
  onCancel: () => void;
}

const ComprehensiveFocusRoomGenerator: React.FC<ComprehensiveFocusRoomGeneratorProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    targetGroup: '',
    primaryGoal: '',
    constraints: '',
    tone: 'professional' as const,
    requiredFeatures: '',
    confirmed: false
  });
  const [generatedSpec, setGeneratedSpec] = useState<FocusRoomSpec | null>(null);
  const [additionalGoals, setAdditionalGoals] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAdditionalGoals = () => {
    // Generate contextual additional goals based on user input
    const goals = [];
    
    if (formData.targetGroup.toLowerCase().includes('team')) {
      goals.push('Build stronger team cohesion through shared achievements');
      goals.push('Create a knowledge-sharing hub for best practices');
    }
    
    if (formData.primaryGoal.toLowerCase().includes('project')) {
      goals.push('Establish transparent project milestone tracking');
      goals.push('Enable real-time stakeholder updates and feedback');
    }
    
    if (formData.targetGroup.toLowerCase().includes('community')) {
      goals.push('Foster member-to-member mentoring relationships');
      goals.push('Create opportunities for skill-sharing workshops');
    }
    
    // Default suggestions
    if (goals.length === 0) {
      goals.push('Build a resource library for future reference');
      goals.push('Create networking opportunities within your focus area');
      goals.push('Establish metrics for measuring collective impact');
    }
    
    setAdditionalGoals(goals);
  };

  const generateDetailedSpec = (): FocusRoomSpec => {
    const roomName = `${formData.targetGroup} ${formData.primaryGoal} Hub`.replace(/\s+/g, ' ').trim();
    
    return {
      id: `comprehensive-${Date.now()}`,
      name: roomName,
      purpose: formData.primaryGoal,
      targetGroup: formData.targetGroup,
      primaryGoal: formData.primaryGoal,
      constraints: formData.constraints,
      tone: formData.tone,
      additionalGoals,
      
      pitch: `🎯 ${roomName}: Where ${formData.targetGroup.toLowerCase()} come together to achieve ${formData.primaryGoal.toLowerCase()}. Transform scattered conversations into focused action with our purpose-built collaboration environment.`,
      
      roiStory: `Picture this: Your ${formData.targetGroup.toLowerCase()} currently juggle multiple platforms, miss important updates, and struggle to track progress. With your Focus Room, Sarah logs in Monday morning to see exactly what needs attention. The AI assistant highlights key discussions from the weekend. She quickly RSVPs to this week's planning session, votes on the proposed timeline, and shares her latest findings in the dedicated chat. By lunch, three team members have built on her ideas, the project timeline is confirmed, and everyone knows their next steps. What used to take hours of email chains and missed messages now happens seamlessly in one place.`,
      
      timeSavings: {
        before: [
          'Email chains for coordination: 3 hours/week',
          'Searching for shared documents: 2 hours/week', 
          'Status update meetings: 2 hours/week',
          'Multiple platform subscriptions: $200/month'
        ],
        after: [
          'Centralised coordination: 30 minutes/week',
          'Instant document access: 10 minutes/week',
          'Async status updates: 30 minutes/week', 
          'Single platform solution: $50/month'
        ],
        hoursSaved: 6,
        subscriptionsSaved: 150
      },
      
      homepage: {
        layout: `
┌─────────────────────────────────────────────────────────┐
│ Header: Kamunity | Actions | Impact | Resources | Help  │
├─────────────────────────────────────────────────────────┤
│ Hero: ${roomName}                                       │
│ Purpose: ${formData.primaryGoal}                        │
│ Members: [👤][👤][👤] +12 | Stats: 47 actions this week│
├─────────────────────────────────────────────────────────┤
│ Quick Actions: [📅 Schedule] [📊 Vote] [💡 Suggest]    │
├─────────────────────────────────────────────────────────┤
│ Main Content (2/3)        │ AI Assistant (1/3)         │
│ 💬 Live Room Chat         │ 🤖 Smart Prompts & Tips    │
│ Recent: "Great progress   │ "Try: Review this week's   │
│ on the Q3 goals..."       │ action items"              │
├─────────────────────────────────────────────────────────┤
│ Widgets: [📅 Calendar] [📊 Polls] [⭐ Badges] [📈 Analytics] │
├─────────────────────────────────────────────────────────┤
│ Footer: Report an issue or idea 💡                      │
└─────────────────────────────────────────────────────────┘`,
        navigation: ['Kamunity', 'Actions', 'Impact', 'Resources', 'Help'],
        heroSection: `${roomName} - ${formData.primaryGoal}`,
        quickActions: ['Schedule Session', 'Create Poll', 'Submit Idea', 'View Progress'],
        widgets: ['Calendar Scheduler', 'Polls Module', 'Badge Showcase', 'Live Analytics', 'Resource Library']
      },
      
      userFlow: [
        '1. Onboarding: Welcome tour highlighting key features and room purpose',
        '2. Profile Setup: Add skills, interests, and availability preferences', 
        '3. First Interaction: Join ongoing discussion or schedule first session',
        '4. Regular Engagement: Check daily digest, respond to polls, share updates',
        '5. Collaboration: Use chat, schedule meetings, share resources',
        '6. Recognition: Earn badges for contributions and milestone achievements',
        '7. Growth: Invite new members, create sub-groups, expand room scope',
        '8. Analytics Review: Track progress, celebrate wins, identify improvements'
      ],
      
      designQuestions: [
        'Should badge tiers reflect expertise levels or contribution frequency?',
        'Would you prefer automated daily digests or weekly summaries?',
        'Should the AI assistant be proactive with suggestions or wait for requests?',
        'Would colour-coded priority levels help with task management?',
        'Should member profiles show availability status for better coordination?'
      ],
      
      mvpMatrix: [
        { feature: 'Secure authentication & encryption', mvp: true, pro: true, full: true },
        { feature: 'Professional UI with brand colours', mvp: true, pro: true, full: true },
        { feature: 'Calendar & RSVP system', mvp: true, pro: true, full: true },
        { feature: 'Poll creation & voting', mvp: true, pro: true, full: true },
        { feature: 'Group chat & messaging', mvp: true, pro: true, full: true },
        { feature: 'Basic badge system', mvp: true, pro: true, full: true },
        { feature: 'Simple analytics dashboard', mvp: true, pro: true, full: true },
        { feature: 'Feedback widget', mvp: true, pro: true, full: true },
        { feature: 'Advanced AI assistant', mvp: false, pro: true, full: true },
        { feature: 'Custom reporting tools', mvp: false, pro: true, full: true },
        { feature: 'Integration with external tools', mvp: false, pro: false, full: true },
        { feature: 'White-label customisation', mvp: false, pro: false, full: true }
      ],
      
      additionalSuggestions: [
        'Consider a pilot program with 5-10 core users for rapid feedback',
        'Track engagement metrics: daily active users, message frequency, poll participation',
        'Implement progressive disclosure: advanced features unlock as users engage more',
        'Create template workflows for common use cases in your domain',
        'Plan quarterly review sessions to assess room effectiveness and iterate'
      ]
    };
  };

  const handleConfirmation = () => {
    generateAdditionalGoals();
    setCurrentStep(3);
  };

  const handleFinalConfirmation = () => {
    const spec = generateDetailedSpec();
    setGeneratedSpec(spec);
    setCurrentStep(4);
  };

  const handleComplete = () => {
    if (generatedSpec) {
      onComplete(generatedSpec);
    }
  };

  // Step 1: Introduction & Safeguards
  if (currentStep === 1) {
    return (
      <Container className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary-700">
              🎯 Kamunity Focus Room Generator
            </CardTitle>
            <CardDescription className="text-lg">
              Professional Room Design Consultation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <Heading level={3} className="mb-3 text-blue-900">My Purpose</Heading>
              <Text className="text-blue-800 mb-4">
                I&apos;m here to help craft a custom Focus Room: a digital environment built around conversations, 
                community and impact, designed with transparency and iterative checks to ensure accuracy and 
                alignment with your needs.
              </Text>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <Heading level={3} className="mb-3 text-green-900">Safeguards & Process</Heading>
              <div className="space-y-2 text-green-800">
                <Text>✅ I&apos;ll summarise your objectives back to you and highlight assumptions</Text>
                <Text>✅ I&apos;ll propose 1–2 additional possibilities that align with your goals</Text>
                <Text>✅ I&apos;ll wait for your confirmation before building the full specification</Text>
                <Text>✅ You&apos;ll receive a complete room design with ROI analysis and implementation roadmap</Text>
              </div>
            </div>

            <div className="text-center">
              <Text className="text-gray-600 mb-4">
                This process takes 3-4 steps and approximately 5-10 minutes to complete.
              </Text>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setCurrentStep(2)} size="lg" className="px-8">
              Begin Room Design Process
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  // Step 2: Clarifying Questions
  if (currentStep === 2) {
    return (
      <Container className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Step 2: Clarifying Questions</CardTitle>
            <CardDescription>
              Help me understand your needs so I can design the perfect Focus Room
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                1. Who is this new Focus Room for? (e.g. team type, organisation, project context)
              </label>
              <Input
                value={formData.targetGroup}
                onChange={(e) => handleInputChange('targetGroup', e.target.value)}
                placeholder="e.g. Marketing team, Community volunteers, Product development team..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                2. What do they want to achieve with it? (key outcomes, success criteria)
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="e.g. Coordinate quarterly planning, Launch new product features, Organize community events..."
                value={formData.primaryGoal}
                onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Heading level={4} className="mb-3">Optional Preferences</Heading>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Any constraints? (existing tools, budget, timeline)
                  </label>
                  <Input
                    value={formData.constraints}
                    onChange={(e) => handleInputChange('constraints', e.target.value)}
                    placeholder="e.g. Must integrate with Slack, Launch within 2 months..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred tone & style</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={formData.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                  >
                    <option value="professional">Professional</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="playful">Playful</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Required tools or features? (calendar, polling, etc.)
                  </label>
                  <Input
                    value={formData.requiredFeatures}
                    onChange={(e) => handleInputChange('requiredFeatures', e.target.value)}
                    placeholder="e.g. Video calls, File sharing, Task tracking..."
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button 
              onClick={handleConfirmation}
              disabled={!formData.targetGroup.trim() || !formData.primaryGoal.trim()}
            >
              Continue to Review
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  // Step 3: Check for Understanding
  if (currentStep === 3) {
    return (
      <Container className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Step 3: Check for Understanding</CardTitle>
            <CardDescription>
              Let me confirm I understand your needs correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <Heading level={3} className="mb-3 text-blue-900">My Understanding</Heading>
              <Text className="text-blue-800">
                You need a Focus Room for <strong>{formData.targetGroup}</strong> aiming to achieve{' '}
                <strong>{formData.primaryGoal}</strong>.
                {formData.constraints && (
                  <span> With constraints: <strong>{formData.constraints}</strong>.</span>
                )}
                {formData.requiredFeatures && (
                  <span> Required features include: <strong>{formData.requiredFeatures}</strong>.</span>
                )}
              </Text>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <Heading level={3} className="mb-3 text-green-900">Additional Value Opportunities</Heading>
              <Text className="text-green-800 mb-3">
                Additionally, you might leverage this room to:
              </Text>
              <div className="space-y-2">
                {additionalGoals.map((goal, index) => (
                  <Text key={index} className="text-green-700">
                    • {goal}
                  </Text>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <Heading level={3} className="mb-3 text-yellow-900">Confirmation Required</Heading>
              <Text className="text-yellow-800">
                Does this capture your intent? Would you like to include the additional ideas above? 
                Or are there any other adjustments or additions before I proceed with the detailed design?
              </Text>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back to Edit
            </Button>
            <Button onClick={handleFinalConfirmation} size="lg">
              ✅ Yes, Generate Full Specification
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  // Step 4: Generated Detailed Focus Room Spec
  if (currentStep === 4 && generatedSpec) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary-700">
                {generatedSpec.name}
              </CardTitle>
              <CardDescription className="text-lg">
                Complete Focus Room Specification
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 1. Pitch / Sales Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🎯 Pitch</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-lg mb-4">{generatedSpec.pitch}</Text>
              <Button size="lg" className="w-full">
                Let&apos;s Get This Live! 🚀
              </Button>
            </CardContent>
          </Card>

          {/* 2. Community Space ROI */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">💰 Your Community Space ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="leading-relaxed">{generatedSpec.roiStory}</Text>
            </CardContent>
          </Card>

          {/* 3. Time & Cost Savings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">⏰ Time & Cost Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Heading level={3} className="mb-3 text-red-700">Before (Current State)</Heading>
                  <div className="space-y-2">
                    {generatedSpec.timeSavings.before.map((item, index) => (
                      <Text key={index} className="text-red-600">• {item}</Text>
                    ))}
                  </div>
                </div>
                <div>
                  <Heading level={3} className="mb-3 text-green-700">With Focus Room</Heading>
                  <div className="space-y-2">
                    {generatedSpec.timeSavings.after.map((item, index) => (
                      <Text key={index} className="text-green-600">• {item}</Text>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <Text className="font-semibold text-green-800">
                  Total Savings: {generatedSpec.timeSavings.hoursSaved} hours/week + 
                  ${generatedSpec.timeSavings.subscriptionsSaved}/month
                </Text>
              </div>
            </CardContent>
          </Card>

          {/* 4. Homepage Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🏠 Your New Community Homepage</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                {generatedSpec.homepage.layout}
              </pre>
            </CardContent>
          </Card>

          {/* 5. User Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🔄 How You Might Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedSpec.userFlow.map((step, index) => (
                  <Text key={index} className="border-l-4 border-blue-500 pl-4">
                    {step}
                  </Text>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 6. Design Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🎨 Design Questions & Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedSpec.designQuestions.map((question, index) => (
                  <Text key={index} className="text-gray-700">• {question}</Text>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 7. MVP / Pro / Full Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">📊 MVP / Pro / Full Version Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Feature</th>
                      <th className="border border-gray-300 p-3 text-center">MVP</th>
                      <th className="border border-gray-300 p-3 text-center">Pro</th>
                      <th className="border border-gray-300 p-3 text-center">Full</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedSpec.mvpMatrix.map((row, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-3">{row.feature}</td>
                        <td className="border border-gray-300 p-3 text-center">
                          {row.mvp ? '✅' : '❌'}
                        </td>
                        <td className="border border-gray-300 p-3 text-center">
                          {row.pro ? '✅' : '❌'}
                        </td>
                        <td className="border border-gray-300 p-3 text-center">
                          {row.full ? '✅' : '❌'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <Text className="text-blue-800 font-medium">
                  🔄 Kamunity's Feedback Loop for Fast Improvements Guarantee: 
                  Embed a minimal feedback widget in the MVP for core users to flag issues 
                  or suggest enhancements, enabling quick pivots in early weeks.
                </Text>
              </div>
            </CardContent>
          </Card>

          {/* 8. Additional Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">💡 Additional Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedSpec.additionalSuggestions.map((suggestion, index) => (
                  <Text key={index} className="border-l-4 border-yellow-500 pl-4 text-gray-700">
                    {suggestion}
                  </Text>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="text-center space-y-4">
              <Text className="text-lg text-gray-700">
                Thank you for using the Kamunity Focus Room Generator! 
                I&apos;m excited to see how this room will support your goals and ambitions ✨
              </Text>
              <Flex gap="md" justify="center">
                <Button variant="outline" onClick={onCancel}>
                  Start Over
                </Button>
                <Button onClick={handleComplete} size="lg">
                  🎉 Create This Room
                </Button>
              </Flex>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default ComprehensiveFocusRoomGenerator;
