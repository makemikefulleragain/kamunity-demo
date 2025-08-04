'use client'

import { useState, useEffect } from 'react'
import { Container, Section, Grid, Flex } from '@/components/ui/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'
import SummaryPanel from '@/components/summaries/SummaryPanel'
import { ReactionBar } from '@/components/reactions/ReactionBar'
import { cn } from '@/lib/utils'
import { Community, Club, FederationMetrics } from '@/types/communities'

interface CommunityPageProps {
  params: { id: string }
}

const CommunityDetailPage: React.FC<CommunityPageProps> = ({ params }) => {
  const [community, setCommunity] = useState<Community | null>(null)
  const [federationMetrics, setFederationMetrics] = useState<FederationMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for development - replace with real API calls
  useEffect(() => {
    const mockCommunity: Community = {
      id: params.id,
      name: 'Climate Action Network',
      description: 'A federation of environmental clubs working on local climate solutions and policy advocacy. We coordinate efforts across multiple focus areas to create meaningful environmental impact.',
      imageUrl: undefined,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      federationType: 'cooperative',
      minimumClubs: 5,
      isActive: true,
      governanceRules: { 
        consensusThreshold: 0.6, 
        votingPeriod: 7,
        proposalRequirements: 'Any club can propose initiatives',
        decisionMaking: 'Consensus with 60% agreement threshold'
      },
      featuredContent: 'Join our upcoming Climate Summit planning sessions! We\'re organizing a city-wide event to showcase local climate solutions.',
      tags: ['climate', 'environment', 'policy', 'sustainability', 'advocacy'],
      visibility: 'public',
      clubs: [
        { 
          id: 'club-1', 
          name: 'Urban Gardens Initiative', 
          status: 'active',
          memberCount: 23,
          roomCount: 8,
          description: 'Creating sustainable food systems through community gardens'
        },
        { 
          id: 'club-2', 
          name: 'Renewable Energy Advocates', 
          status: 'active',
          memberCount: 31,
          roomCount: 6,
          description: 'Promoting solar and wind energy adoption'
        },
        { 
          id: 'club-3', 
          name: 'Green Transportation Hub', 
          status: 'active',
          memberCount: 18,
          roomCount: 4,
          description: 'Advancing cycling and electric vehicle infrastructure'
        },
        { 
          id: 'club-4', 
          name: 'Climate Policy Research', 
          status: 'forming',
          memberCount: 12,
          roomCount: 3,
          description: 'Researching and advocating for climate policy'
        },
        { 
          id: 'club-5', 
          name: 'Youth Climate Leaders', 
          status: 'active',
          memberCount: 27,
          roomCount: 5,
          description: 'Empowering young people in climate action'
        },
        { 
          id: 'club-6', 
          name: 'Corporate Sustainability', 
          status: 'active',
          memberCount: 15,
          roomCount: 3,
          description: 'Working with businesses on sustainability practices'
        }
      ] as any
    }

    const mockMetrics: FederationMetrics = {
      healthScore: 0.85,
      engagementLevel: 'high',
      diversityIndex: 0.78,
      collaborationScore: 0.92,
      totalMembers: 126,
      activeClubs: 5,
      totalRooms: 29,
      monthlyGrowth: 0.15
    }

    setCommunity(mockCommunity)
    setFederationMetrics(mockMetrics)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <Container>
        <Section>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Section>
      </Container>
    )
  }

  if (!community) {
    return (
      <Container>
        <Section>
          <Heading level={1}>Community Not Found</Heading>
          <Text>The community you're looking for doesn't exist or has been removed.</Text>
        </Section>
      </Container>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'forming': return 'text-yellow-600 bg-yellow-50'
      case 'dormant': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Container>
      {/* Community Header */}
      <Section>
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-2">
            <a href="/communities" className="hover:text-blue-600">Communities</a>
            <span className="mx-2">→</span>
            <span>{community.name}</span>
          </nav>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Heading level={1} className="text-3xl font-bold text-gray-900">
                  {community.name}
                </Heading>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium',
                  community.isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'
                )}>
                  {community.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <Text className="text-lg text-gray-700 mb-6 max-w-3xl">
                {community.description}
              </Text>

              <div className="flex flex-wrap gap-2 mb-6">
                {community.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>🏛️ {community.federationType} governance</span>
                <span>👥 {federationMetrics?.totalMembers} total members</span>
                <span>🏢 {federationMetrics?.activeClubs} active clubs</span>
                <span>🏠 {federationMetrics?.totalRooms} focus rooms</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline">Join Community</Button>
              <Button>Start New Club</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Federation Health Metrics */}
      <Section>
        <Grid cols={4} gap={6} className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className={cn('text-3xl font-bold', getHealthColor(federationMetrics?.healthScore || 0))}>
                  {Math.round((federationMetrics?.healthScore || 0) * 100)}%
                </div>
                <Text className="text-sm text-gray-600 mt-1">Health Score</Text>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round((federationMetrics?.diversityIndex || 0) * 100)}%
                </div>
                <Text className="text-sm text-gray-600 mt-1">Diversity Index</Text>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((federationMetrics?.collaborationScore || 0) * 100)}%
                </div>
                <Text className="text-sm text-gray-600 mt-1">Collaboration</Text>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  +{Math.round((federationMetrics?.monthlyGrowth || 0) * 100)}%
                </div>
                <Text className="text-sm text-gray-600 mt-1">Monthly Growth</Text>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Featured Content */}
      {community.featuredContent && (
        <Section>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>📌 Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-lg">{community.featuredContent}</Text>
              <div className="mt-4">
                <ReactionBar 
                  contentId={community.id}
                  contentType="community"
                  reactions={[]}
                />
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* Member Clubs */}
      <Section>
        <div className="flex items-center justify-between mb-6">
          <Heading level={2}>Member Clubs ({community.clubs.length})</Heading>
          <Button variant="outline">View All Clubs</Button>
        </div>

        <Grid cols={2} gap={6} className="mb-8">
          {community.clubs.map(club => (
            <Card key={club.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{club.name}</CardTitle>
                    <Text className="text-sm text-gray-600 mt-1">{club.description}</Text>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getStatusColor(club.status)
                  )}>
                    {club.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>👥 {club.memberCount} members</span>
                  <span>🏠 {club.roomCount} rooms</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Club
                  </Button>
                  <Button size="sm" className="flex-1">
                    Join Club
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* Governance Information */}
      <Section>
        <Card>
          <CardHeader>
            <CardTitle>🏛️ Governance & Decision Making</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap={6}>
              <div>
                <Text className="font-medium text-gray-900 mb-2">Federation Type</Text>
                <Text className="capitalize">{community.federationType}</Text>
              </div>
              <div>
                <Text className="font-medium text-gray-900 mb-2">Consensus Threshold</Text>
                <Text>{Math.round((community.governanceRules.consensusThreshold || 0) * 100)}% agreement required</Text>
              </div>
              <div>
                <Text className="font-medium text-gray-900 mb-2">Voting Period</Text>
                <Text>{community.governanceRules.votingPeriod} days</Text>
              </div>
              <div>
                <Text className="font-medium text-gray-900 mb-2">Minimum Clubs</Text>
                <Text>{community.minimumClubs} clubs required</Text>
              </div>
            </Grid>
          </CardContent>
        </Card>
      </Section>

      {/* AI Summary Panel */}
      <Section>
        <SummaryPanel 
          sourceType="community" 
          sourceId={community.id}
          title="Community AI Summary"
        />
      </Section>
    </Container>
  )
}

export default CommunityDetailPage
