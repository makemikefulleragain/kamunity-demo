'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Container, Section, Heading, Text } from '@/components/ui'
import { MessageCircle, Compass, ArrowRight } from 'lucide-react'

interface OnboardingChoiceProps {
  user: {
    id: string
    name: string
    email: string
    emoji_avatar: string
    demoData: any
  }
  onChoice: (choice: 'chat' | 'tour') => void
}

export function OnboardingChoice({ user, onChoice }: OnboardingChoiceProps) {
  const [selectedChoice, setSelectedChoice] = useState<'chat' | 'tour' | null>(null)

  const handleChoice = (choice: 'chat' | 'tour') => {
    setSelectedChoice(choice)
    // Small delay for visual feedback
    setTimeout(() => {
      onChoice(choice)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Container className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{user.emoji_avatar}</div>
            <Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Kamunity, {user.name}! 🎉
            </Heading>
            <Text className="text-gray-600 text-lg">
              You're all set up! How would you like to explore the platform?
            </Text>
          </div>

          {/* User Profile Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl">{user.demoData.passionArea.includes('Education') ? '📚' : 
                                          user.demoData.passionArea.includes('Environment') ? '🌱' :
                                          user.demoData.passionArea.includes('Technology') ? '💻' :
                                          user.demoData.passionArea.includes('Health') ? '🏥' :
                                          user.demoData.passionArea.includes('Arts') ? '🎨' :
                                          user.demoData.passionArea.includes('Social Justice') ? '⚖️' :
                                          user.demoData.passionArea.includes('Community') ? '🤝' :
                                          user.demoData.passionArea.includes('Entrepreneurship') ? '🚀' :
                                          user.demoData.passionArea.includes('Science') ? '🔬' :
                                          user.demoData.passionArea.includes('Sports') ? '⚽' : '🌟'}</div>
              <div>
                <Text className="font-medium text-gray-900">Your passion area:</Text>
                <Text className="text-gray-600">{user.demoData.passionArea}</Text>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl">👥</div>
              <div>
                <Text className="font-medium text-gray-900">Community involvement:</Text>
                <Text className="text-gray-600 capitalize">{user.demoData.communityInvolvementScale} level</Text>
              </div>
            </div>
          </div>

          {/* Choice Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Quick Chat Option */}
            <button
              onClick={() => handleChoice('chat')}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-300 ${
                selectedChoice === 'chat' 
                  ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <Heading level={3} className="text-xl font-semibold text-gray-900">
                    Jump Right In
                  </Heading>
                  <Text className="text-blue-600 font-medium">Start chatting immediately</Text>
                </div>
              </div>
              <Text className="text-gray-600 mb-4">
                Dive straight into live conversations with other demo participants. Perfect if you learn by doing and want to experience real-time community building.
              </Text>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <span>Go to Chat Hub</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Guided Tour Option */}
            <button
              onClick={() => handleChoice('tour')}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-300 ${
                selectedChoice === 'tour' 
                  ? 'border-green-500 bg-green-50 scale-105 shadow-lg' 
                  : 'border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Compass className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <Heading level={3} className="text-xl font-semibold text-gray-900">
                    Show Me Around
                  </Heading>
                  <Text className="text-green-600 font-medium">Take a guided tour first</Text>
                </div>
              </div>
              <Text className="text-gray-600 mb-4">
                Get a comprehensive overview of Kamunity's features, philosophy, and how communities progress from Chat → Focus Rooms → Clubs → Communities.
              </Text>
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span>Start Platform Tour</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <Text className="text-gray-500 text-sm">
              Don't worry - you can always explore the other option later! This demo is designed to be flexible and user-centered.
            </Text>
          </div>
        </div>
      </Container>
    </div>
  )
}
