'use client';

import { useState } from 'react';
import { 
  Container, 
  Section, 
  Grid, 
  Flex,
  Heading, 
  Text, 
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui';
import Link from 'next/link';

interface FunnelStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionText: string;
  actionHref?: string;
  actionOnClick?: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

interface LaunchFunnelProps {
  onCreateRoom?: () => void;
  className?: string;
}

const LaunchFunnel: React.FC<LaunchFunnelProps> = ({ onCreateRoom, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const funnelSteps: FunnelStep[] = [
    {
      id: 'news',
      title: 'Discover',
      description: 'Start by exploring news and stories from the Kamunity network to find topics that resonate with you.',
      icon: '📰',
      actionText: 'Browse News',
      actionHref: '/news',
      isActive: currentStep === 0,
      isCompleted: currentStep > 0,
    },
    {
      id: 'chat',
      title: 'Connect',
      description: 'Join conversations about topics you care about. Share your thoughts and connect with like-minded community members.',
      icon: '💬',
      actionText: 'Join Chats',
      actionHref: '/chat',
      isActive: currentStep === 1,
      isCompleted: currentStep > 1,
    },
    {
      id: 'room',
      title: 'Create',
      description: 'Ready to take action? Create a Focus Room to organize collaborative efforts around the issues that matter to you.',
      icon: '🎯',
      actionText: 'Create Room',
      actionOnClick: onCreateRoom,
      isActive: currentStep === 2,
      isCompleted: currentStep > 2,
    },
  ];

  const handleStepAction = (step: FunnelStep, index: number) => {
    if (step.actionOnClick) {
      step.actionOnClick();
    }
    // Advance to next step when action is taken
    if (index === currentStep && currentStep < funnelSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Section spacing="lg" className={className}>
      <Container>
        <div className="text-center mb-12">
          <Heading level={2} className="mb-4">
            Your Journey to Impact
          </Heading>
          <Text variant="body-large" color="muted" className="max-w-2xl mx-auto">
            Follow these simple steps to discover, connect, and create meaningful change in your community.
          </Text>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {funnelSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300
                    ${step.isCompleted 
                      ? 'bg-success-500 text-white' 
                      : step.isActive 
                        ? 'bg-primary-500 text-white ring-4 ring-primary-200' 
                        : 'bg-neutral-200 text-neutral-500'
                    }
                  `}
                >
                  {step.isCompleted ? '✓' : index + 1}
                </div>
                {index < funnelSteps.length - 1 && (
                  <div 
                    className={`
                      w-16 h-1 mx-2 transition-all duration-300
                      ${step.isCompleted ? 'bg-success-500' : 'bg-neutral-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Funnel Steps */}
        <Grid cols={1} responsive={{ md: 3 }} gap="lg">
          {funnelSteps.map((step, index) => (
            <Card 
              key={step.id}
              className={`
                group transition-all duration-300 relative overflow-hidden
                ${step.isActive 
                  ? 'ring-2 ring-primary-500 shadow-lg transform scale-105' 
                  : step.isCompleted
                    ? 'bg-success-50 border-success-200'
                    : 'hover:shadow-card-hover'
                }
              `}
            >
              {/* Active Step Indicator */}
              {step.isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500" />
              )}
              
              {/* Completed Step Indicator */}
              {step.isCompleted && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}

              <CardHeader>
                <div 
                  className={`
                    w-16 h-16 rounded-lg flex items-center justify-center mb-4 text-2xl transition-all duration-300
                    ${step.isActive 
                      ? 'bg-primary-100 group-hover:bg-primary-200' 
                      : step.isCompleted
                        ? 'bg-success-100'
                        : 'bg-neutral-100 group-hover:bg-neutral-200'
                    }
                  `}
                >
                  {step.icon}
                </div>
                <CardTitle className={step.isActive ? 'text-primary-700' : ''}>
                  {step.title}
                </CardTitle>
                <CardDescription>
                  {step.description}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                {step.actionHref ? (
                  <Link href={step.actionHref} className="w-full">
                    <Button 
                      variant={step.isActive ? 'primary' : step.isCompleted ? 'outline' : 'ghost'}
                      className="w-full"
                      onClick={() => handleStepAction(step, index)}
                    >
                      {step.isCompleted ? `✓ ${step.actionText}` : step.actionText}
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant={step.isActive ? 'primary' : step.isCompleted ? 'outline' : 'ghost'}
                    className="w-full"
                    onClick={() => handleStepAction(step, index)}
                  >
                    {step.isCompleted ? `✓ ${step.actionText}` : step.actionText}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </Grid>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <CardContent className="p-8">
              <Heading level={3} className="mb-4 text-primary-700">
                Ready to Make an Impact?
              </Heading>
              <Text className="mb-6 max-w-xl mx-auto">
                Join thousands of community members who are already creating positive change through collaborative action.
              </Text>
              <Flex gap="md" justify="center" className="flex-col sm:flex-row">
                <Link href="/news">
                  <Button variant="outline" size="lg">
                    Start Exploring
                  </Button>
                </Link>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={onCreateRoom}
                >
                  Create Your First Room
                </Button>
              </Flex>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

export default LaunchFunnel;
