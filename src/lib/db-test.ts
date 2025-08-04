// Database operations test for new content management models
// Run this to verify our schema changes work correctly

import { PrismaClient } from '@prisma/client'
import { CreateContentUploadData, CreateReactionData, CreateAnalyticsEventData } from '@/types/content'

const prisma = new PrismaClient()

export async function testDatabaseOperations() {
  console.log('🧪 Testing database operations for content management...')
  
  try {
    // Test 1: Create a test user (if not exists)
    let testUser = await prisma.user.findFirst({
      where: { email: 'test@kamunity.org' }
    })
    
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test@kamunity.org',
          name: 'Test User'
        }
      })
      console.log('✅ Created test user:', testUser.id)
    } else {
      console.log('✅ Found existing test user:', testUser.id)
    }

    // Test 2: Create a content upload
    const uploadData: CreateContentUploadData = {
      filename: 'test-image.jpg',
      originalName: 'My Test Image.jpg',
      fileType: 'image',
      fileSize: 1024000,
      mimeType: 'image/jpeg',
      storageLocation: '/uploads/test/test-image.jpg'
    }

    const upload = await prisma.contentUpload.create({
      data: {
        ...uploadData,
        uploaderId: testUser.id
      }
    })
    console.log('✅ Created content upload:', upload.id)

    // Test 3: Create reactions on the upload
    const reactionTypes = ['fun', 'spot_on', 'nice'] as const
    
    for (const reactionType of reactionTypes) {
      const reactionData: CreateReactionData = {
        reactionType,
        contentType: 'upload',
        contentId: upload.id,
        uploadId: upload.id
      }

      const reaction = await prisma.reaction.create({
        data: {
          ...reactionData,
          userId: testUser.id
        }
      })
      console.log(`✅ Created ${reactionType} reaction:`, reaction.id)
    }

    // Test 4: Create analytics event
    const analyticsData: CreateAnalyticsEventData = {
      eventType: 'content_upload',
      sessionId: 'test-session-123',
      metadata: {
        fileType: upload.fileType,
        fileSize: upload.fileSize,
        uploadId: upload.id
      },
      userId: testUser.id
    }

    const analyticsEvent = await prisma.analyticsEvent.create({
      data: analyticsData
    })
    console.log('✅ Created analytics event:', analyticsEvent.id)

    // Test 5: Query with relations
    const uploadWithReactions = await prisma.contentUpload.findUnique({
      where: { id: upload.id },
      include: {
        uploader: true,
        reactions: {
          include: {
            user: true
          }
        }
      }
    })
    console.log('✅ Queried upload with relations:', {
      uploadId: uploadWithReactions?.id,
      uploaderName: uploadWithReactions?.uploader.name,
      reactionCount: uploadWithReactions?.reactions.length
    })

    // Test 6: Aggregate reaction counts
    const reactionCounts = await prisma.reaction.groupBy({
      by: ['reactionType'],
      where: {
        contentType: 'upload',
        contentId: upload.id
      },
      _count: {
        id: true
      }
    })
    console.log('✅ Reaction counts:', reactionCounts)

    // Test 7: Analytics query
    const eventCount = await prisma.analyticsEvent.count({
      where: {
        eventType: 'content_upload',
        userId: testUser.id
      }
    })
    console.log('✅ Analytics event count:', eventCount)

    console.log('🎉 All database operations completed successfully!')
    
    return {
      success: true,
      testUser,
      upload,
      reactionCounts,
      eventCount
    }

  } catch (error) {
    console.error('❌ Database operation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Export individual operation functions for reuse
export async function createContentUpload(data: CreateContentUploadData & { uploaderId: string }) {
  return prisma.contentUpload.create({ data })
}

export async function createReaction(data: CreateReactionData & { userId: string }) {
  return prisma.reaction.create({ data })
}

export async function createAnalyticsEvent(data: CreateAnalyticsEventData) {
  return prisma.analyticsEvent.create({ data })
}

export async function getContentWithReactions(contentId: string) {
  return prisma.contentUpload.findUnique({
    where: { id: contentId },
    include: {
      uploader: true,
      reactions: {
        include: {
          user: true
        }
      }
    }
  })
}

export async function getReactionCounts(contentType: string, contentId: string) {
  return prisma.reaction.groupBy({
    by: ['reactionType'],
    where: { contentType, contentId },
    _count: { id: true }
  })
}
