'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Container, Section, Heading, Text } from '@/components/ui'

interface PassionArea {
  id: number
  name: string
  description: string
  emoji: string
}

interface CommunityScale {
  value: string
  label: string
  description: string
}

interface DemoSignupProps {
  onSignupComplete: (userData: any, sessionToken: string) => void
  onError: (error: string) => void
}

export function DemoSignup({ onSignupComplete, onError }: DemoSignupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passionArea: '',
    passionDescription: '', // For step 2: passion area explanation
    communityInvolvementScale: '',
    communityInvolvementTypes: [] as string[],
    additionalInterests: '', // For step 3: selected interests (comma-separated)
    interestsExplanation: '' // For step 3: why interests matter explanation
  })
  
  const [passionAreas, setPassionAreas] = useState<PassionArea[]>([])
  const [communityTypes, setCommunityTypes] = useState<string[]>([])
  const [communityScales, setCommunityScales] = useState<CommunityScale[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    // Load form options
    fetch('/api/auth/demo-signup')
      .then(res => res.json())
      .then(data => {
        setPassionAreas(data.passionAreas || [])
        setCommunityTypes(data.communityTypes || [])
        setCommunityScales(data.communityScales || [])
      })
      .catch(err => {
        console.error('Failed to load form options:', err)
        onError('Failed to load signup form')
      })
  }, [onError])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCommunityTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      communityInvolvementTypes: prev.communityInvolvementTypes.includes(type)
        ? prev.communityInvolvementTypes.filter(t => t !== type)
        : [...prev.communityInvolvementTypes, type]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields based on current step
    if (!formData.name || !formData.email || !formData.passionArea) {
      onError('Please fill in all required fields')
      return
    }
    
    // Community involvement scale is required for final submission
    if (!formData.communityInvolvementScale) {
      onError('Please complete the community involvement section')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/demo-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        onSignupComplete(result.user, result.sessionToken)
      } else {
        onError(result.message || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      onError('Network error during signup')
    } finally {
      setLoading(false)
    }
  }

  const selectedPassionArea = passionAreas.find(area => area.name === formData.passionArea)
  const selectedCommunityScale = communityScales.find(scale => scale.value === formData.communityInvolvementScale)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🌟</div>
            <Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">
              Join the Kamunity Demo
            </Heading>
            <Text className="text-gray-600 text-lg">
              Help us understand how to build better communities together
            </Text>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <Heading level={2} className="text-xl font-semibold text-gray-900">
                  Tell us about yourself
                </Heading>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                  <Text className="text-sm text-gray-500 mt-1">
                    We'll use this to follow up after the demo
                  </Text>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.name || !formData.email}
                    className="px-6 py-2"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Passion Areas & Interests */}
            {step === 2 && (
              <div className="space-y-6">
                <Heading level={2} className="text-xl font-semibold text-gray-900">
                  What are your interests and passions?
                </Heading>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Areas of Interest * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {passionAreas.map((area) => {
                      const selectedAreas = formData.passionArea.split(',').map(a => a.trim()).filter(a => a)
                      const isSelected = selectedAreas.includes(area.name)
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => {
                            const newAreas = isSelected 
                              ? selectedAreas.filter(a => a !== area.name)
                              : [...selectedAreas, area.name]
                            handleInputChange('passionArea', newAreas.join(', '))
                          }}
                          className={`p-4 text-left border rounded-lg transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{area.emoji}</span>
                            <div>
                              <div className="font-medium text-gray-900">{area.name}</div>
                              <div className="text-sm text-gray-500">{area.description}</div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {formData.passionArea && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <Text className="text-sm font-medium text-blue-900 mb-1">Selected areas:</Text>
                      <Text className="text-sm text-blue-700">{formData.passionArea}</Text>
                    </div>
                  )}
                </div>

                {formData.passionArea && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us more about your interests in these areas
                    </label>
                    <textarea
                      value={formData.passionDescription}
                      onChange={(e) => handleInputChange('passionDescription', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="What specifically interests you about these areas? What experiences have you had?"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What other interests do you have and why do they matter to you?
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      'Reading & Writing', 'Music & Arts', 'Cooking & Food', 'Travel & Culture',
                      'Gaming & Tech', 'Fitness & Sports', 'Nature & Outdoors', 'Photography',
                      'Volunteering', 'Learning Languages', 'Meditation & Mindfulness', 'Entrepreneurship'
                    ].map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => {
                          const currentInterests = formData.additionalInterests.split(',').map(i => i.trim()).filter(i => i)
                          const hasInterest = currentInterests.includes(interest)
                          const newInterests = hasInterest 
                            ? currentInterests.filter(i => i !== interest)
                            : [...currentInterests, interest]
                          handleInputChange('additionalInterests', newInterests.join(', '))
                        }}
                        className={`p-3 text-sm text-left border rounded-lg transition-all ${
                          formData.additionalInterests.includes(interest)
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {formData.additionalInterests && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <Text className="text-sm font-medium text-blue-900 mb-1">Selected interests:</Text>
                      <Text className="text-sm text-blue-700">{formData.additionalInterests}</Text>
                    </div>
                  )}
                  <textarea
                    value={formData.interestsExplanation}
                    onChange={(e) => handleInputChange('interestsExplanation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Why do these interests matter to you? What drives your passion for them?"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="px-6 py-2"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.passionArea}
                    className="px-6 py-2"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Community Involvement */}
            {step === 3 && (
              <div className="space-y-6">
                <Heading level={2} className="text-xl font-semibold text-gray-900">
                  Community involvement
                </Heading>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How involved are you in communities? *
                  </label>
                  <div className="space-y-3">
                    {communityScales.map((scale) => (
                      <button
                        key={scale.value}
                        type="button"
                        onClick={() => handleInputChange('communityInvolvementScale', scale.value)}
                        className={`w-full p-4 text-left border rounded-lg transition-all ${
                          formData.communityInvolvementScale === scale.value
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{scale.label}</div>
                        <div className="text-sm text-gray-500">{scale.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.communityInvolvementScale && formData.communityInvolvementScale !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What types of communities are you involved in? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {communityTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleCommunityTypeToggle(type)}
                          className={`p-3 text-sm text-left border rounded-lg transition-all ${
                            formData.communityInvolvementTypes.includes(type)
                              ? 'border-blue-500 bg-blue-50 text-blue-900'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="px-6 py-2"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.name || !formData.email || !formData.passionArea || !formData.communityInvolvementScale}
                    className="px-8 py-2"
                  >
                    {loading ? 'Creating Account...' : 'Join Demo 🚀'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </Container>
    </div>
  )
}
