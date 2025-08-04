'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomGenerator from '@/components/rooms/RoomGenerator';
import { Container, Section, Heading, Text, Card, CardContent } from '@/components/ui';
import KaiCharacter from '@/components/KaiCharacter';

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

export default function RoomGeneratorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    roomId?: string;
  }>({ type: null, message: '' });

  const handleRoomRequest = async (concept: RoomConcept) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/rooms/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: concept.name,
          purpose: concept.purpose,
          description: concept.description,
          category: concept.category,
          estimatedMembers: concept.estimatedMembers,
          timeCommitment: concept.timeCommitment,
          skillsNeeded: concept.skillsNeeded,
          expectedOutcomes: concept.expectedOutcomes,
          tools: concept.tools,
          tags: concept.tags,
          requestedBy: 'anonymous-user', // Manual approval process for launch
          requestType: concept.id.startsWith('custom-') ? 'custom' : 'generated',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Room request submitted successfully! Redirecting to your new room...',
          roomId: result.data.roomId,
        });

        // Redirect to the new room after a short delay
        setTimeout(() => {
          router.push(`/rooms/${result.data.roomId}`);
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to submit room request',
        });
      }
    } catch (error) {
      console.error('Room request error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Section spacing="lg" background="primary" className="text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            {/* Kai Character Introduction */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl" role="img" aria-label="Kai helping you create">🎆</span>
                </div>
                <div className="text-left">
                  <Text variant="body-small" weight="semibold" className="text-white mb-1">
                    🚀 Room Generator
                  </Text>
                  <Text variant="caption" className="text-white/80">
                    Let&apos;s build something amazing together!
                  </Text>
                </div>
              </div>
            </div>
            
            <Heading level={1} className="text-white mb-4">
              Turn Your Vision Into Reality ✨
            </Heading>
            <Text variant="body-large" className="text-white/90 mb-6">
              Ready to transform your brilliant idea into a thriving community space? I&apos;ll help you design the perfect Focus Room where collaboration happens and real change begins.
            </Text>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Text variant="body-small" className="text-white/80">
                💡 <strong>How it works:</strong> Share your vision → Preview your room → Review the magic → Launch your community!
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Status Messages */}
      {submitStatus.type && (
        <Section spacing="sm">
          <Container>
            <Card className={`max-w-2xl mx-auto ${
              submitStatus.type === 'success' ? 'border-success-200 bg-success-50' : 'border-error-200 bg-error-50'
            }`}>
              <CardContent className="p-4">
                <Text className={`text-center ${
                  submitStatus.type === 'success' ? 'text-success-700' : 'text-error-700'
                }`}>
                  {submitStatus.message}
                </Text>
              </CardContent>
            </Card>
          </Container>
        </Section>
      )}

      {/* Room Generator */}
      <Section spacing="lg">
        <div className={isSubmitting ? 'opacity-50 pointer-events-none' : ''}>
          <RoomGenerator onRoomRequest={handleRoomRequest} />
        </div>
      </Section>

      {/* Information Section */}
      <Section spacing="lg" background="neutral">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading level={2} className="text-center mb-8">
              About Focus Rooms
            </Heading>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-600 text-xl">🎯</span>
                  </div>
                  <Heading level={4} className="mb-2">Focused Collaboration</Heading>
                  <Text variant="body-small" color="muted">
                    Small teams working together on specific initiatives with clear goals and outcomes.
                  </Text>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-secondary-600 text-xl">🔧</span>
                  </div>
                  <Heading level={4} className="mb-2">Built-in Tools</Heading>
                  <Text variant="body-small" color="muted">
                    Each room comes with collaboration tools, project tracking, and resource sharing capabilities.
                  </Text>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-success-600 text-xl">📈</span>
                  </div>
                  <Heading level={4} className="mb-2">Growth Path</Heading>
                  <Text variant="body-small" color="muted">
                    Successful rooms can connect with others to form clubs and eventually communities.
                  </Text>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
