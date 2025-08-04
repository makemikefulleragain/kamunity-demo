# Archived UI Patterns & Components

*Documented during August 2025 codebase cleanup for future reference*

## Communities Page - Excellent UI Patterns to Reuse

### 1. **Gradient Header Section** (Lines 167-208)
```tsx
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
```

**Why This is Great:**
- Beautiful gradient background with subtle colors
- Perfect information hierarchy with title, status badge, description, tags, and stats
- Clean action buttons positioned well
- Responsive layout with flex

### 2. **Metrics Dashboard Cards** (Lines 212-256)
```tsx
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
```

**Why This is Great:**
- Clean 4-column metrics dashboard
- Color-coded values (health score uses dynamic colors)
- Consistent card styling with centered content
- Perfect for showing key performance indicators

### 3. **Status Color Helper Functions** (Lines 140-153)
```tsx
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
```

**Why This is Great:**
- Consistent color coding across the platform
- Health score uses logical thresholds
- Reusable utility functions

### 4. **Featured Content Card** (Lines 260-278)
```tsx
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
```

**Why This is Great:**
- Conditional rendering for optional content
- Clean card with emoji icon in title
- Integrated reaction system
- Good spacing and typography

### 5. **Club Cards Grid** (Lines 287-300+)
```tsx
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
      {/* More content... */}
    </Card>
  ))}
</Grid>
```

**Why This is Great:**
- Hover effects with smooth transitions
- Status badges with consistent styling
- Clean two-column grid layout
- Good information hierarchy

### 6. **Loading State Pattern** (Lines 112-127)
```tsx
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
```

**Why This is Great:**
- Skeleton loading with pulse animation
- Matches the actual layout structure
- Professional loading experience

## Future Use Cases

These patterns would be perfect for:
- **Room detail pages** - Use gradient header and metrics cards
- **Club detail pages** - Adapt the layout structure
- **Dashboard pages** - Metrics cards are perfect for analytics
- **Profile pages** - Header pattern works well for user profiles
- **Any content with status** - Status color functions are very reusable

## Key Design Principles Demonstrated

1. **Consistent Color Coding** - Status and health indicators
2. **Information Hierarchy** - Title → Description → Tags → Stats → Actions
3. **Responsive Design** - Grid layouts that adapt
4. **Interactive Elements** - Hover states and transitions
5. **Loading States** - Skeleton patterns that match content
6. **Conditional Rendering** - Clean optional content handling
