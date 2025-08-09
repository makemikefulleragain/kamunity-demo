'use client'

import { useParams } from 'next/navigation'
import { RealTimeChat } from '@/components/chat/RealTimeChat'
import { Container, Section } from '@/components/ui'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'

export default function ChatRoomPage() {
  const params = useParams()
  const roomId = params.id as string
  const { user } = useAuth()

  // Let RealTimeChat component handle all data fetching
  // This eliminates the race condition and duplicate logic

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

      {/* Chat Interface - Let RealTimeChat handle all data and UI */}
      <Section spacing="sm" className="flex-1">
        <Container className="h-full">
          <div className="bg-white rounded-lg shadow-sm border h-[600px]">
            <RealTimeChat roomId={roomId} userId={user?.id} />
          </div>
        </Container>
      </Section>
    </div>
  )
}
