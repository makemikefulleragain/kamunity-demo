'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Heading, Text, Flex } from '@/components/ui'
import { X, DollarSign, Zap, Users, Lightbulb } from 'lucide-react'
import { trackPricingFeedback } from '@/lib/demo/analytics'

interface PricingFeedbackPopupProps {
  isOpen: boolean
  onClose: () => void
  roomScope: string
  roomName?: string
}

interface PricingOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  details: string[]
  popular?: boolean
}

const pricingOptions: PricingOption[] = [
  {
    id: 'free_ad_supported',
    title: 'Free with Ads & Data',
    description: 'Free platform supported by advertising and anonymized data insights',
    icon: <Zap className="w-5 h-5" />,
    details: [
      'Unlimited room creation and participation',
      'Community-driven moderation',
      'Non-intrusive advertising',
      'Anonymized usage analytics for platform improvement',
      'Basic community features'
    ]
  },
  {
    id: 'monthly_subscription',
    title: 'Monthly Subscription',
    description: 'Ad-free experience with premium features',
    icon: <DollarSign className="w-5 h-5" />,
    details: [
      'Ad-free experience',
      'Priority customer support',
      'Advanced room customization',
      'Enhanced privacy controls',
      'Early access to new features'
    ],
    popular: true
  },
  {
    id: 'activity_quota',
    title: 'Activity-Based Quota',
    description: 'Pay based on your community engagement level',
    icon: <Users className="w-5 h-5" />,
    details: [
      'Free tier for casual participation',
      'Scaled pricing based on room creation and activity',
      'Support community initiatives',
      'Transparent usage tracking',
      'Flexible monthly limits'
    ]
  },
  {
    id: 'other',
    title: 'Other Ideas',
    description: 'Share your thoughts on alternative pricing models',
    icon: <Lightbulb className="w-5 h-5" />,
    details: [
      'Community ownership model',
      'Freemium with premium rooms',
      'Corporate sponsorship tiers',
      'Non-profit organization discounts',
      'Your creative suggestions welcome!'
    ]
  }
]

export function PricingFeedbackPopup({ isOpen, onClose, roomScope, roomName }: PricingFeedbackPopupProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [customFeedback, setCustomFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!selectedOption) return

    const feedbackData = {
      pricingChoice: selectedOption,
      customFeedback: customFeedback.trim(),
      roomScope,
      roomName,
      timestamp: new Date().toISOString()
    }

    // Track the pricing feedback
    trackPricingFeedback(selectedOption)

    // Store detailed feedback locally for demo
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('kamunity_pricing_feedback') || '[]')
      existingFeedback.push(feedbackData)
      localStorage.setItem('kamunity_pricing_feedback', JSON.stringify(existingFeedback))
    } catch (error) {
      console.warn('Failed to store pricing feedback:', error)
    }

    setSubmitted(true)
    
    // Auto-close after showing thank you message
    setTimeout(() => {
      onClose()
      setSubmitted(false)
      setSelectedOption(null)
      setCustomFeedback('')
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <Heading level={3} className="mb-2">Thank You!</Heading>
            <Text variant="body-base" color="muted">
              Your feedback helps us build a sustainable platform that serves the community best.
            </Text>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <Flex justify="between" align="center">
            <div>
              <Heading level={2} className="mb-2">Help Shape Kamunity's Future 🚀</Heading>
              <Text variant="body-base" color="muted">
                You've just created "{roomName || 'a new room'}" - what pricing model would make this platform sustainable for you?
              </Text>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </Flex>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-6">
            <Text variant="body-small" className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg">
              💡 <strong>Room Scope:</strong> {roomScope}
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {pricingOptions.map((option) => (
              <div
                key={option.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${option.popular ? 'ring-2 ring-primary-200' : ''}`}
                onClick={() => setSelectedOption(option.id)}
              >
                {option.popular && (
                  <div className="absolute -top-2 left-4 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                    Most Popular
                  </div>
                )}
                
                <Flex gap="sm" align="start" className="mb-3">
                  <div className="text-primary-600 mt-1">
                    {option.icon}
                  </div>
                  <div>
                    <Heading level={4} className="mb-1">{option.title}</Heading>
                    <Text variant="body-small" color="muted">
                      {option.description}
                    </Text>
                  </div>
                </Flex>

                <ul className="space-y-1">
                  {option.details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>

                {selectedOption === option.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedOption === 'other' && (
            <div className="mb-6">
              <Text variant="body-small" weight="semibold" className="mb-2">
                Share your pricing ideas:
              </Text>
              <textarea
                value={customFeedback}
                onChange={(e) => setCustomFeedback(e.target.value)}
                placeholder="What pricing model would work best for you? Any creative ideas for making Kamunity sustainable while serving the community?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 text-sm"
              />
            </div>
          )}

          <Flex gap="sm" justify="end">
            <Button variant="outline" onClick={onClose}>
              Skip for Now
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedOption}
            >
              Submit Feedback
            </Button>
          </Flex>

          <Text variant="caption" color="muted" className="text-center mt-4">
            This is demo feedback collection - your input helps us understand what pricing model would work best for the community.
          </Text>
        </CardContent>
      </Card>
    </div>
  )
}
