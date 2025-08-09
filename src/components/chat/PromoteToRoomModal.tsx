'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Text, Heading } from '@/components/ui/Typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Flex } from '@/components/ui/Layout'
import { cn } from '@/lib/utils'

interface PromoteToRoomModalProps {
  isOpen: boolean
  onClose: () => void
  chatContext: {
    id: string
    messageCount: number
    participants: number
    recentTopics: string[]
    keyMessages: string[]
  }
  onSubmitPromotion: (roomSpec: RoomPromotionRequest) => void
}

interface RoomPromotionRequest {
  chatId: string
  proposedName: string
  purpose: string
  targetAudience: string
  successCriteria: string
  additionalFeatures: string[]
  constraints?: string
  tone: 'formal' | 'casual' | 'playful' | 'professional'
}

type WorkflowStep = 'introduction' | 'clarification' | 'understanding' | 'confirmation' | 'submitted'

export const PromoteToRoomModal = ({
  isOpen,
  onClose,
  chatContext,
  onSubmitPromotion
}: PromoteToRoomModalProps) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('introduction')
  const [formData, setFormData] = useState<Partial<RoomPromotionRequest>>({
    chatId: chatContext.id,
    additionalFeatures: [],
    tone: 'casual'
  })
  const [proposedExtras, setProposedExtras] = useState<string[]>([])

  if (!isOpen) return null

  const handleNext = () => {
    const steps: WorkflowStep[] = ['introduction', 'clarification', 'understanding', 'confirmation', 'submitted']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleSubmit = () => {
    if (formData.proposedName && formData.purpose && formData.targetAudience && formData.successCriteria) {
      onSubmitPromotion(formData as RoomPromotionRequest)
      setCurrentStep('submitted')
    }
  }

  const generateProposedExtras = () => {
    const extras = []
    if (chatContext.messageCount > 50) {
      extras.push('Message archive and search functionality')
    }
    if (chatContext.participants > 10) {
      extras.push('Structured breakout sessions for focused discussions')
    }
    if (chatContext.recentTopics.length > 3) {
      extras.push('Topic-based channels within the room')
    }
    extras.push('Progress tracking and milestone celebrations')
    setProposedExtras(extras)
  }

  const renderIntroduction = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <Text className="font-medium text-blue-900">
          I'm here to help transform your active chat into a custom Focus Room: a digital environment built around conversations, community and impact, designed with transparency and iterative checks to ensure accuracy and alignment with your needs.
        </Text>
      </div>
      
      <div className="bg-amber-50 p-4 rounded-lg">
        <Heading level={4} className="text-amber-800 mb-2">Safeguards in Place</Heading>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• I'll summarise your objectives back to you and highlight assumptions</li>
          <li>• I'll propose 1–2 additional possibilities that align with your goals</li>
          <li>• I'll wait for your confirmation before building the full specification</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <Heading level={4} className="mb-2">Current Chat Context</Heading>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Text className="font-medium">Messages:</Text>
            <Text className="text-gray-600">{chatContext.messageCount}</Text>
          </div>
          <div>
            <Text className="font-medium">Participants:</Text>
            <Text className="text-gray-600">{chatContext.participants}</Text>
          </div>
        </div>
        {chatContext.recentTopics.length > 0 && (
          <div className="mt-3">
            <Text className="font-medium">Recent Topics:</Text>
            <div className="flex flex-wrap gap-2 mt-1">
              {chatContext.recentTopics.map((topic, index) => (
                <span key={index} className="px-2 py-1 bg-gray-200 rounded text-xs">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Flex justify="end" gap="sm">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleNext}>Let's Begin</Button>
      </Flex>
    </div>
  )

  const renderClarification = () => (
    <div className="space-y-6">
      <Heading level={3}>Clarifying Questions</Heading>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            1. Who is this new Focus Room for? (e.g. team type, organisation, project context)
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Describe your target audience..."
            value={formData.targetAudience || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            2. What do they want to achieve with it? (key outcomes, success criteria)
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Describe the goals and success metrics..."
            value={formData.successCriteria || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, successCriteria: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Proposed Room Name
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a name for your Focus Room..."
            value={formData.proposedName || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, proposedName: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Room Purpose (one-line statement)
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What is the main purpose of this room?"
            value={formData.purpose || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <Heading level={4} className="mb-3">Optional Preferences</Heading>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Tone & Style</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.tone}
              onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value as any }))}
            >
              <option value="casual">Casual & Friendly</option>
              <option value="professional">Professional</option>
              <option value="formal">Formal</option>
              <option value="playful">Playful & Creative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Constraints or Integration Requirements
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Any existing tools, systems, or constraints to consider..."
              value={formData.constraints || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, constraints: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <Flex justify="between">
        <Button variant="outline" onClick={() => setCurrentStep('introduction')}>Back</Button>
        <Button 
          onClick={() => {
            generateProposedExtras()
            handleNext()
          }}
          disabled={!formData.targetAudience || !formData.successCriteria || !formData.proposedName || !formData.purpose}
        >
          Continue
        </Button>
      </Flex>
    </div>
  )

  const renderUnderstanding = () => (
    <div className="space-y-6">
      <Heading level={3}>Check for Understanding</Heading>
      
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <Text className="font-medium text-blue-900 mb-2">Here's my understanding:</Text>
        <Text className="text-blue-800">
          You need a Focus Room called "{formData.proposedName}" for {formData.targetAudience}, 
          aiming to achieve {formData.successCriteria}.
        </Text>
      </div>

      {proposedExtras.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <Heading level={4} className="text-green-800 mb-2">Additional Value Opportunities</Heading>
          <Text className="text-green-700 mb-3">
            Based on your chat activity, you might also leverage this room to:
          </Text>
          <ul className="space-y-2">
            {proposedExtras.map((extra, index) => (
              <li key={index} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        additionalFeatures: [...(prev.additionalFeatures || []), extra]
                      }))
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        additionalFeatures: (prev.additionalFeatures || []).filter(f => f !== extra)
                      }))
                    }
                  }}
                />
                <Text className="text-green-700 text-sm">{extra}</Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-amber-50 p-4 rounded-lg">
        <Text className="font-medium text-amber-800">
          Does this capture your intent? Would you like to include the additional ideas above? 
          Or are there any other adjustments or additions before I proceed?
        </Text>
      </div>

      <Flex justify="between">
        <Button variant="outline" onClick={() => setCurrentStep('clarification')}>Back to Edit</Button>
        <Button onClick={handleNext}>Yes, This Looks Right</Button>
      </Flex>
    </div>
  )

  const renderConfirmation = () => (
    <div className="space-y-6">
      <Heading level={3}>Final Confirmation</Heading>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <Heading level={4} className="mb-3">Room Specification Summary</Heading>
        <div className="space-y-3 text-sm">
          <div>
            <Text className="font-medium">Room Name:</Text>
            <Text className="text-gray-700">{formData.proposedName}</Text>
          </div>
          <div>
            <Text className="font-medium">Purpose:</Text>
            <Text className="text-gray-700">{formData.purpose}</Text>
          </div>
          <div>
            <Text className="font-medium">Target Audience:</Text>
            <Text className="text-gray-700">{formData.targetAudience}</Text>
          </div>
          <div>
            <Text className="font-medium">Success Criteria:</Text>
            <Text className="text-gray-700">{formData.successCriteria}</Text>
          </div>
          <div>
            <Text className="font-medium">Tone:</Text>
            <Text className="text-gray-700 capitalize">{formData.tone}</Text>
          </div>
          {formData.additionalFeatures && formData.additionalFeatures.length > 0 && (
            <div>
              <Text className="font-medium">Additional Features:</Text>
              <ul className="text-gray-700 ml-4">
                {formData.additionalFeatures.map((feature, index) => (
                  <li key={index} className="list-disc">{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <Text className="font-medium text-blue-900 mb-2">What happens next:</Text>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Your chat will be reviewed for promotion to a Focus Room</li>
          <li>• A detailed room specification will be generated</li>
          <li>• All current participants will be invited to join the new room</li>
          <li>• Chat history will be preserved and accessible in the room context</li>
        </ul>
      </div>

      <Flex justify="between">
        <Button variant="outline" onClick={() => setCurrentStep('understanding')}>Back to Review</Button>
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
          Submit Room Request
        </Button>
      </Flex>
    </div>
  )

  const renderSubmitted = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-2xl">✨</span>
      </div>
      
      <div>
        <Heading level={3} className="text-green-800 mb-2">Room Request Submitted!</Heading>
        <Text className="text-gray-600">
          Your request to promote this chat to "{formData.proposedName}" has been submitted for review.
        </Text>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <Text className="text-green-800 text-sm">
          Thank you for taking the time to provide detailed information. 
          We're excited to see how this Focus Room will support your goals and ambitions! ✨
        </Text>
      </div>

      <Button onClick={onClose} className="w-full">
        Close
      </Button>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Promote Chat to Focus Room
            <span className="text-sm font-normal text-gray-500">
              Step {['introduction', 'clarification', 'understanding', 'confirmation', 'submitted'].indexOf(currentStep) + 1} of 5
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 'introduction' && renderIntroduction()}
          {currentStep === 'clarification' && renderClarification()}
          {currentStep === 'understanding' && renderUnderstanding()}
          {currentStep === 'confirmation' && renderConfirmation()}
          {currentStep === 'submitted' && renderSubmitted()}
        </CardContent>
      </Card>
    </div>
  )
}
