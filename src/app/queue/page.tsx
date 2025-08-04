'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Section, Heading, Text, Button } from '@/components/ui'
import KaiCharacter from '@/components/KaiCharacter'

export default function QueuePage() {
  const router = useRouter()
  const [queuePosition, setQueuePosition] = useState(Math.floor(Math.random() * 20) + 1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate queue movement
  useEffect(() => {
    const interval = setInterval(() => {
      setQueuePosition(prev => Math.max(1, prev - Math.floor(Math.random() * 3)))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    // Simulate checking for available spots
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Random chance to let user through (simulate spots opening up)
    if (Math.random() > 0.7) {
      router.push('/news')
      return
    }
    
    setQueuePosition(Math.max(1, queuePosition - 1))
    setIsRefreshing(false)
  }

  const sarcastic_messages = [
    "🎭 Well, well, well... looks like everyone wants to join the party!",
    "🎪 You're in the VIP waiting room now! (Very Important... Patience required)",
    "🎨 Think of this as a digital meditation session. Very zen. Much wait.",
    "🎯 Good things come to those who wait... and refresh... and wait some more.",
    "🎊 You're not stuck in traffic, you ARE the traffic! But digital traffic.",
    "🎈 This is like a really exclusive club, except the bouncer is a computer.",
    "🎭 Plot twist: The real Kamunity was the friends we made while waiting!",
    "🎪 Breaking news: Local person discovers the ancient art of patience!"
  ]

  const [currentMessage] = useState(
    sarcastic_messages[Math.floor(Math.random() * sarcastic_messages.length)]
  )

  return (
    <Section spacing="xl" className="min-h-screen flex items-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <KaiCharacter
            variant="card"
            expression="thinking"
            size="xl"
            title="🚦 Hold Up There, Speed Racer!"
            message={currentMessage}
          />
          
          <div className="mt-8 space-y-6">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
              <Heading level={3} className="mb-2 text-primary-700">
                Demo Capacity Reached
              </Heading>
              <Text variant="body-large" color="muted" className="mb-4">
                We've hit our demo limit of 100 concurrent users! 
                <br />
                You're currently position <strong>#{queuePosition}</strong> in the queue.
              </Text>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="primary"
                  className="min-w-[200px]"
                >
                  {isRefreshing ? '🔄 Checking for spots...' : '🎯 Try to Connect'}
                </Button>
                
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                >
                  🏠 Back to Home
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Text variant="body-small" color="muted" className="text-yellow-800">
                💡 <strong>Pro Tip:</strong> This queue system ensures everyone gets a smooth demo experience. 
                In a real deployment, we'd scale automatically to handle more users!
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl mb-2">⚡</div>
                <Text variant="body-small" className="font-medium">Real-time Updates</Text>
                <Text variant="caption" color="muted">Queue position updates automatically</Text>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl mb-2">🎯</div>
                <Text variant="body-small" className="font-medium">Fair Queue System</Text>
                <Text variant="caption" color="muted">First come, first served</Text>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl mb-2">🚀</div>
                <Text variant="body-small" className="font-medium">Worth the Wait</Text>
                <Text variant="caption" color="muted">Amazing demo experience ahead</Text>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
