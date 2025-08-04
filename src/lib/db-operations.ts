// Database operations for content management
import { PrismaClient } from '@prisma/client'
import { CreateContentUploadData, CreateReactionData, CreateAnalyticsEventData } from '@/types/content'

const prisma = new PrismaClient()

// Content Upload Operations
export async function createContentUpload(data: CreateContentUploadData & { uploaderId: string }) {
  return prisma.contentUpload.create({ data })
}

export async function getContentUpload(id: string) {
  return prisma.contentUpload.findUnique({
    where: { id },
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

export async function getUserUploads(userId: string) {
  return prisma.contentUpload.findMany({
    where: { uploaderId: userId },
    include: {
      reactions: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Reaction Operations
export async function createReaction(data: CreateReactionData & { userId: string }) {
  return prisma.reaction.upsert({
    where: {
      userId_contentType_contentId: {
        userId: data.userId,
        contentType: data.contentType,
        contentId: data.contentId
      }
    },
    update: {
      reactionType: data.reactionType
    },
    create: data
  })
}

export async function removeReaction(userId: string, contentType: string, contentId: string) {
  return prisma.reaction.delete({
    where: {
      userId_contentType_contentId: {
        userId,
        contentType,
        contentId
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

// Analytics Operations
export async function createAnalyticsEvent(data: CreateAnalyticsEventData) {
  return prisma.analyticsEvent.create({ data })
}

export async function getAnalyticsSummary(eventType?: string, startDate?: Date, endDate?: Date) {
  return prisma.analyticsEvent.groupBy({
    by: ['eventType'],
    where: {
      ...(eventType && { eventType }),
      ...(startDate && endDate && {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      })
    },
    _count: { id: true }
  })
}

export { prisma }
