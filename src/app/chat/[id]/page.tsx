'use client'

import { useParams } from 'next/navigation'
import { Container, Section, Heading, Text, Card, CardContent } from '@/components/ui'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { chatSeeds } from '@/data/chatSeeds'

export default function ChatRoomPage() {
  const params = useParams()
  const roomId = params.id as string
  
  // Find the chat thread from seeds
  const chatThread = chatSeeds.find(chat => chat.id === roomId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <Section spacing="sm" className="border-b border-gray-200 bg-white">
        <Container>
          <div className="flex items-center gap-4 py-4">
            <Link 
              href="/chat" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Chat Hub</span>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Static Chat Display */}
      <Section spacing="md">
        <Container className="max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <Heading level={2} className="text-xl">
                    {chatThread?.title || 'Chat Thread'}
                  </Heading>
                  <Text color="muted" variant="body-small">
                    {chatThread?.category || 'Discussion'} • {chatThread?.commentCount || 0} replies
                  </Text>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <Text className="mb-4">
                  {chatThread?.description || 'This chat thread is part of the Kamunity demo experience.'}
                </Text>
                
                <div className="flex gap-2 flex-wrap">
                  {chatThread?.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600">💬</span>
                  <Text className="font-semibold text-blue-800">Demo Mode</Text>
                </div>
                <Text variant="body-small" className="text-blue-700">
                  This is a view-only demonstration of how chat threads appear in Kamunity. 
                  In the full platform, members can engage in real-time discussions that evolve into rooms and communities.
                </Text>
              </div>

              {chatThread?.engagement && chatThread.engagement > 20 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Text className="text-green-800 font-medium">
                    ✨ This thread has high engagement ({chatThread.engagement}%) and could be promoted to a Room!
                  </Text>
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      </Section>
    </div>
  )
}
