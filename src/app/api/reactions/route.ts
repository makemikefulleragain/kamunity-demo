import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Kamunity vibe check reactions
const ALLOWED_REACTIONS = [
  'fun',      // 😄 Light-hearted, entertaining content
  'spot_on',  // 🎯 Accurate, well-reasoned points
  'spicy',    // 🌶️ Controversial or provocative content
  'nice',     // 👍 Positive, supportive reactions
  'weird',    // 🤔 Unusual or unexpected content
  'intriguing' // 🔍 Thought-provoking, interesting content
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, contentType, reactionType, userId } = body

    // Validate required fields
    if (!contentId || !contentType || !reactionType || !userId) {
      return NextResponse.json({ 
        error: 'Missing required fields: contentId, contentType, reactionType, userId' 
      }, { status: 400 })
    }

    // Validate reaction type
    if (!ALLOWED_REACTIONS.includes(reactionType)) {
      return NextResponse.json({ 
        error: `Invalid reaction type. Allowed: ${ALLOWED_REACTIONS.join(', ')}` 
      }, { status: 400 })
    }

    // Check if user already reacted to this content
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        userId,
        contentId,
        contentType
      }
    })

    let reaction

    if (existingReaction) {
      if (existingReaction.reactionType === reactionType) {
        // Remove reaction if same type
        await prisma.reaction.delete({
          where: { id: existingReaction.id }
        })
        
        return NextResponse.json({ 
          success: true, 
          action: 'removed',
          reactionType 
        })
      } else {
        // Update reaction if different type
        reaction = await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { reactionType },
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        })
      }
    } else {
      // Create new reaction
      reaction = await prisma.reaction.create({
        data: {
          userId,
          contentId,
          contentType,
          reactionType
        },
        include: {
          user: {
            select: { id: true, name: true }
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      action: existingReaction ? 'updated' : 'created',
      reaction: {
        id: reaction.id,
        reactionType: reaction.reactionType,
        user: reaction.user,
        createdAt: reaction.createdAt
      }
    })

  } catch (error) {
    console.error('Reaction error:', error)
    return NextResponse.json({ 
      error: 'Failed to process reaction. Please try again.' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')

    if (!contentId || !contentType) {
      return NextResponse.json({ 
        error: 'Missing contentId and contentType parameters' 
      }, { status: 400 })
    }

    // Get all reactions for the content
    const reactions = await prisma.reaction.findMany({
      where: {
        contentId,
        contentType
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group reactions by type with counts
    const reactionCounts = ALLOWED_REACTIONS.reduce((acc, type) => {
      acc[type] = reactions.filter(r => r.reactionType === type).length
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      reactions,
      counts: reactionCounts,
      total: reactions.length
    })

  } catch (error) {
    console.error('Get reactions error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch reactions. Please try again.' 
    }, { status: 500 })
  }
}
