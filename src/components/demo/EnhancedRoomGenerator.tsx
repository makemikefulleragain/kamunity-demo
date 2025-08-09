'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Heading, Text, Flex } from '@/components/ui'
import { useAuth } from '@/lib/auth/auth-context'
import { demoAnalytics, trackRoomGeneration } from '@/lib/demo/analytics'
import { PricingFeedbackPopup } from './PricingFeedbackPopup'
import { ArrowRight, Users, Target, Lightbulb } from 'lucide-react'

interface EnhancedRoomGeneratorProps {
  onClose?: () => void
  triggerSource?: 'homepage' | 'news' | 'chat' | 'manual'
  initialContext?: string
}

interface RoomScope {
  name: string
  purpose: string
  targetAudience: string
  activities: string[]
  goals: string[]
  communityType: 'discussion' | 'action' | 'support' | 'learning' | 'creative'
}

export function EnhancedRoomGenerator({ onClose, triggerSource = 'manual', initialContext }: EnhancedRoomGeneratorProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<'interests' | 'scope' | 'review' | 'complete'>('interests')
  const [interests, setInterests] = useState<string[]>([])
  const [roomScope, setRoomScope] = useState<RoomScope>({
    name: '',
    purpose: '',
    targetAudience: '',
    activities: [],
    goals: [],
    communityType: 'discussion'
  })
  const [showPricingPopup, setShowPricingPopup] = useState(false)
  const [generatedRoom, setGeneratedRoom] = useState<any>(null)

  const interestOptions = [
    'Environmental Action', 'Local Politics', 'Community Gardens', 'Youth Programs',
    'Senior Support', 'Arts & Culture', 'Small Business', 'Education Reform',
    'Public Health', 'Transportation', 'Housing', 'Technology Ethics',
    'Social Justice', 'Mental Health', 'Food Security', 'Climate Action'
  ]

  const communityTypes = [
    { id: 'discussion', label: 'Discussion & Debate', icon: '💬', description: 'Share ideas and perspectives' },
    { id: 'action', label: 'Action & Organizing', icon: '🚀', description: 'Plan and execute community initiatives' },
    { id: 'support', label: 'Support & Mutual Aid', icon: '🤝', description: 'Help and support community members' },
    { id: 'learning', label: 'Learning & Education', icon: '📚', description: 'Share knowledge and skills' },
    { id: 'creative', label: 'Creative & Cultural', icon: '🎨', description: 'Express creativity and culture' }
  ]

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleScopeSubmit = async () => {
    if (!user) {
      alert('Please log in to create a room')
      return
    }

    // Capture interests and room scope for demo analytics
    demoAnalytics.captureInterests({
      passionAreas: interests,
      communityTypes: [roomScope.communityType],
      topicInterests: interests
    })

    // Track room generation
    trackRoomGeneration(`${roomScope.name}: ${roomScope.purpose}`)

    // Simulate room creation (in real app, this would call API)
    const newRoom = {
      id: `room_${Date.now()}`,
      name: roomScope.name,
      purpose: roomScope.purpose,
      scope: roomScope,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    }

    setGeneratedRoom(newRoom)
    setStep('complete')

    // Show pricing popup after room generation
    setTimeout(() => {
      setShowPricingPopup(true)
    }, 1000)
  }

  const renderInterestsStep = () => (
    <div>
      <Heading level={3} className="mb-4">What interests you most? 🌟</Heading>
      <Text variant="body-base" color="muted" className="mb-6">
        Select the areas you're passionate about. This helps us understand what kind of community you want to build.
      </Text>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {interestOptions.map((interest) => (
          <button
            key={interest}
            onClick={() => handleInterestToggle(interest)}
            className={`p-3 text-sm rounded-lg border transition-all text-left ${
              interests.includes(interest)
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      <Flex justify="between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => setStep('scope')}
          disabled={interests.length === 0}
        >
          Next: Define Room <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Flex>
    </div>
  )

  const renderScopeStep = () => (
    <div>
      <Heading level={3} className="mb-4">Define Your Community Room 🏠</Heading>
      <Text variant="body-base" color="muted" className="mb-6">
        Let's create a focused space for your community to connect and take action.
      </Text>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Room Name *</label>
          <input
            type="text"
            value={roomScope.name}
            onChange={(e) => setRoomScope(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Downtown Green Spaces Initiative"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Purpose & Mission *</label>
          <textarea
            value={roomScope.purpose}
            onChange={(e) => setRoomScope(prev => ({ ...prev, purpose: e.target.value }))}
            placeholder="What is this community trying to achieve? What problem are you solving?"
            className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Target Audience</label>
          <input
            type="text"
            value={roomScope.targetAudience}
            onChange={(e) => setRoomScope(prev => ({ ...prev, targetAudience: e.target.value }))}
            placeholder="Who would benefit from joining this community?"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Community Type *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {communityTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setRoomScope(prev => ({ ...prev, communityType: type.id as any }))}
                className={`p-4 rounded-lg border text-left transition-all ${
                  roomScope.communityType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{type.icon}</span>
                  <Text variant="body-small" weight="semibold">{type.label}</Text>
                </div>
                <Text variant="caption" color="muted">{type.description}</Text>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Flex justify="between" className="mt-8">
        <Button variant="outline" onClick={() => setStep('interests')}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => setStep('review')}
          disabled={!roomScope.name || !roomScope.purpose}
        >
          Review & Create <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Flex>
    </div>
  )

  const renderReviewStep = () => (
    <div>
      <Heading level={3} className="mb-4">Review Your Community Room 📋</Heading>
      <Text variant="body-base" color="muted" className="mb-6">
        Here's what you're creating. Ready to launch your community?
      </Text>

      <Card className="mb-6">
        <CardContent className="p-6">
          <Heading level={4} className="mb-3">{roomScope.name}</Heading>
          <Text variant="body-base" className="mb-4">{roomScope.purpose}</Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Text variant="body-small" weight="semibold" className="text-gray-600">Community Type:</Text>
              <Text variant="body-small">
                {communityTypes.find(t => t.id === roomScope.communityType)?.label}
              </Text>
            </div>
            {roomScope.targetAudience && (
              <div>
                <Text variant="body-small" weight="semibold" className="text-gray-600">Target Audience:</Text>
                <Text variant="body-small">{roomScope.targetAudience}</Text>
              </div>
            )}
          </div>

          <div className="mt-4">
            <Text variant="body-small" weight="semibold" className="text-gray-600">Your Interests:</Text>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((interest) => (
                <span key={interest} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Flex justify="between">
        <Button variant="outline" onClick={() => setStep('scope')}>
          Edit Details
        </Button>
        <Button variant="primary" onClick={handleScopeSubmit}>
          Create Community Room 🚀
        </Button>
      </Flex>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🎉</span>
      </div>
      <Heading level={3} className="mb-4">Community Room Created!</Heading>
      <Text variant="body-base" color="muted" className="mb-6">
        "{roomScope.name}" is now ready for your community to join and start making an impact together.
      </Text>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <Text variant="body-small" className="text-green-700 bg-green-50 p-3 rounded">
            🎯 <strong>Room Scope:</strong> {roomScope.purpose}
          </Text>
        </CardContent>
      </Card>

      <Flex gap="sm" justify="center">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => {
          // Navigate to the new room (in real app)
          console.log('Navigate to room:', generatedRoom?.id)
          onClose?.()
        }}>
          Visit Room
        </Button>
      </Flex>
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader className="border-b">
            <Flex justify="between" align="center">
              <div>
                <Heading level={2}>Create Your Community Room</Heading>
                <Text variant="body-small" color="muted">
                  Step {step === 'interests' ? '1' : step === 'scope' ? '2' : step === 'review' ? '3' : '4'} of 4
                </Text>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </Flex>
          </CardHeader>

          <CardContent className="p-6">
            {step === 'interests' && renderInterestsStep()}
            {step === 'scope' && renderScopeStep()}
            {step === 'review' && renderReviewStep()}
            {step === 'complete' && renderCompleteStep()}
          </CardContent>
        </Card>
      </div>

      <PricingFeedbackPopup
        isOpen={showPricingPopup}
        onClose={() => setShowPricingPopup(false)}
        roomScope={`${roomScope.name}: ${roomScope.purpose}`}
        roomName={roomScope.name}
      />
    </>
  )
}
