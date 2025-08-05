'use client'

import { useState, useEffect } from 'react'
import { Container, Section, Grid, Flex } from '@/components/ui/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'
import SummaryPanel from '@/components/summaries/SummaryPanel'
import ContentUpload from '@/components/content/ContentUpload';
import { ChatMessage } from '@/components/chat/ChatMessage';
import KaiCharacter from '@/components/KaiCharacter';
import { cn } from '@/lib/utils';
import { FocusRoom, ContentUpload as ContentUploadType, Message } from '@/types/communities'

interface RoomPageProps {
  params: { id: string }
}

const FocusRoomPage: React.FC<RoomPageProps> = ({ params }) => {
  const [room, setRoom] = useState<FocusRoom | null>(null)
  const [uploads, setUploads] = useState<ContentUploadType[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newMessage, setNewMessage] = useState('')

  // Mock data for development - replace with real API calls
  useEffect(() => {
    const mockRoom: FocusRoom = {
      id: params.id,
      name: 'Sustainable Urban Farming',
      purpose: 'Creating resilient local food systems through community gardens and urban agriculture',
      description: 'A collaborative space for planning, sharing resources, and coordinating urban farming initiatives across our community. We focus on practical solutions, knowledge sharing, and building connections between gardeners.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      clubId: 'club-1',
      status: 'active',
      isPrivate: false,
      maxMembers: 50,
      tags: ['urban-farming', 'sustainability', 'community-gardens', 'food-security'],
      pinnedContent: '🌱 Welcome! Please introduce yourself and share your gardening experience. Check out our resource library in the uploads section.',
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      messageCount: 127,
      memberCount: 23,
      club: {
        id: 'club-1',
        name: 'Urban Gardens Initiative',
        community: {
          id: 'comm-1',
          name: 'Climate Action Network'
        }
      } as any
    }

    const mockUploads: ContentUploadType[] = [
      {
        id: 'upload-1',
        filename: 'garden-layout-plan.pdf',
        originalName: 'Community Garden Layout Plan.pdf',
        fileType: 'document',
        fileSize: 2048000,
        mimeType: 'application/pdf',
        storageLocation: '/uploads/garden-layout-plan.pdf',
        moderationStatus: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        uploaderId: 'user-1',
        description: 'Proposed layout for the new community garden on 5th Street',
        tags: ['garden-design', 'layout', 'planning'],
        isPublic: true,
        focusRoomId: params.id,
        uploader: {
          id: 'user-1',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          avatarUrl: undefined
        } as any
      },
      {
        id: 'upload-2',
        filename: 'soil-test-results.jpg',
        originalName: 'Soil Test Results - March 2024.jpg',
        fileType: 'image',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        storageLocation: '/uploads/soil-test-results.jpg',
        moderationStatus: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        uploaderId: 'user-2',
        description: 'Latest soil test results showing pH and nutrient levels',
        tags: ['soil-testing', 'data', 'analysis'],
        isPublic: true,
        focusRoomId: params.id,
        uploader: {
          id: 'user-2',
          name: 'Marcus Johnson',
          email: 'marcus@example.com',
          avatarUrl: undefined
        } as any
      }
    ]

    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        content: 'Great work on the soil testing, Marcus! The pH levels look perfect for tomatoes and peppers. Should we start planning the spring planting schedule?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        authorId: 'user-1',
        conversationId: 'conv-1',
        author: {
          id: 'user-1',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          avatarUrl: undefined
        } as any
      },
      {
        id: 'msg-2',
        content: 'Absolutely! I was thinking we could do a community planting day next Saturday. I can bring seedlings from my greenhouse.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
        authorId: 'user-2',
        conversationId: 'conv-1',
        author: {
          id: 'user-2',
          name: 'Marcus Johnson',
          email: 'marcus@example.com',
          avatarUrl: undefined
        } as any
      },
      {
        id: 'msg-3',
        content: 'Count me in! I can help with the layout setup. The new garden design looks amazing in the PDF you shared, Sarah.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        authorId: 'user-3',
        conversationId: 'conv-1',
        author: {
          id: 'user-3',
          name: 'Elena Rodriguez',
          email: 'elena@example.com',
          avatarUrl: undefined
        } as any
      }
    ]

    setRoom(mockRoom)
    setUploads(mockUploads)
    setMessages(mockMessages)
    setIsLoading(false)
  }, [params.id])

  const handleUploadComplete = (file: File) => {
    // Convert File to ContentUploadType for mock purposes
    const upload: ContentUploadType = {
      id: Date.now().toString(),
      filename: file.name,
      originalName: file.name,
      fileType: file.type.startsWith('image/') ? 'image' : 'document',
      fileSize: file.size,
      mimeType: file.type,
      storageLocation: `/uploads/${file.name}`,
      moderationStatus: 'approved',
      createdAt: new Date(),
      updatedAt: new Date(),
      uploaderId: 'current-user-id',
      tags: [],
      isPublic: true
    };
    
    setRoom(prev => prev ? {
      ...prev,
      uploads: [...(prev.uploads || []), upload]
    } : null)
    setShowUploadModal(false)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      createdAt: new Date(),
      authorId: 'current-user',
      conversationId: 'conv-1',
      author: {
        id: 'current-user',
        name: 'You',
        email: 'you@example.com',
        avatarUrl: undefined
      } as any
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <Text>Loading focus room...</Text>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <Text>Focus room not found</Text>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Container size="full" className="py-6">
        {/* Room Header */}
        <Section spacing="sm">
          <div className="mb-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-neutral-600 mb-4">
              <Text variant="body-small" color="muted">
                {room.club?.community?.name} → {room.club?.name} → Focus Room
              </Text>
            </div>

            {/* Room Title & Status */}
            <Flex justify="between" align="start" className="mb-4">
              <div className="flex-1">
                <Flex align="center" className="mb-2">
                  <Heading level={1} className="text-neutral-900 mr-3">
                    {room.name}
                  </Heading>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full border',
                    room.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                    room.status === 'dormant' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  )}>
                    {room.status}
                  </span>
                  {room.isPrivate && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                      Private
                    </span>
                  )}
                </Flex>
                
                <Text className="text-neutral-700 mb-3">
                  {room.purpose}
                </Text>

                {room.description && (
                  <Text variant="body-small" color="muted" className="mb-3">
                    {room.description}
                  </Text>
                )}

                {/* Room Stats */}
                <Flex align="center" gap="md" className="mb-3">
                  <div className="flex items-center">
                    <Text variant="body-small" color="muted" className="mr-1">
                      👥 {room.memberCount} members
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Text variant="body-small" color="muted" className="mr-1">
                      💬 {room.messageCount} messages
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Text variant="body-small" color="muted" className="mr-1">
                      📁 {uploads.length} uploads
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Text variant="body-small" color="muted">
                      🕒 Active {Math.floor((Date.now() - room.lastActivity.getTime()) / (1000 * 60))} min ago
                    </Text>
                  </div>
                </Flex>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" size="sm">
                  Join Room
                </Button>
                <Button variant="outline" size="sm">
                  Invite Members
                </Button>
              </div>
            </Flex>

            {/* Pinned Content */}
            {room.pinnedContent && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <Text variant="body-small" className="text-primary-800">
                  📌 {room.pinnedContent}
                </Text>
              </div>
            )}
          </div>
        </Section>

        <Grid cols={12} gap="lg">
          {/* Left Sidebar - AI Summary */}
          <div className="col-span-12 lg:col-span-3">
            <SummaryPanel 
              onFilterChange={(timeframe, category) => {
                // Handle filter changes for room-specific content
                console.log('Room filter changed:', timeframe, category);
              }}
            />
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-6">
            <div className="space-y-6">
              {/* Chat Messages */}
              <Card>
                <CardHeader>
                  <Flex justify="between" align="center">
                    <CardTitle>Room Discussion</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowUploadModal(true)}
                    >
                      Share File
                    </Button>
                  </Flex>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {messages.map(message => (
                      <ChatMessage
                        key={message.id}
                        id={message.id}
                        content={message.content}
                        createdAt={message.createdAt}
                        conversationId={room.id}
                        author={{
                          id: message.author?.id || 'unknown',
                          name: message.author?.name || 'Unknown',
                          avatarUrl: message.author?.avatarUrl || undefined
                        }}
                        reactions={[]}
                        uploads={[]}
                        onReact={(messageId, reaction) => {
                          console.log('React to message:', messageId, reaction)
                        }}
                        onReply={(messageId) => {
                          console.log('Reply to message:', messageId)
                        }}
                      />
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <Button onClick={handleSendMessage}>
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - Uploads & Activity */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6">
              {/* Recent Uploads */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploads.length === 0 ? (
                      <Text variant="body-small" color="muted" className="text-center py-4">
                        No uploads yet
                      </Text>
                    ) : (
                      uploads.map(upload => (
                        <div key={upload.id} className="border border-neutral-200 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <Text variant="body-small" weight="medium" className="text-neutral-900">
                                {upload.originalName}
                              </Text>
                              <Text variant="body-small" color="muted">
                                by {upload.uploader?.name} • {new Date(upload.createdAt).toLocaleDateString()}
                              </Text>
                            </div>
                            <span className={cn(
                              'px-2 py-1 text-xs rounded-full',
                              upload.fileType === 'image' ? 'bg-green-100 text-green-700' :
                              upload.fileType === 'document' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            )}>
                              {upload.fileType}
                            </span>
                          </div>
                          
                          {upload.description && (
                            <Text variant="body-small" className="text-neutral-700 mb-2">
                              {upload.description}
                            </Text>
                          )}

                          <div className="flex flex-wrap gap-1 mb-2">
                            {upload.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-1 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Reactions temporarily disabled */}
                          <div className="text-sm text-gray-500 mt-2">
                            👍 💡 🎯 reactions coming soon!
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Grid>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header with Kai */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-t-lg">
                <Flex justify="between" align="start" className="mb-4">
                  <div className="flex-1">
                    <KaiCharacter
                      variant="inline"
                      expression="excited"
                      size="md"
                      title="📎 Share Something Amazing!"
                      message="Ready to contribute to this room? I'm excited to see what you'll share with the community!"
                    />
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors ml-4 p-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Flex>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <Text variant="body-large" className="mb-2 font-medium">What would you like to share? 🌟</Text>
                  <Text variant="body-small" color="muted">
                    Upload documents, images, or files that will help move this room's goals forward. 
                    Your contributions make a real difference!
                  </Text>
                </div>
                
                <ContentUpload
                  onUploadComplete={handleUploadComplete}
                  maxFileSize={10 * 1024 * 1024} // 10MB
                  acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
                />
                
                {/* Helpful Tips */}
                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                  <Text variant="body-small" className="font-medium text-primary-700 mb-2">💡 Kai's Tips:</Text>
                  <ul className="text-sm text-primary-600 space-y-1">
                    <li>• Images and PDFs work great for sharing ideas</li>
                    <li>• Documents help organize thoughts and plans</li>
                    <li>• Keep files under 10MB for best performance</li>
                    <li>• Add a quick description when you upload!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

export default FocusRoomPage
