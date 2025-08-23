'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { trackPageView, trackButtonClick } from '@/lib/demo/analytics';
import { EnhancedRoomGenerator } from '@/components/demo/EnhancedRoomGenerator';

interface PerspectiveCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  destination: string;
  destinationType: 'route' | 'modal';
  color: string;
  capability: 'low' | 'medium' | 'high' | 'expert' | 'neutral';
}

const perspectives: PerspectiveCard[] = [
  {
    id: 'new-here',
    title: "I'm New Here",
    description: "Browse community news and learn what Kamunity is all about. Perfect for getting oriented.",
    emoji: "🌱",
    destination: "/news",
    destinationType: 'route',
    color: "from-blue-400 to-blue-600",
    capability: 'low'
  },
  {
    id: 'ready-connect',
    title: "I'm Ready to Connect",
    description: "I&apos;m ready to connect with others and participate in meaningful conversations and meet community members. Start building relationships.",
    emoji: "💬",
    destination: "/chat",
    destinationType: 'route',
    color: "from-indigo-400 to-indigo-600",
    capability: 'medium'
  },
  {
    id: 'want-lead',
    title: "I Want to Lead",
    description: "Create your own focus room and bring people together around shared interests.",
    emoji: "🚀",
    destination: "room-generator",
    destinationType: 'modal',
    color: "from-green-400 to-green-600",
    capability: 'high'
  },
  {
    id: 'share-skills',
    title: "I Have Skills to Share",
    description: "Contribute your expertise and exchange value with the community.",
    emoji: "✨",
    destination: "/values-exchange",
    destinationType: 'route',
    color: "from-purple-400 to-purple-600",
    capability: 'expert'
  }
];

const neutralOption: PerspectiveCard = {
  id: 'just-browsing',
  title: "Just Browsing",
  description: "No pressure, no expectations. Explore Kamunity at your own pace and see what resonates with you.",
  emoji: "👀",
  destination: "/demo",
  destinationType: 'route',
  color: "from-gray-300 to-gray-500",
  capability: 'neutral'
};

const WelcomePage = () => {
  const router = useRouter();
  const [showRoomGenerator, setShowRoomGenerator] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    trackPageView('welcome');
  }, []);

  const handlePerspectiveClick = (perspective: PerspectiveCard) => {
    // Track the perspective choice
    trackButtonClick(`perspective_${perspective.id}`, 'welcome');

    // Store perspective choice in session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userPerspective', perspective.id);
      sessionStorage.setItem('userCapability', perspective.capability);
    }

    // Navigate or show modal
    if (perspective.destinationType === 'modal') {
      setShowRoomGenerator(true);
    } else {
      router.push(perspective.destination);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Section 
        spacing="xl" 
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 relative overflow-hidden"
      >
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl" />
        
        <Container className="relative z-10">
          <Flex direction="col" align="center" justify="center" className="text-center py-12">
            <Heading level={1} variant="display" className="text-gray-800 mb-6 max-w-3xl">
              Welcome to Kamunity - What&apos;s Your Perspective?
            </Heading>
            
            <Text variant="body-large" className="text-gray-700 mb-8 max-w-2xl">
              Every journey starts with a single step. Choose the door that best matches where you are right now, 
              and we&apos;ll guide you to where you want to be.
            </Text>
          </Flex>
        </Container>
      </Section>

      {/* Perspective Cards Section */}
      <Section spacing="lg" background="white">
        <Container>
          {/* 4 Main Perspective Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {perspectives.map((perspective) => (
              <Card
                key={perspective.id}
                className={`
                  relative overflow-hidden border-2 transition-all duration-300 cursor-pointer
                  ${hoveredCard === perspective.id ? 'scale-105 shadow-2xl border-opacity-0' : 'border-gray-200 hover:border-gray-300'}
                `}
                onMouseEnter={() => setHoveredCard(perspective.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handlePerspectiveClick(perspective)}
              >
                {/* Gradient Background on Hover */}
                <div 
                  className={`
                    absolute inset-0 bg-gradient-to-br ${perspective.color} 
                    transition-opacity duration-300
                    ${hoveredCard === perspective.id ? 'opacity-10' : 'opacity-0'}
                  `}
                />
                
                <CardContent className="p-6 relative z-10">
                  {/* Emoji and Icons */}
                  <div className="text-center mb-4">
                    <span className="text-4xl block mb-3">{perspective.emoji}</span>
                    <div className="flex justify-center items-center gap-1 text-2xl">
                      <span>💡</span>
                      <span>🚪</span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <Heading level={3} className="text-lg mb-3 text-center">
                    {perspective.title}
                  </Heading>
                  
                  {/* Description */}
                  <Text variant="body-small" color="muted" className="text-center mb-4">
                    {perspective.description}
                  </Text>
                  
                  {/* Enter Button */}
                  <Button
                    variant={hoveredCard === perspective.id ? "primary" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    Enter Here →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Neutral Option - Full Width */}
          <Card
            className={`
              relative overflow-hidden border-2 transition-all duration-300 cursor-pointer
              ${hoveredCard === neutralOption.id ? 'scale-[1.02] shadow-xl border-opacity-0' : 'border-gray-200 hover:border-gray-300'}
            `}
            onMouseEnter={() => setHoveredCard(neutralOption.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handlePerspectiveClick(neutralOption)}
          >
            {/* Gradient Background on Hover */}
            <div 
              className={`
                absolute inset-0 bg-gradient-to-br ${neutralOption.color} 
                transition-opacity duration-300
                ${hoveredCard === neutralOption.id ? 'opacity-5' : 'opacity-0'}
              `}
            />
            
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left Side - Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <span className="text-4xl">{neutralOption.emoji}</span>
                    <div className="flex items-center gap-1 text-2xl">
                      <span>💡</span>
                      <span>🚪</span>
                    </div>
                  </div>
                  
                  <Heading level={3} className="text-xl mb-2">
                    {neutralOption.title}
                  </Heading>
                  
                  <Text variant="body-base" color="muted">
                    {neutralOption.description}
                  </Text>
                </div>
                
                {/* Right Side - Button */}
                <div>
                  <Button
                    variant={hoveredCard === neutralOption.id ? "primary" : "outline"}
                    size="lg"
                    className="whitespace-nowrap"
                  >
                    Enter Here →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <div className="text-center mt-12">
            <Text variant="body-large" className="text-gray-700 mb-2">
              Thank you for joining us! 🙏
            </Text>
            <Text variant="body-base" color="muted">
              Choose your door into the Kamunity and begin your journey
            </Text>
          </div>
        </Container>
      </Section>

      {/* Room Generator Modal */}
      {showRoomGenerator && (
        <EnhancedRoomGenerator
          onClose={() => setShowRoomGenerator(false)}
        />
      )}
    </>
  );
};

export default WelcomePage;
