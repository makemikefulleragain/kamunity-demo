'use client'

import { useState, useEffect } from 'react'
import { Container, Section, Grid, Flex } from '@/components/ui/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'
import SummaryPanel from '@/components/summaries/SummaryPanel'
import { ReactionBar } from '@/components/reactions/ReactionBar'
import { cn } from '@/lib/utils'
import { Community, FederationMetrics, FEDERATION_TYPES, VISIBILITY_TYPES } from '@/types/communities'

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState<Community[]>([])
  const [federationMetrics, setFederationMetrics] = useState<Record<string, FederationMetrics>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filterType, setFilterType] = useState<'all' | 'healthy' | 'growing' | 'forming'>('all')

  // Mock data for development - replace with real API calls
  useEffect(() => {
    const mockCommunities: Community[] = [
      {
        id: 'comm-1',
        name: 'Climate Action Network',
        description: 'A federation of environmental clubs working on local climate solutions and policy advocacy.',
        imageUrl: undefined,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        federationType: 'cooperative',
        minimumClubs: 5,
        isActive: true,
        governanceRules: { consensusThreshold: 0.6, votingPeriod: 7 },
        featuredContent: 'Join our upcoming Climate Summit planning sessions!',
        tags: ['climate', 'environment', 'policy', 'sustainability'],
        visibility: 'public',
        clubs: [
          { id: 'club-1', name: 'Urban Gardens Initiative', status: 'active' },
          { id: 'club-2', name: 'Renewable Energy Advocates', status: 'active' },
          { id: 'club-3', name: 'Green Transportation Hub', status: 'active' },
          { id: 'club-4', name: 'Climate Policy Research', status: 'forming' },
          { id: 'club-5', name: 'Youth Climate Leaders', status: 'active' },
          { id: 'club-6', name: 'Corporate Sustainability', status: 'active' }
        ] as any
      },
      {
        id: 'comm-2',
        name: 'Digital Equity Coalition',
        description: 'Bridging the digital divide through community-driven technology access and education programs.',
        imageUrl: undefined,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        federationType: 'democratic',
        minimumClubs: 3,
        isActive: true,
        governanceRules: { consensusThreshold: 0.5, votingPeriod: 5 },
        featuredContent: 'New laptop donation program launching next month!',
        tags: ['technology', 'education', 'equity', 'access'],
        visibility: 'public',
        clubs: [
          { id: 'club-7', name: 'Community Tech Centers', status: 'active' },
          { id: 'club-8', name: 'Digital Literacy Training', status: 'active' },
          { id: 'club-9', name: 'Senior Tech Support', status: 'active' },
          { id: 'club-10', name: 'Youth Coding Bootcamp', status: 'forming' }
        ] as any
      },
      {
        id: 'comm-3',
        name: 'Local Food Systems',
        description: 'Building resilient food networks through urban farming, food justice, and community kitchens.',
        imageUrl: undefined,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        federationType: 'consensus',
        minimumClubs: 7,
        isActive: true,
        governanceRules: { consensusThreshold: 0.9, votingPeriod: 10 },
        featuredContent: 'Harvest festival planning - all clubs welcome to participate!',
        tags: ['food', 'agriculture', 'justice', 'community'],
        visibility: 'public',
        clubs: [
          { id: 'club-11', name: 'Community Gardens Network', status: 'active' },
          { id: 'club-12', name: 'Food Justice Advocates', status: 'active' },
          { id: 'club-13', name: 'Urban Farming Collective', status: 'active' }
        ] as any
      }
    ]

    const mockMetrics: Record<string, FederationMetrics> = {
      'comm-1': {
        communityId: 'comm-1',
        totalClubs: 6,
        activeClubs: 5,
        totalMembers: 127,
        averageRoomsPerClub: 4.2,
        federationHealth: 'healthy',
        eligibleForExpansion: true
      },
      'comm-2': {
        communityId: 'comm-2',
        totalClubs: 4,
        activeClubs: 3,
        totalMembers: 89,
        averageRoomsPerClub: 3.8,
        federationHealth: 'healthy',
        eligibleForExpansion: true
      },
      'comm-3': {
        communityId: 'comm-3',
        totalClubs: 3,
        activeClubs: 3,
        totalMembers: 45,
        averageRoomsPerClub: 2.7,
        federationHealth: 'growing',
        eligibleForExpansion: false
      }
    }

    setCommunities(mockCommunities)
    setFederationMetrics(mockMetrics)
    setIsLoading(false)
  }, [])

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = !searchQuery || 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => community.tags.includes(tag))

    const metrics = federationMetrics[community.id]
    const matchesFilter = filterType === 'all' || 
      (filterType === 'healthy' && metrics?.federationHealth === 'healthy') ||
      (filterType === 'growing' && metrics?.federationHealth === 'growing') ||
      (filterType === 'forming' && (metrics?.federationHealth === 'struggling' || metrics?.federationHealth === 'critical'))

    return matchesSearch && matchesTags && matchesFilter
  })

  const allTags = Array.from(new Set(communities.flatMap(c => c.tags)))

  const getFederationHealthColor = (health: FederationMetrics['federationHealth']) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 text-green-700 border-green-200'
      case 'growing': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'struggling': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getFederationTypeInfo = (type: Community['federationType']) => {
    return FEDERATION_TYPES[type]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Container size="full" className="py-6">
        {/* Header */}
        <Section spacing="sm">
          <Flex justify="between" align="center" className="mb-6">
            <div>
              <Heading level={1} className="text-neutral-900 mb-2">
                Communities
              </Heading>
              <Text variant="body-large" color="muted">
                Federated networks of clubs working together for collective impact
              </Text>
            </div>
            <Button variant="primary" className="shadow-sm">
              Create Community
            </Button>
          </Flex>
        </Section>

        <Grid cols={12} gap="lg">
          {/* Left Sidebar - AI Summary & Filters */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6">
              <SummaryPanel 
                sourceType="communities"
                sourceId="all-communities"
              />

              {/* Search & Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Discover Communities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <input
                      type="text"
                      placeholder="Search communities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Federation Health Filter */}
                  <div>
                    <Text variant="body-small" weight="medium" className="mb-2">
                      Federation Health
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'healthy', 'growing', 'forming'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setFilterType(filter as any)}
                          className={cn(
                            'px-3 py-1 text-sm rounded-full border transition-colors',
                            filterType === filter
                              ? 'bg-primary-100 text-primary-700 border-primary-300'
                              : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                          )}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <Text variant="body-small" weight="medium" className="mb-2">
                      Topics
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTags(prev => 
                              prev.includes(tag) 
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag]
                            )
                          }}
                          className={cn(
                            'px-2 py-1 text-xs rounded-full border transition-colors',
                            selectedTags.includes(tag)
                              ? 'bg-secondary-100 text-secondary-700 border-secondary-300'
                              : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Communities Grid */}
            <div className="space-y-6">
              {isLoading ? (
                <Card>
                  <CardContent className="py-8">
                    <Text color="muted" className="text-center">
                      Loading communities...
                    </Text>
                  </CardContent>
                </Card>
              ) : filteredCommunities.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <Text color="muted" className="text-center">
                      No communities found matching your criteria.
                    </Text>
                  </CardContent>
                </Card>
              ) : (
                filteredCommunities.map(community => {
                  const metrics = federationMetrics[community.id]
                  const federationInfo = getFederationTypeInfo(community.federationType)

                  return (
                    <Card key={community.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Grid cols={12} gap="md">
                          {/* Community Info */}
                          <div className="col-span-12 lg:col-span-8">
                            <Flex justify="between" align="start" className="mb-4">
                              <div className="flex-1">
                                <Flex align="center" className="mb-2">
                                  <Heading level={3} className="text-neutral-900 mr-3">
                                    {community.name}
                                  </Heading>
                                  <span className={cn(
                                    'px-2 py-1 text-xs font-medium rounded-full border',
                                    getFederationHealthColor(metrics?.federationHealth || 'critical')
                                  )}>
                                    {metrics?.federationHealth || 'Unknown'} Federation
                                  </span>
                                </Flex>
                                
                                <Text className="text-neutral-700 mb-3">
                                  {community.description}
                                </Text>

                                {/* Federation Type & Governance */}
                                <Flex align="center" gap="md" className="mb-3">
                                  <div className="flex items-center">
                                    <Text variant="body-small" color="muted" className="mr-1">
                                      Type:
                                    </Text>
                                    <Text variant="body-small" weight="medium">
                                      {federationInfo.label}
                                    </Text>
                                  </div>
                                  <div className="flex items-center">
                                    <Text variant="body-small" color="muted" className="mr-1">
                                      Visibility:
                                    </Text>
                                    <Text variant="body-small" weight="medium">
                                      {VISIBILITY_TYPES[community.visibility].label}
                                    </Text>
                                  </div>
                                </Flex>

                                {/* Featured Content */}
                                {community.featuredContent && (
                                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-3">
                                    <Text variant="body-small" className="text-primary-800">
                                      📢 {community.featuredContent}
                                    </Text>
                                  </div>
                                )}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {community.tags.map(tag => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </Flex>

                            {/* Action Buttons */}
                            <Flex align="center" gap="sm">
                              <Button variant="primary" size="sm">
                                Join Community
                              </Button>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button variant="ghost" size="sm">
                                Share
                              </Button>
                            </Flex>
                          </div>

                          {/* Metrics Sidebar */}
                          <div className="col-span-12 lg:col-span-4">
                            <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
                              <div>
                                <Text variant="body-small" weight="medium" className="text-neutral-900 mb-2">
                                  Federation Metrics
                                </Text>
                                
                                <div className="space-y-2">
                                  <Flex justify="between">
                                    <Text variant="body-small" color="muted">Clubs</Text>
                                    <Text variant="body-small" weight="medium">
                                      {metrics?.activeClubs || 0}/{metrics?.totalClubs || 0}
                                    </Text>
                                  </Flex>
                                  <Flex justify="between">
                                    <Text variant="body-small" color="muted">Members</Text>
                                    <Text variant="body-small" weight="medium">
                                      {metrics?.totalMembers || 0}
                                    </Text>
                                  </Flex>
                                  <Flex justify="between">
                                    <Text variant="body-small" color="muted">Avg Rooms/Club</Text>
                                    <Text variant="body-small" weight="medium">
                                      {metrics?.averageRoomsPerClub?.toFixed(1) || '0.0'}
                                    </Text>
                                  </Flex>
                                </div>
                              </div>

                              {metrics?.eligibleForExpansion && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <Text variant="body-small" className="text-green-800">
                                    🌱 Ready for expansion
                                  </Text>
                                </div>
                              )}

                              {/* Recent Activity */}
                              <div>
                                <Text variant="body-small" weight="medium" className="text-neutral-900 mb-2">
                                  Recent Activity
                                </Text>
                                <Text variant="body-small" color="muted">
                                  Updated {new Date(community.updatedAt).toLocaleDateString()}
                                </Text>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </Grid>
      </Container>
    </div>
  )
}

export default CommunitiesPage
