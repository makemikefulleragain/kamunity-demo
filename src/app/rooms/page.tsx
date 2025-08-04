"use client";

import { useState, useMemo } from 'react';
import { 
  Container, 
  Section, 
  Heading, 
  Text 
} from '@/components/ui';
import Card from '@/components/Card';
import KaiCharacter from '@/components/KaiCharacter';
import SummaryPanel from '@/components/summaries/SummaryPanel';

const mockFocusData = [
  {
    title: 'Sustainable Urban Farming',
    description: 'A space to discuss and plan community gardens, vertical farming, and local food initiatives.',
    link: '/focus/1',
    category: 'Active',
  },
  {
    title: 'AI in Education',
    description: 'Collaborate on how to ethically and effectively integrate AI tools into classrooms and learning platforms.',
    link: '/focus/2',
    category: 'Active',
  },
  {
    title: 'Mental Health & Wellness',
    description: 'A supportive environment for sharing resources, strategies, and support for mental well-being.',
    link: '/focus/3',
    category: 'New',
  },
  {
    title: 'Open Source Project Incubator',
    description: 'Join forces with other developers to build and launch new open-source software for social good.',
    link: '/focus/4',
    category: 'New',
  },
  {
    title: 'Archived: Local History Digitization',
    description: 'This project successfully digitized over 1,000 historical photos for the town library.',
    link: '/focus/5',
    category: 'Archived',
  },
];

const FocusPage = () => {
  const [activeCategory, setActiveCategory] = useState('Active');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFocusData = useMemo(() => {
    return mockFocusData.filter(room => {
      const matchesCategory = activeCategory === 'All' || room.category === activeCategory;
      const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            room.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const categories = ['All', 'Active', 'New', 'Archived'];

  return (
    <>
      {/* Hero Section */}
      <Section spacing="lg" className="bg-gradient-to-br from-primary-50/70 to-secondary-50/70">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Mobile: Image First - Desktop: Right Column (1/3 width) */}
            <div className="lg:col-span-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-64 h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center shadow-lg">
                {/* Focus Rooms themed illustration */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <Text variant="body-small" className="font-medium text-primary-700">
                    FOCUS
                  </Text>
                  <Text variant="body-small" color="muted" className="mt-1">
                    Ideas to action
                  </Text>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-secondary-400 rounded-full opacity-60"></div>
                <div className="absolute bottom-6 left-4 w-2 h-2 bg-primary-400 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-secondary-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Mobile: Text Second - Desktop: Left Column (2/3 width) */}
            <div className="lg:col-span-2 lg:order-1">
              <Heading level={1} className="mb-4 text-center lg:text-left">
                🎯 Focus Rooms - Where Ideas Become Action
              </Heading>
              <Text variant="body-large" color="muted" className="mb-6 text-center lg:text-left">
                Discover active community projects, join collaborative spaces, and turn your ideas into impactful action with like-minded people.
              </Text>
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <Text variant="body-small" color="muted">Discover</Text>
                </div>
                <div className="w-8 h-1 bg-success-500"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <Text variant="body-small" color="muted">Connect</Text>
                </div>
                <div className="w-8 h-1 bg-primary-500"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm ring-4 ring-primary-200">3</div>
                  <Text variant="body-small" className="font-medium text-primary-600">Create</Text>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Kai's Community Focus Summary */}
      <Section spacing="lg">
        <Container>
          <SummaryPanel onFilterChange={(timeframe, category) => {
            // Handle filter changes for focus rooms-specific content
            console.log('Focus Rooms filters changed:', { timeframe, category });
          }} />
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container>
          {/* Filter & Search Controls */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${ 
                activeCategory === category 
                ? 'bg-kamunity-blue text-white shadow'
                : 'text-kamunity-dark hover:bg-gray-200'
              }`}>
              {category}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-kamunity-gold focus:border-kamunity-gold w-full md:w-64"
          />
        </div>
      </div>

      {/* Focus Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFocusData.length > 0 ? (
          filteredFocusData.map((room) => (
            <Card 
              key={room.link}
              title={room.title}
              description={room.description}
              link={room.link}
              linkText="Join Room"
            />
          ))
        ) : (
          <div className="md:col-span-3">
            <KaiCharacter
              variant="card"
              expression="encouraging"
              size="lg"
              title="Ready to Start Something Amazing?"
              message="No rooms match your search right now, but that just means there's space for your brilliant ideas! Every great community project starts with someone brave enough to take the first step."
              actionButton={{
                text: "🚀 Create Your First Room",
                onClick: () => window.location.href = '/rooms/generate',
                variant: 'primary'
              }}
            />
          </div>
        )}
      </div>
        </Container>
      </Section>
    </>
  );
};

export default FocusPage;
