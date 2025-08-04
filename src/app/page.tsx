'use client';

import { useState } from 'react';
import { 
  Container, 
  Section, 
  Flex,
  Heading, 
  Text, 
  Button,
  Card,
  CardContent
} from '@/components/ui';
import CreateRoomModal from '@/components/CreateRoomModal';
import LaunchFunnel from '@/components/LaunchFunnel';
import Link from 'next/link';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      {/* Hero Section with Gradient Background */}
      <Section 
        spacing="xl" 
        className="bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 text-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />
        
        <Container className="relative z-10">
          <Flex direction="col" align="center" justify="center" className="text-center min-h-[60vh]">
            {/* Kai Character Illustration */}
            <div className="mb-8 relative">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-3xl" role="img" aria-label="Kai, your community guide">👋</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning-400 rounded-full animate-pulse flex items-center justify-center">
                <span className="text-xs">✨</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <Text variant="caption" className="text-white/80 font-medium px-2 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                  Hi, I&apos;m Kai! 👋
                </Text>
              </div>
            </div>
            
            <Heading level={1} variant="display" className="text-white mb-6 max-w-4xl">
              Hello Kamunity World 🌍
            </Heading>
            
            <Text variant="body-large" className="text-white/90 mb-4 max-w-2xl">
              Imagine a space where good people do good things together. Where your voice matters, 
              your stories inspire others, and every conversation has the power to create real change in your community.
            </Text>
            
            <Text variant="body-base" className="text-white/80 mb-8 max-w-xl">
              This is where community lives, breathes, and grows—one meaningful connection at a time ✨
            </Text>
            
            <Flex gap="md" className="flex-col sm:flex-row">
              <Link href="/news">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  📰 The News
                </Button>
              </Link>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-primary-600 hover:bg-white/90 shadow-lg"
              >
                🎉 Get Started
              </Button>
            </Flex>
            
            <Text variant="caption" className="text-white/70 mt-8">
              💫 Your Community, Your Voice, Your Stories—All Together
            </Text>
          </Flex>
        </Container>
      </Section>

      {/* Community Voice & News Section */}
      <Section spacing="lg" background="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Left Column - Community Quote (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 h-full flex flex-col justify-center">
                <div className="text-center">
                  <Text variant="body-large" className="mb-4 italic">
                    &ldquo;Kamunity isn&apos;t just a platform&mdash;it&apos;s where real relationships form and 
                    real change happens. Every conversation matters, every voice counts.&rdquo;
                  </Text>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">K</span>
                    </div>
                    <div className="text-left">
                      <Text variant="body-small" weight="semibold">Kai (Community Guide)</Text>
                      <Text variant="caption" color="muted">Kamunity Team</Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Middle Column - Hero Image Container (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="relative h-full bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center shadow-lg min-h-[280px]">
                {/* Community themed illustration */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <Text variant="body-small" className="font-medium text-primary-700">
                    COMMUNITY
                  </Text>
                  <Text variant="body-small" color="muted" className="mt-1">
                    Real connections
                  </Text>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-secondary-400 rounded-full opacity-60"></div>
                <div className="absolute bottom-6 left-4 w-2 h-2 bg-primary-400 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-secondary-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Right Column - News Today (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-50 rounded-2xl p-6 h-full flex flex-col">
                <Heading level={3} className="mb-2 text-lg">
                  KAMUNITY NEWS TODAY
                </Heading>
                <Text color="muted" className="mb-4 text-sm flex-grow">
                  Get the Kamunity News team and find out what&apos;s happening in the Kamunity today
                </Text>
                
                {/* Audio Player */}
                <div className="flex items-center gap-3 mb-4 bg-white rounded-lg p-3 shadow-sm">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">▶️</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-neutral-200 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                  <Text variant="caption" color="muted">2:30</Text>
                </div>
                
                {/* Visit Newsroom Link */}
                <Link href="/news" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium mt-auto">
                  <span>visit the news room</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Upcoming Community Event */}
      <Section spacing="md" background="transparent">
        <Container>
          <Card className="bg-gradient-to-r from-warning-50 to-orange-50 border-warning-200 border-2">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-2xl">🎉</span>
                    <Text variant="body-small" weight="semibold" color="warning" className="uppercase tracking-wide">
                      Coming Soon
                    </Text>
                  </div>
                  <Heading level={3} className="mb-2 text-warning-800">
                    Community Beta Launch Event
                  </Heading>
                  <Text color="muted" className="max-w-md">
                    Join us for our first virtual community gathering! Meet fellow community builders, 
                    share stories, and help shape the future of Kamunity together.
                  </Text>
                </div>
                
                <div className="text-center">
                  <div className="bg-white rounded-lg p-6 shadow-md border border-warning-200">
                    <Text variant="caption" color="muted" className="mb-2">Event starts in</Text>
                    <div className="flex gap-4 justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning-700">14</div>
                        <Text variant="caption" color="muted">Days</Text>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning-700">08</div>
                        <Text variant="caption" color="muted">Hours</Text>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning-700">42</div>
                        <Text variant="caption" color="muted">Minutes</Text>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 border-warning-300 text-warning-700 hover:bg-warning-50">
                      🔔 Notify Me
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>

      {/* Launch Funnel - Clear User Journey */}
      <LaunchFunnel onCreateRoom={() => setIsModalOpen(true)} />

      {/* Community Beta Phase */}
      <Section spacing="lg" background="primary">
        <Container>
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Heading level={3} className="mb-4 text-primary-700">
                Community Beta Phase
              </Heading>
              <Text className="mb-6 max-w-2xl mx-auto">
                We&apos;re preparing for our community beta phase, where we&apos;ll work closely with select 
                communities to refine and perfect the Kamunity experience. This isn&apos;t just about testing - 
                it&apos;s about partnerships. Together, we&apos;ll shape the future of community building.
              </Text>
              <Button variant="primary" size="lg">
                Join Kamunity
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Section>

      <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default HomePage;
